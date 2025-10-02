import dotenv from "dotenv";
dotenv.config();

import pool from "../configuration/connectDB.js";

export const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export const get3DigitRandomId = () => Math.floor(Math.random() * 1000);

const generateHTML = (cart, shippingDetails, orderDetails, paymentDetails) => {
  let totalAmount = 0;

  // Cart HTML
  const cartRows = cart
    .map(({ details, price, quantity }) => {
      const itemTotal = quantity * price;
      totalAmount += itemTotal;
      return `
                <tr>
                    <td>${details.split(",")[0]}</td>
                    <td>${details.split(",")[1]}</td>
                    <td>${quantity}</td>
                    <td>$${price.toFixed(2)}</td>
                    <td>$${itemTotal.toFixed(2)}</td>
                </tr>`;
    })
    .join("");

  const cartHTML = `
        <h2>Your Cart Summary</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr>
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price (Each)</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${cartRows}
            </tbody>
        </table>
        <h3>Total Amount: $${totalAmount}</h3>
    `;

  // Shipping Details HTML
  const shippingDetailsHTML = `
        <h2>User Details</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 50%; text-align: left;">
            <tr>
                <th>Name</th>
                <td>${shippingDetails.name}</td>
            </tr>
            <tr>
                <th>Address</th>
                <td>${shippingDetails.address}</td>
            </tr>
            <tr>
                <th>City</th>
                <td>${shippingDetails.city}</td>
            </tr>
            <tr>
                <th>Postal Code</th>
                <td>${shippingDetails.postalCode}</td>
            </tr>
            <tr>
                <th>Contact Number</th>
                <td>${shippingDetails.contactNumber}</td>
            </tr>
        </table>
    
        `;

  // Order Details HTML
  const orderDetailsHTML = `
        <h2>Order Details</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 50%; text-align: left;">
            <tr>
                <th>Price</th>
                <td>$${orderDetails.price}</td>
            </tr>
            <tr>
                <th>Status</th>
                <td>${orderDetails.status}</td>
            </tr>
            <tr>
                <th>Order Placed</th>
                <td>${orderDetails.orderplaced}</td>
            </tr>
        </table>
    
        `;

  // Payment Details HTML
  const paymentDetailsHTML = `

        <h2>Payment Details</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 50%; text-align: left;">
            <tr>
                <th>Payment Amount</th>
                <td>$${paymentDetails.paymentAmount}</td>
            </tr>
            <tr>
                <th>Payment Method</th>
                <td>${paymentDetails.paymentMethod}</td>
            </tr>
            <tr>
                <th>Payment Status</th>
                <td>${paymentDetails.paymentStatus}</td>
            </tr>
        </table>
    `;

  return `${cartHTML} ${shippingDetailsHTML} ${orderDetailsHTML} ${paymentDetailsHTML}`;
};

export const convertToMailObject = (
  cart,
  shippingDetails,
  orderDetails,
  user,
  paymentDetails
) => {
  let from = process.env.EMAIL_USER;
  let to = user?.email;
  let subject = "RECEIPT";
  const emailHTML = generateHTML(
    cart,
    shippingDetails,
    orderDetails,
    paymentDetails
  );

  let html = emailHTML;

  let text = "RECEIPT";

  return { from, to, subject, text, html };
};
let cat = 100;
let item = 200;

// async function generateCategories() {
//   let categories = [];
//   categories.push(
//     {
//       categ_id: 1,
//       categ_name: "electronics",
//       categ_description: "A door of use for you!",
//       adminid: "1",
//     },
//     {
//       categ_id: 2,
//       categ_name: "clothings",
//       categ_description: "Quality clothes",
//       adminid: "1",
//     },
//     {
//       categ_id: 3,
//       categ_name: "fregnances",
//       categ_description: "Smell good!",
//       adminid: "1",
//     }
//   );

//   return categories;
// }

// async function generateItems() {
//   let items = [];
//   for (let i = 0; i < 80; i++) {
//     const category = Math.floor(Math.random() * 3);
//     const itemId = "P" + item++;
//     items.push({
//       id: itemId,
//       name: faker.commerce.productName(),
//       description: faker.lorem.paragraph(),
//       price: faker.commerce.price(),
//       quantity: 10,
//       categoryid: category,
//     });
//   }
//   return items;
// }

// async function insertCategories(categories) {
//   const categoryQueries = categories.map(async (category) => {
//     await pool.query(
//       "INSERT INTO categories(categ_id, categ_name, categ_description, adminid) VALUES($1, $2, $3, $4)",
//       [
//         category.categ_id,
//         category.categ_name,
//         category.categ_description,
//         category.adminid,
//       ]
//     );
//   });
//   await Promise.all(categoryQueries);
// }

// async function insertItems(items) {
//   const itemQueries = items.map(async (item) => {
//     await pool.query(
//       "INSERT INTO items(id, adminid, categoryid, name, price, quantity, public_id, img_url, description) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",
//       [
//         item.id,
//         "1",
//         item.categoryid,
//         item.name,
//         item.price,
//         item.quantity,
//         "qmfrtct99jrtbyjarers",
//         "https://res.cloudinary.com/dsjrhkmjw/image/upload/v1731947598/qmfrtct99jrtbyjarers.png",
//         item.description,
//       ]
//     );
//   });
//   await Promise.all(itemQueries);
// }

// export const generateItemsAndCategoriesFakeData = async () => {
//   // Step 1: Generate categories
//   // const categories = await generateCategories();
//   //   await insertCategories(categories);

//   // Step 2: Generate items
//   const items = await generateItems();
//   await insertItems(items);

//   console.log("100 categories and 100 items have been inserted!");
// };
// generateItemsAndCategoriesFakeData().catch((err) =>
//   console.error("Error:", err)
// );
