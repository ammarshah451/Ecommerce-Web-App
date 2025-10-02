import pool from "../configuration/connectDB.js";
import { uploadFilesToCloudinary } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

class ProductsController {
  static getProducts = async (req, res, next) => {
    const client = await pool.connect();
    try {
      // All products A
      let query = `SELECT * FROM items I JOIN categories C ON I.categoryid = C.categ_id WHERE 1=1`;
      let queryParams = [];

      const { categories } = req.query;

      const categoryNamesArray = categories
        ? categories.split(",").map((i) => i)
        : [];

      //what if user wants all products? so for that already query A is designed to fetch all just now update query if user wants products of specific categories
      if (categoryNamesArray.length > 0) {
        queryParams = [...categoryNamesArray];
        const placeholders = categoryNamesArray.map(
          (_, index) => `$${index + 1}`
        );
        query += ` AND C.categ_name IN (${placeholders.join(",")})`;
      }

      const { rows } = await client.query(query, queryParams);

      if (rows.length <= 0)
        return next(new ErrorHandler("No products found", 404));

      //fetch products images urls too!
      const transformedRows = rows.map(
        ({ id, categ_name, name, price, img_url, quantity, description }) => ({
          id,
          categoryname: categ_name,
          name,
          price,
          imgUrl: img_url,
          stocks: quantity > 0 ? "stock" : "outofstock",
          quantity,
          description,
          url: `/product/${id}`,
          rating: "5",
        })
      );

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

  static getAProduct = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;

      if (!id) return next(new ErrorHandler("No Id provided!", 404));

      const { rows } = await client.query(
        `SELECT * FROM items I JOIN categories C ON I.categoryid = C.categ_id WHERE I.id = $1`,
        [id]
      );
      if (rows.length <= 0)
        return next(new ErrorHandler("No products found", 404));

      //fetch products images urls too!
      const transformedRows = rows.map(
        ({ id, categ_name, name, price, img_url, quantity, description }) => ({
          id,
          categoryname: categ_name,
          name,
          price,
          imgUrl: img_url,
          stocks: quantity > 0 ? "stock" : "outofstock",
          quantity,
          description,
          rating: "5",
        })
      );

      return res.status(200).json({
        success: true,
        message: transformedRows[0],
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static getPaginatedProducts = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const {
        page = 1,
        category = "",
        priceLowerBound = "0",
        priceUpperBound = "100",
      } = req.query;

      const productsPerPage = 4;
      const offset = productsPerPage * (page - 1);

      let query = `SELECT * FROM items I JOIN categories C ON I.categoryid = C.categ_id WHERE 1=1 AND I.quantity>0`;
      let queryParams = [];

      if (priceLowerBound !== "0" || priceUpperBound !== "100") {
        queryParams.push(parseInt(priceLowerBound), parseInt(priceUpperBound));
        query += ` AND I.price BETWEEN $${queryParams.length - 1} AND $${
          queryParams.length
        }`;
      }
      if (category) {
        queryParams.push(category);
        query += ` AND C.categ_name = $${queryParams.length}`;
      }

      //get total count of rows for totalPages
      const { rows: totalRows } = await client.query(query, queryParams);

      //now get paginated Rows from DB
      queryParams.push(productsPerPage, offset);
      query += ` LIMIT $${queryParams.length - 1} OFFSET $${
        queryParams.length
      }`;

      const { rows } = await client.query(query, queryParams);

      if (rows.length <= 0)
        return next(new ErrorHandler("No products found", 404));

      const count = totalRows.length;
      const totalPages = Math.ceil(count / productsPerPage);

      //fetch products images urls too!

      const transformedRows = rows.map(
        ({ id, categ_name, name, price, img_url, quantity, description }) => ({
          id,
          categoryname: categ_name,
          name,
          price,
          url: `/product/${id}`,
          stocks: quantity > 0 ? "stock" : "outofstock",
          quantity,
          imgUrl: img_url,
          description,
          rating: "5", //fetch this rating!! dont do this
        })
      );
      return res.status(200).json({
        success: true,
        message: transformedRows,
        totalPages,
        totalProducts: count,
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static searchProducts = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const {
        id = "",
        name = "",
        avaliable = "",
        category = "",
        priceLowerBound = -1,
        priceUpperBound = -1,
      } = req.body;
      let query = `SELECT * FROM items I JOIN categories C ON I.categoryid = C.categ_id WHERE 1=1`;
      const queryParams = [];

      let categ_id_row;
      let categ_id;
      if (category) {
        categ_id_row = await client.query(
          `SELECT categ_id from categories WHERE categ_name=$1`,
          [category]
        );
        categ_id = categ_id_row?.rows[0]?.categ_id || undefined;
      }

      if (categ_id_row?.rows?.length === 0)
        return next(new ErrorHandler("Category doesn't exist", 404));
      // Dynamically add conditions based on the presence of each filter
      //fetch products images urls too!

      //Build dynamic query
      if (id) {
        queryParams.push(id);
        query += ` AND I.id=$${queryParams.length}`;
      } else {
        if (name) {
          queryParams.push(`%${name}%`);
          query += ` AND I.name ILIKE $${queryParams.length}`;
        }
        if (category) {
          queryParams.push(categ_id);
          query += ` AND I.categoryid = $${queryParams.length}`;
        }
        if (avaliable) {
          queryParams.push(0);
          if (avaliable === "stock") {
            query += ` AND I.quantity > $${queryParams.length}`;
          } else if (avaliable === "outofstock") {
            query += ` AND I.quantity = $${queryParams.length}`;
          }
        }
        if (priceLowerBound !== -1 && priceUpperBound !== -1) {
          queryParams.push(priceLowerBound, priceUpperBound);
          query += ` AND I.price BETWEEN $${queryParams.length - 1} AND $${
            queryParams.length
          }`;
        } else if (priceLowerBound !== -1) {
          queryParams.push(priceLowerBound);
          query += ` AND I.price >= $${queryParams.length}`;
        } else if (priceUpperBound !== -1) {
          queryParams.push(priceUpperBound);
          query += ` AND I.price <= $${queryParams.length}`;
        }
      }

      const { rows } = await client.query(query, queryParams);
      if (rows.length <= 0)
        return next(new ErrorHandler("No products found", 404));

      const transformedRows = rows.map(
        ({ id, categ_name, name, price, img_url, quantity, description }) => ({
          id,
          categoryname: categ_name,
          name,
          price,
          url: `/product/${id}`,
          stocks: quantity > 0 ? "stock" : "outofstock",
          quantity,
          imgUrl: img_url,
          description,
        })
      );

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

  static addProduct = async (req, res, next) => {
    try {
      const client = await pool.connect();
      const { categoryname, name, price, quantity, adminid, description } =
        req.body;

      const file = req.file || [];

      if (!file)
        return next(new ErrorHandler("Please upload product Image", 402));

      const [{ rows: categoryRows }, { rows: adminRows }] = await Promise.all([
        client.query(`SELECT * FROM categories WHERE categ_name = $1`, [
          categoryname,
        ]),
        client.query(`SELECT * FROM admins WHERE id = $1`, [adminid]),
      ]);

      //Check if category exists or not
      if (categoryRows.length === 0)
        return next(new ErrorHandler("Category not found", 404));

      //Check if admin Exists
      if (adminRows.length === 0)
        return next(new ErrorHandler("Admin not found", 404));

      const prodId = "P" + Math.floor(Math.random() * 999);

      const categoryid = categoryRows[0].categ_id;

      const result = await uploadFilesToCloudinary([file]);
      const { public_id, img_url } = result[0];

      await client.query(
        `CALL add_product_procedure($1,$2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          prodId,
          adminid,
          categoryid,
          name,
          price,
          quantity,
          public_id,
          img_url,
          description,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Product added successfully",
      });
    } catch (error) {
      console.log(error);
      if (error.code === "23505") {
        next(new ErrorHandler("Product already exists", 404));
      }
      next(error);
    }
  };

  static updateProduct = async (req, res, next) => {
    const client = await pool.connect();

    try {
      const { productId, categoryName, name, price, quantity, description } =
        req.body;

      if (!productId) return next(new ErrorHandler("productId missing", 404));

      const [{ rows: productRows }, { rows: categoryRows }] = await Promise.all(
        [
          client.query(`SELECT * FROM items WHERE id = $1`, [productId]),
          client.query(`SELECT * FROM categories WHERE categ_name = $1`, [
            categoryName,
          ]),
        ]
      );

      if (productRows.length === 0)
        return next(new ErrorHandler("Product not found", 404));

      if (categoryRows.length === 0)
        return next(new ErrorHandler("Category not found", 404));

      await client.query(
        `CALL update_product_procedure($1, $2, $3, $4, $5, $6)`,
        [
          name,
          categoryRows[0]?.categ_id,
          price,
          quantity,
          description,
          productId,
        ]
      );

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static deleteProduct = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { productId } = req.params;

      if (!productId) return next(new ErrorHandler("productId missing", 404));

      const { rows: productRows } = await client.query(
        `SELECT * FROM items WHERE id = $1`,
        [productId]
      );
      if (productRows.length === 0)
        return next(new ErrorHandler("Product not found", 404));

      //delete files from cloudinary
      // const result = deleteAllFilesFromCloudinary(productRows[0].url //or maybe something else//);

      await client.query(`DELETE FROM items WHERE id = $1`, [productId]);

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static getCategories = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { rows: categoryRows } = await client.query(
        `SELECT * FROM categories`
      );

      if (categoryRows.length === 0)
        return next(new ErrorHandler("Category not found", 404));

      let transformedCategoryRows = [];
      if (req.query.populate === "true") {
        transformedCategoryRows = categoryRows.map((category, index) => ({
          id: index,
          ID: category.categ_id,
          name: category.categ_name,
          description: category.categ_description,
        }));
      } else {
        categoryRows.map((category, index) =>
          transformedCategoryRows.push(category.categ_name)
        );
      }
      return res.status(200).json({
        success: true,
        message: transformedCategoryRows,
      });
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      client.release();
    }
  };

  static searchCategories = async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { value } = req.body;
      const { rows } = await client.query(
        `SELECT * FROM categories WHERE categ_name ILIKE $1`,
        [`%${value}%`]
      );

      if (rows.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "No result found" });

      const transformedRows = rows.map((row, index) => {
        return {
          id: index,
          ID: row.categ_id,
          name: row.categ_name,
          description: row.categ_description,
        };
      });
      return res.status(200).json({ success: true, message: transformedRows });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "An error occurred" });
    }
  };

  static getProductsRating = async (req, res, next) => {};

  static getBestSoldProducts = async (req, res, next) => {
    const client = await pool.connect();
    try {
      let best_sold_products_limit = 1;
      //filtering out those items along with their sold_units that are placed in only those orders
      //whom status is delivered

      const query = `SELECT 
                        I.*, 
                        O.total_sold_units
                      FROM 
                        items I JOIN (
                                      SELECT 
		                                    item_id, 
		                                    SUM(OI.quantity) as total_sold_units
                                      FROM 
		                                    orderitems OI JOIN orders ORD ON OI.order_id = ORD.id
	                                    WHERE
		                                    ORD.status = 'delivered'
                                      GROUP BY item_id
                                      HAVING SUM(OI.quantity) > ${best_sold_products_limit})O
                                    ON 
                                      I.id = O.item_id
                                      LIMIT 10;`;

      const { rows } = await client.query(query);

      if (rows.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "Best sold products not found" });

      const transformedRows = rows.map(
        ({ id, categ_name, name, price, img_url, quantity, description }) => ({
          id,
          categoryname: categ_name,
          name,
          price,
          url: `/product/${id}`,
          stocks: quantity > 0 ? "stock" : "outofstock",
          quantity,
          imgUrl: img_url,
          description,
          rating: "5", //dont do this, fetch it idiot!
        })
      );

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

  static getBestReviewedProducts = async (req, res, next) => {
    const client = await pool.connect();
    try {
      //considering best reviewed only those having avg(rating) of at least 3 stars
      const { rows } = await client.query(
        `
        SELECT 
          I.*,
          C.categ_name
        FROM(
            SELECT item_id FROM feedback
            GROUP BY item_id
            HAVING AVG(rating)>3
            ORDER BY AVG(rating) DESC
          ) AS best_reviewed_items_ids
          JOIN items I on I.id = best_reviewed_items_ids.item_id 
          JOIN categories C ON I.categoryid = C.categ_id;
          `
      );

      if (rows.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "Best reviewd products not found" });

      const transformedRows = rows.map(
        ({ id, categ_name, name, price, img_url, quantity, description }) => ({
          id,
          categoryname: categ_name,
          name,
          price,
          url: `/product/${id}`,
          stocks: quantity > 0 ? "stock" : "outofstock",
          quantity,
          imgUrl: img_url,
          description,
          rating: "5", //dont do this, fetch it idiot!
        })
      );
      res.status(200).json({
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
}
export default ProductsController;
