import express from "express";
import UserController from "../controllers/user.js";
import {
  applyCouponValidator,
  giveFeedbackValidator,
  updateOrderStatusValidator,
  userLoginValidator,
  userRegisterValidator,
  validateHandler,
} from "../lib/validators.js";
import { isLoggedInUser } from "../middlewares/isAuth.js";
const router = express.Router();

//Public Routes
router.post(
  "/login",
  userLoginValidator(),
  validateHandler,
  UserController.login
);
router.post(
  "/register",
  userRegisterValidator(),
  validateHandler,
  UserController.register
);

router.use(isLoggedInUser);
//protected Routes only user can access it!
router.get("/myself", UserController.getMyself);
router.get("/logout", UserController.logout);
router.post("/editMyself", UserController.editMyself);

router.post("/placeOrder", UserController.placeOrder);

// This API will be called when user recieved parcel just for simplicity Ive done that after 5 minutes of
//order placement it gets called thus, depicting that user recieved the order :))
router.post(
  "/updateOrderStatus",
  updateOrderStatusValidator(),
  validateHandler,
  UserController.updateOrderStatus
);
router.get("/getOrderById", UserController.getOrderById);

router.get("/getOrdersByUserId", UserController.getOrdersByUserId);

router.post(
  "/applyCoupon",
  applyCouponValidator(),
  validateHandler,
  UserController.applyCoupon
);

router.post(
  "/giveFeedback",
  giveFeedbackValidator(),
  validateHandler,
  UserController.giveFeedback
);

router.get("/getFeedbacks", UserController.getFeedbacks);
export default router;
