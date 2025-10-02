import express from "express";
const router = express.Router();

import AdminController from "../controllers/admin.js";
import { isLoggedInAdmin } from "../middlewares/isAuth.js";
import {
  addCategoryValidator,
  adminEditMyselfValidator,
  loginValidator,
  validateHandler,
} from "../lib/validators.js";

//Public Routes
router.post("/login", loginValidator(), validateHandler, AdminController.login);

//Protected Routes

router.use(isLoggedInAdmin);

router.get("/myself", AdminController.getMyself);
router.get("/logout", AdminController.logout);

router.post(
  "/editMyself",
  adminEditMyselfValidator(),
  validateHandler,
  AdminController.editMyself
);

router.post(
  "/addCategory",
  addCategoryValidator(),
  validateHandler,
  AdminController.addCategory
);
router.get("/getUsers", AdminController.getAllUsers);
router.post("/searchUsers", AdminController.searchUsers);

router.get("/getOrders", AdminController.getOrders);

router.post("/searchOrders", AdminController.searchOrders);

router.get("/getDashboardStats", AdminController.getDashboardStats);
router.get("/getOrderDetails", AdminController.getOrderDetails);

router.post("/addCoupon", AdminController.addCoupon);
router.post("/updateCoupon", AdminController.updateCoupon);
router.post("/deleteCoupon", AdminController.deleteCoupon);

export default router;
