import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import _ from "lodash";
import pool from "../configuration/connectDB.js";

const isLoggedInUser = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { loggedUser } = req.cookies;
    if (!loggedUser) return next(new ErrorHandler("Please login first", 401));

    const { id } = jwt.verify(loggedUser, process.env.JWT_SECRET_KEY);
    const { rows: userRows } = await client.query(
      "SELECT * FROM users WHERE id=$1",
      [id]
    );
    if (userRows.length === 0)
      return next(new ErrorHandler("Please login first", 404));

    const userObj = _.omit(userRows[0], "password");
    req.user = userObj;

    next();
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    client.release();
  }
};

const isLoggedInAdmin = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { loggedAdmin } = req.cookies;

    if (!loggedAdmin) return next(new ErrorHandler("Token not found", 401));

    const { id } = jwt.verify(loggedAdmin, process.env.JWT_SECRET_KEY);

    const { rows: adminRows } = await client.query(
      "SELECT * FROM admins WHERE id=$1",
      [id]
    );
    if (adminRows.length === 0)
      return next(new ErrorHandler("Unauthorized Access", 404));

    const adminObj = _.omit(adminRows[0], "password");
    req.user = adminObj;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    client.release();
  }
};

export { isLoggedInUser, isLoggedInAdmin };
