import express from "express";
const router = express.Router();

import ProductsController from "../controllers/products.js";

import { isLoggedInAdmin } from "../middlewares/isAuth.js";
import { addProductValidator, validateHandler } from "../lib/validators.js";
import { uploadSingleAvatar } from "../middlewares/multer.js";

//Public Routes
//all can view products
router.get("/getProducts", ProductsController.getProducts);

router.get("/getAProduct/:id", ProductsController.getAProduct);
router.get("/getProductsRating", ProductsController.getProductsRating);
router.get("/getPaginatedProducts", ProductsController.getPaginatedProducts);
router.post("/searchProducts", ProductsController.searchProducts);

router.post("/searchCategories", ProductsController.searchCategories);
router.get("/getCategories", ProductsController.getCategories);

router.get("/getBestSoldProducts", ProductsController.getBestSoldProducts);
router.get(
  "/getBestReviewedProducts",
  ProductsController.getBestReviewedProducts
);
//protected Routes only admins can Add/Delete/Update products
router.use(isLoggedInAdmin);
router.post(
  "/addProduct",
  uploadSingleAvatar,
  addProductValidator(),
  validateHandler,
  ProductsController.addProduct
);

router.post("/updateProduct", ProductsController.updateProduct);

router.delete("/deleteProduct/:productId", ProductsController.deleteProduct);
export default router;
