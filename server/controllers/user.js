import _ from "lodash";
import pool from "../configuration/connectDB.js";
import { convertToMailObject, get3DigitRandomId } from "../lib/helper.js";
import { checkAvaliabilityOfStocks, sendToken } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import bcrypt from "bcrypt";
import Transporter from "../configuration/emailConfig.js";

class UserController {
  static getMyself = async (req, res, next) => {
    try {
      return res.status(200).json({
        success: true,
        message: req.user,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static login = async (req, res, next) => {
    const { email, password } = req.body;
    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );
      if (rows.length <= 0)
        return next(new ErrorHandler("Wrong Password Or Email", 404));

      const isPasswordSame = bcrypt.compare(password, rows[0].password);

      if (!isPasswordSame)
        return next(new ErrorHandler("Wrong Password Or Email", 401));

      const user = _.omit(rows[0], "password");
      sendToken(res, user, 200, "Login Success", "User");
    } catch (error) {
      return res.status(500).json({ status: false, message: "Server Error" });
    } finally {
      client.release();
    }
  };

  static logout = async (req, res, next) => {
    const client = await pool.connect();
    try {
      res.clearCookie("loggedUser");
      res.status(200).json({
        success: true,
        message: "Logged Out Successfully",
      });
    } catch (error) {
      next(error);
    } finally {
      client.release();
    }
  };

  static editMyself = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { userId, name, email, phonenumber, password } = req.body;

      //check if the user is valid or not
      const { rows: isValidUser } = await client.query(
        "SELECT * FROM users WHERE id=$1",
        [userId]
      );
      if (isValidUser.length === 0)
        return next(new ErrorHandler("User Not Found", 404));

      //check email or phonenumber should be unique
      const { rows: unqiueEmailPhoneNumber } = await client.query(
        `SELECT * FROM users WHERE (email = $1 OR phonenumber = $2) AND id != $3;`,
        [email, phonenumber, userId]
      );

      if (unqiueEmailPhoneNumber.length !== 0)
        return next(
          new ErrorHandler(
            `${
              isValidUser[0]?.email === email ? "Email" : "Phone Number"
            } Already exists!`,
            404
          )
        );

      // const salt = await bcrypt.genSalt(10);
      // const newHashedPassword = password = await bcrypt.hash(password, salt);

      //now update the user
      const { rows } = await client.query(
        `UPDATE users SET name=$1, email=$2, phonenumber=$3, password=$4 WHERE id=$5 RETURNING *`,
        [name, email, phonenumber, password, userId]
      );

      const user = _.omit(rows[0], "password");

      return res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static register = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { name, email, password, phonenumber } = req.body;

      const { rows: isUserExist } = await client.query(
        `SELECT * FROM users where email=$1 OR phonenumber=$2`,
        [email, phonenumber]
      );
      if (isUserExist.length !== 0)
        return next(
          new ErrorHandler(
            `Duplicate ${
              isUserExist[0].email === email ? "Email" : "Phone Number"
            }`,
            404
          )
        );

      const id = "A" + get3DigitRandomId();

      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(password, salt);

      await client.query(`CALL add_user_procedure($1, $2, $3, $4, $5)`, [
        id,
        name,
        email,
        newHashedPassword,
        phonenumber,
      ]);

      sendToken(
        res,
        { id, name, email, phonenumber },
        200,
        "Registered Successfully",
        "User"
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static placeOrder = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { cart, shippingDetails, orderDetails, user, paymentDetails } =
        req.body;

      //first we had to insert to shippingDetails table
      const shippingId = "S" + get3DigitRandomId();

      const { name, address, city, postalCode, contactNumber } =
        shippingDetails;

      //second we had to insert to orders table
      const orderId = "O" + get3DigitRandomId();

      const { price, status, orderplaced } = orderDetails;

      //third we had to insert to orderitems table
      const allItemIds = cart?.map(
        ({ details, price, quantity }, index) => details?.split(",")[0]
      );
      const allItemQuantities = cart?.map(
        ({ details, price, quantity }, index) => quantity
      );
      const queryParams = allItemIds.map((id, index) => ({
        orderId,
        itemId: id,
        quantity: allItemQuantities[index],
      }));
      let query = `INSERT INTO orderitems(order_id, item_id, quantity) VALUES ${queryParams
        .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
        .join(", ")}`;
      const queryValues = queryParams.flatMap(
        ({ orderId, itemId, quantity }) => [orderId, itemId, quantity]
      );

      //fourth we had to insert to payment table

      // cardNumber,
      //   cardHolderName,
      //   cardExpDate, USE STRIPE/RAZORPAY TO ENCRYPT THIS. IMPLEMENT THIS LATER

      const { paymentAmount, paymentStatus, paymentMethod } = paymentDetails;
      const paymentId = "P" + get3DigitRandomId();

      //fifth we also had to update the items table and subtract the quantity from the stock
      //Check this first, if this fails then no need to go further, just abort transaction and notify the user
      const updates = allItemIds
        .map((itemId, index) => {
          return `WHEN id = $${index * 2 + 1} THEN quantity - $${
            index * 2 + 2
          }`;
        })
        .join(" ");

      const placeholders = allItemIds.reduce((acc, itemId, index) => {
        acc.push(itemId, allItemQuantities[index]);
        return acc;
      }, []);

      const updateQuery = `
        UPDATE items
        SET quantity = CASE
          ${updates}
          ELSE quantity
        END
        WHERE id IN (${allItemIds
          .map((_, index) => `$${index * 2 + 1}`)
          .join(", ")});`;

      // TRANSACTIONS COMES HERE!!

      await client.query("BEGIN");
      // 5
      const someOutOfStockItemsReq = await checkAvaliabilityOfStocks(
        allItemIds,
        allItemQuantities
      );
      if (someOutOfStockItemsReq.length > 0) {
        //means some items are req which are out of stock

        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: "Some items are out of stock",
          someOutOfStockItemsReq,
        });
      }

      await client.query(updateQuery, placeholders);
      // 1
      await client.query(
        `INSERT INTO shippingdetails (id, name, address, city, postalcode, contactnumber) VALUES ($1, $2, $3, $4, $5, $6)`,
        [shippingId, name, address, city, postalCode, contactNumber]
      );

      //2
      await client.query(
        `INSERT INTO orders (id, userid, shippingid, price, status, orderplaced) VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, user.id, shippingId, price, status, orderplaced]
      );

      //3(orderitems table)
      await client.query(query, queryValues);

      // 4
      await client.query(
        `INSERT into payment (payment_id, order_id, payer_id, payment_amount, payment_status, payment_type) VALUES ($1,$2, $3, $4, $5, $6)`,
        [
          paymentId,
          orderId,
          user.id,
          paymentAmount,
          paymentStatus,
          paymentMethod,
        ]
      );
      await client.query("COMMIT");

      // now send reciept on email to that user

      // const mailOptions = convertToMailObject(
      //   cart,
      //   shippingDetails,
      //   orderDetails,
      //   paymentDetails,
      //   user
      // );

      // Transporter.sendMail(mailOptions, (error, info) => {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log("Email sent: " + info.response);
      //   }
      // });
      //Debugging consoles

      // console.log("shippingDetails", shippingDetails);
      // console.log("orderDetails", orderDetails);
      // console.log("paymentDetails", paymentDetails);
      // console.log("userId", user.id);
      // console.log("cart", cart);
      // console.log("orderItems Query", query, queryValues);

      return res.status(201).json({
        success: true,
        message:
          user.name +
          ` Your order has been placed successfully! Thank you for shopping with us.`,
        orderId,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static updateOrderStatus = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { orderId, status } = req.body;

      const { rows: isOrderExists } = await client.query(
        `SELECT id,status FROM orders WHERE id=$1`,
        [orderId]
      );

      if (isOrderExists.length === 0)
        return next(new ErrorHandler("Order not found", 404));

      if (isOrderExists[0]?.status === "status")
        return next(new ErrorHandler("Order already updated", 400));

      //Update the order Status

      await client.query(`UPDATE orders SET status=$1 WHERE id=$2`, [
        status,
        orderId,
      ]);
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static getOrderById = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { userId, orderId } = req.query;

      if (!userId || !orderId)
        return next(new ErrorHandler("Please provide order and user id", 400));

      const { rows } = await client.query(
        `SELECT id, userId, shippingid, price, status, TO_CHAR(orderplaced, 'YYYY-MM-DD') AS orderplaced FROM orders WHERE id=$1 AND userid=$2`,
        [orderId, userId]
      );

      if (rows.length === 0) return next(new ErrorHandler("No orders!", 404));

      const transformedRows = rows.map((row, index) => ({
        id: row.id,
        userId: row.userid,
        Date: row.orderplaced,
        status: row.status,
        Total: row.price,
        shippingDetails: row.shippingid,
      }));

      return res.status(200).json({
        success: true,
        message: transformedRows,
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static getOrdersByUserId = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { userId } = req.query;

      if (!userId) return next(new ErrorHandler("Please provide user id", 400));

      const { rows } = await client.query(
        `SELECT id, userId, shippingid, price, status, TO_CHAR(orderplaced, 'YYYY-MM-DD') AS orderplaced FROM orders WHERE userid=$1`,
        [userId]
      );

      if (rows.length === 0)
        return next(new ErrorHandler("You haven't place any order yet!", 404));

      const transformedRows = rows.map((row, index) => ({
        id: row.id,
        userId: row.userid,
        Date: row.orderplaced,
        status: row.status,
        Total: row.price,
        shippingDetails: row.shippingid,
      }));

      return res.status(200).json({
        success: true,
        message: transformedRows,
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static applyCoupon = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { couponCode } = req.body;

      const [{ rows: isCouponCodeValid }] = await Promise.all([
        client.query(`SELECT * FROM coupons WHERE code=$1`, [couponCode]),
      ]);

      //what if a coupon code is invalid
      if (isCouponCodeValid.length === 0)
        return next(new ErrorHandler("Invalid Coupon Code", 400));

      //check wether this coupon has already been availed or not, if yes dont allow him otherwise allow
      const { rows: alreadyAvailedThisCoupon } = await client.query(
        `SELECT * FROM coupons WHERE code=$1 AND is_used=$2`,
        [couponCode, 1]
      );

      if (alreadyAvailedThisCoupon.length > 0)
        return next(
          new ErrorHandler("This coupon had already been availed", 400)
        );

      //now set is_used in coupons table to indicate that this coupon now is beign availed
      await client.query(`UPDATE coupons SET is_used=$1 WHERE code=$2`, [
        1,
        couponCode,
      ]);

      const discountRate = isCouponCodeValid[0]?.discount_rate;

      res.status(200).json({
        success: true,
        message: `Congrats! You have availed this coupon with a discount rate of ${discountRate}%!`,
        discountRate,
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static giveFeedback = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { productId, name, email, userId, rating, feedback } = req.body;

      const [{ rows: userExists }, { rows: productExists }] = await Promise.all(
        [
          client.query(`SELECT * FROM users WHERE id=$1`, [userId]),
          client.query(`SELECT * FROM items WHERE id=$1`, [productId]),
        ]
      );

      if (userExists.length === 0)
        return next(new ErrorHandler("Invalid User Id", 400));
      if (productExists.length === 0)
        return next(new ErrorHandler("Invalid Product Id", 400));

      //check if user has bought this product ever or not before submitting his/her feedback?
      const { rows: beforePurchased } = await client.query(
        `SELECT * FROM users U JOIN  orders O ON U.id = O.userid JOIN orderitems OI ON O.id = OI.order_id
                             WHERE U.id = $1 AND OI.item_id=$2`,
        [userId, productId]
      );

      if (beforePurchased.length == 0)
        return next(new ErrorHandler("You haven't bought this product", 400));

      //check what if user is giving multiple times feedback of same thing, NOT ALLOWED!
      const { rows: feedbackAlreadyGiven } = await client.query(
        `SELECT * FROM feedback WHERE user_id=$1 AND item_id=$2`,
        [userId, productId]
      );

      if (feedbackAlreadyGiven.length > 0)
        return next(
          new ErrorHandler(
            "You have already given feedback for this product",
            400
          )
        );

      //now record customer's feedback for this item
      await client.query(
        `CALL add_feedback_procedure($1, $2, $3, $4, $5, $6);`,
        [userId, productId, name, email, rating, feedback]
      );

      res.status(200).json({
        success: true,
        message: "Thanks for your feedback!",
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static getFeedbacks = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { productId } = req.query;

      if (!productId)
        return next(new ErrorHandler("Please provide product id", 400));

      const { rows } = await client.query(
        `SELECT * FROM feedback WHERE item_id=$1`,
        [productId]
      );

      if (rows.length == 0)
        return next(new ErrorHandler("No feedbacks avaliable", 404));

      res.status(200).json({
        success: true,
        message: rows,
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };
}

export default UserController;
