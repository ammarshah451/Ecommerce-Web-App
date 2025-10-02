import { query } from "express";
import { body, check, validationResult, param } from "express-validator";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);
  const errorMessages = errors
    .array()
    .map((e) => e.msg)
    .join(", ");

  if (errors.isEmpty()) return next();
  return next(new Error(errorMessages));
};

//ADD MORE ROBUST VALIDATORS!!!!!

const loginValidator = () => [
  body("email", "Please enter an email").notEmpty(),
  body("password", "Please enter a password").isLength({ min: 6 }),
];

const addCategoryValidator = () => [
  body("name", "Please enter a category name").notEmpty(),
  body("description", "Please enter a description").notEmpty(),
];
//categoryname, name, price, quantity, adminid, description
const addProductValidator = () => [
  body("categoryname", "Please enter a category name").notEmpty().isString(),
  body("name", "Please enter a product name").notEmpty().isString(),
  body("price", "Please enter a price").notEmpty().isNumeric(),
  body("quantity", "Please enter a quantity")
    .notEmpty()
    .isNumeric()
    .custom((value) => {
      if (value <= 1) {
        throw new Error("Quantity must be greater than 1");
      }
      return true;
    }),
  body("adminid", "Please enter a admin id").notEmpty().isString(),
  body("description", "Please enter a description").notEmpty().isString(),
];

const userLoginValidator = () => [
  body("email", "Please enter your email").notEmpty().isString().isEmail(),
  body("password", "Please provide password").notEmpty().isString(),
];
const userRegisterValidator = () => [
  body("name").notEmpty().isString(),
  body("email").notEmpty().isString().isEmail(),
  body("password").notEmpty(),
  body("phonenumber").notEmpty(),
];

const updateOrderStatusValidator = () => [
  body("orderId", "Please provide order id").notEmpty().isString(),

  body("status", "Please provide status")
    .notEmpty()
    .isIn(["shipping", "delivered", "cancelled"]),
];

const applyCouponValidator = () => [
  body("couponCode")
    .notEmpty()
    .isString()
    .withMessage("Please provide coupon code"),
];

const giveFeedbackValidator = () => [
  body("productId", "Please provide product id").notEmpty().isString(),
  body("userId", "Please provide user id").notEmpty().isString(),
  body("feedback", "Please provide feedback").notEmpty().isString(),
  body("name", "Please provide Your Name").notEmpty().isString(),
  body("email", "Please provide Your Email").notEmpty().isEmail(),
  body("rating", "Please provide Your Rating").notEmpty().isNumeric(),
];

const adminEditMyselfValidator = () => [
  body("adminId", "Please provide admin id").notEmpty().isString(),
  body("name", "Please provide name").notEmpty().isString(),
  body("email", "Please provide email").notEmpty().isEmail(),
  body("password", "Please provide password").notEmpty().isString(),
];

export {
  addCategoryValidator,
  loginValidator,
  validateHandler,
  addProductValidator,
  userLoginValidator,
  userRegisterValidator,
  updateOrderStatusValidator,
  applyCouponValidator,
  giveFeedbackValidator,
  adminEditMyselfValidator,
};
