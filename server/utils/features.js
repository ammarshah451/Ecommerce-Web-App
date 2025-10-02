import jwt from "jsonwebtoken";
import pool from "../configuration/connectDB.js";
import { v2 as cloudinary } from "cloudinary";
import { getBase64 } from "../lib/helper.js";

export const sendToken = async (res, user, statusCode, message, type) => {
  try {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    let obj = {
      message: message,
      user: user,
    };

    // if (type === "User") {
    //   obj.message = message;
    //   obj.user = user;
    // }
    // obj.message = message;

    res
      .status(statusCode)
      .cookie(`logged${type}`, token, {
        httpOnly: true,
      })
      .json({
        success: true,
        response: obj,
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Token sending error",
    });
  }
};

export const deleteAllFilesFromCloudinary = (allPublicIds = []) => {
  console.log("All files has been deleted!");
};

export const uploadFilesToCloudinary = async (files = []) => {
  const uploadAllFilesPromises = files.map(async (file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadAllFilesPromises);
    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      img_url: result.secure_url,
    }));

    return formattedResults;
  } catch (error) {
    console.log(error);
  }
};

export const checkAvaliabilityOfStocks = async (
  allItemIds = [],
  allItemQuantities = []
) => {
  const client = await pool.connect();
  try {
    // Fetch current selected stocks for all items in the cart
    const result = await client.query(
      `
      SELECT id, quantity
      FROM items
      WHERE id = ANY($1)
      FOR UPDATE;
    `,
      [allItemIds]
    );

    // Map the result to store each item[id] = item.quantity

    const currentStock = result?.rows?.reduce((acc, row) => {
      acc[row.id] = row.quantity;
      return acc;
    }, {});

    // Check if any item has insufficient stock
    const outOfStockItems = [];
    for (let i = 0; i < allItemIds.length; i++) {
      const itemId = allItemIds[i];
      const requestedQuantity = allItemQuantities[i];

      // If requested quantity exceeds available stock, mark item as out of stock
      if (requestedQuantity > currentStock[itemId]) {
        outOfStockItems.push({
          itemId,
          available: currentStock[itemId],
          requested: requestedQuantity,
        });
      }
    }

    return outOfStockItems;
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    client.release();
  }
};
