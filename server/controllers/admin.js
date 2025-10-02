import pool from "../configuration/connectDB.js";
import { get3DigitRandomId } from "../lib/helper.js";
import bcrypt from "bcrypt";

import { sendToken } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import _ from "lodash";

export default class AdminController {
  static login = async (req, res, next) => {
    const { email, password } = req.body;
    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        `SELECT * FROM admins WHERE email = $1`,
        [email]
      );
      if (rows.length <= 0)
        return next(new ErrorHandler("Admin not found", 404));

      const isPasswordSame = bcrypt.compare(password, rows[0].password);
      if (!isPasswordSame)
        return next(new ErrorHandler("Wrong Password Or Email", 401));

      const user = _.omit(rows[0], "password");
      sendToken(res, user, 200, "Welcome Back Admin", "Admin");
    } catch (error) {
      return res.status(500).json({ status: false, message: "Server Error" });
    } finally {
      client.release();
    }
  };

  static register = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { name, email, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const adminId = "AD" + get3DigitRandomId();

      await client.query(
        "INSERT INTO admins(id, name, email, password) VALUES($1, $2, $3, $4)",
        [adminId, name, email, hashedPassword]
      );

      res.status(202).json({
        success: true,
        message: "Admin Registered Successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
    }
  };

  static logout = async (req, res, next) => {
    const client = await pool.connect();
    try {
      console.log("INASDASH");
      res.clearCookie("loggedAdmin");
      res.status(200).json({
        success: true,
        message: "Admin Logged Out Successfully",
      });
    } catch (error) {
      next(error);
    } finally {
      client.release();
    }
  };

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

  static editMyself = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { adminId, name, email, password } = req.body;
      console.log(adminId, name, email, password);

      //check if the Admin is valid or not
      const { rows: isValidAdmin } = await client.query(
        "SELECT * FROM admins WHERE id=$1",
        [adminId]
      );
      if (isValidAdmin.length === 0)
        return next(new ErrorHandler("Admin Not Found", 404));

      //check email  should be unique
      const { rows: unqiueEmailPhoneNumber } = await client.query(
        `SELECT * FROM admins WHERE email = $1 AND id != $2;`,
        [email, adminId]
      );

      if (unqiueEmailPhoneNumber.length !== 0)
        return next(new ErrorHandler(`Email Already exists!`, 404));

      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(password, salt);

      //now update the admin deails
      const { rows } = await client.query(
        `UPDATE admins SET email=$1, password=$2, name=$3 WHERE id=$4 RETURNING *`,
        [email, newHashedPassword, name, adminId]
      );

      const admin_user = _.omit(rows[0], "password");

      return res.status(200).json({
        success: true,
        message: "Admin Updated Successfully",
        admin_user,
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static addCategory = async (req, res, next) => {
    const client = await pool.connect();

    try {
      const { name, description, adminId } = req.body;
      const { rows } = await client.query(
        `SELECT * FROM categories WHERE categ_name = $1`,
        [name]
      );
      if (rows.length > 0) {
        return next(new ErrorHandler("Category already exists", 400));
      }

      const id = get3DigitRandomId();

      await client.query(`CALL add_category_procedure($1, $2, $3, $4)`, [
        id,
        name,
        description,
        adminId,
      ]);

      return res.status(201).json({
        success: true,
        message: "Category added successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static getAllUsers = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        `SELECT id, name, email, phonenumber FROM users`
      );

      if (rows.length === 0)
        return next(new ErrorHandler("No users found!", 404));

      const transformedRows = rows.map((row, index) => ({
        ...row,
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

  static searchUsers = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { id = "", name = "" } = req.body;

      let queryParams = [];
      let query = `SELECT id, name, email, phonenumber FROM users WHERE 1=1`;
      if (id !== "") {
        query += ` AND id=$1`;
        queryParams.push(id);
      }
      if (name !== "") {
        queryParams.push(`%${name}%`);
        query += ` AND name LIKE $${queryParams.length} `;
      }

      const { rows } = await client.query(query, queryParams);

      if (rows.length === 0)
        return next(new ErrorHandler("No users found!", 404));

      const transformedRows = rows.map((row, index) => ({
        ...row,
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

  static getOrders = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const query = `SELECT id, userId, shippingid, price, status, TO_CHAR(orderplaced, 'YYYY-MM-DD') AS orderplaced FROM orders`;
      const { rows } = await client.query(query);

      if (rows.length === 0)
        return next(new ErrorHandler("No orders placed yet!", 404));

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

  static searchOrders = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { orderId, customerId, status, fromDate, toDate } = req.body;

      let queryParams = [];
      let query = `SELECT id, userId, shippingid, price, status, TO_CHAR(orderplaced, 'YYYY-MM-DD') AS orderplaced FROM orders WHERE 1=1`;

      //Building Dynamic Query
      if (orderId) {
        //If orderID is beign provided just query it no need to search for anything else because orderId is a PK unique attr, if it is given only one row should be returned
        query += ` AND id=$1`;
        queryParams.push(orderId);
      } else {
        if (customerId) {
          queryParams.push(customerId);
          query += ` AND userid=$${queryParams.length}`;
        }
        if (status) {
          queryParams.push(status);
          query += ` AND status=$${queryParams.length}`;
        }
        if (fromDate && toDate) {
          queryParams.push(fromDate);
          queryParams.push(toDate);
          query += ` AND orderplaced BETWEEN $${queryParams.length - 1} AND $${
            queryParams.length
          }`;
        } else if (fromDate) {
          queryParams.push(fromDate);
          query += ` AND orderplaced>=$${queryParams.length}`;
        } else if (toDate) {
          queryParams.push(toDate);
          query += ` AND orderplaced<=$${queryParams.length}`;
        }
      }
      const { rows } = await client.query(query, queryParams);

      console.log(query, queryParams);

      if (rows.length === 0)
        return next(new ErrorHandler("No orders found!", 404));

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

  static getOrderDetails = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { orderId, userId } = req.query;

      if (!orderId || !userId)
        return next(
          new ErrorHandler("Please provide both orderId and userId", 400)
        );

      const { rows: orderDetailRows } = await client.query(
        `SELECT * FROM orders WHERE id=$1`,
        [orderId]
      );

      const [
        { rows: shippingDetailRows },
        { rows: paymentDetailRows },
        { rows: itemsDetailRows },
        { rows: userDetailRows },
      ] = await Promise.all([
        client.query(`SELECT * FROM shippingdetails WHERE id=$1`, [
          orderDetailRows[0]?.shippingid,
        ]),
        client.query(`SELECT * FROM payment WHERE order_id=$1`, [orderId]),
        client.query(`SELECT * FROM orderitems WHERE order_id=$1`, [orderId]),
        client.query(
          `SELECT id,name,email,phonenumber FROM users WHERE id=$1`,
          [userId]
        ),
      ]);

      //fetch that order from db (orderDetails)
      // const { rows: orderDetailRows } = await client.query(
      //   `SELECT * FROM orders WHERE id=$1`,
      //   [orderId]
      // );

      // const shippingId = orderDetailRows[0]?.shippingid;

      //fetch shipping details of that order from db (shippingDetails)
      // const { rows: shippingDetailRows } = await client.query(
      //   `SELECT * FROM shippingdetails WHERE shipping_id=$1`,
      //   [shippingId]
      // );

      //fetch payment details of that order from db (paymentDetails)
      // const { rows: paymentDetailRows } = await client.query(
      //   `SELECT * FROM payment WHERE order_id=$1`,
      //   [orderId]
      // );

      //fetch All items inclued that in that order from db (itemsDetails)
      // const { rows: itemsDetailRows } = await client.query(
      //   `SELECT * FROM orderitems WHERE order_id=$1`,
      //   [orderId]
      // );

      //fetch that user from db (userDetails)
      // const { rows: userDetailRows } = await client.query(
      //   `SELECT * FROM users WHERE id=$1`,
      //   [userId]
      // );

      if (
        userDetailRows.length === 0 ||
        orderDetailRows.length === 0 ||
        shippingDetailRows.length === 0 ||
        paymentDetailRows.length === 0 ||
        itemsDetailRows.length === 0
      )
        return next(new ErrorHandler("No order found!", 404));

      return res.status(200).json({
        success: true,
        message: {
          orderDetails: orderDetailRows,
          shippingDetails: shippingDetailRows,
          paymentDetails: paymentDetailRows,
          itemsDetails: itemsDetailRows,
          userDetails: userDetailRows,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static getDashboardStats = async (req, res, next) => {
    const client = await pool.connect();
    try {
      let totalRevenue = 0;
      //Recent Order Query (How many orders in the Last 4 days, are being fetched just)
      let query = `SELECT 
                    TO_CHAR(orderplaced, 'YYYY-MM-DD') AS orderplaced, 
                    COUNT(*) as total_orders_placed, 
                    SUM(price) as total_revenue  
                  FROM 
                    orders
                  WHERE
                    status IN ('delivered','shipping')
                  GROUP BY  
                    orderplaced
                  ORDER BY orderplaced DESC;`;

      const { rows } = await client.query(query);
      if (rows.length === 0)
        return next(new ErrorHandler("No orders has been placed yet!", 404));

      let recent7DaysRevenue = [];

      const transformedRecentOrderRows = rows.map(
        ({ orderplaced, total_orders_placed, total_revenue }, index) => {
          totalRevenue += total_revenue;
          recent7DaysRevenue.push(total_revenue);
          return {
            Date: orderplaced,
            TotalOrders: total_orders_placed,
            Revenue: total_revenue,
          };
        }
      );

      return res.status(200).json({
        success: true,
        message: {
          transformedRecentOrderRows,
          totalRevenue,
          recent7DaysRevenue,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static addCoupon = async (req, res, next) => {};
  static updateCoupon = async (req, res, next) => {};

  static deleteCoupon = async (req, res, next) => {};
}
