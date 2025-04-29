import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";
import baseResponseHandler from "../messages/BaseResponseHandler.js";
import redisClient from "../providers/RedisProvider.js";
import { getPaginateOptions, transformPaginateResponse } from "../helpers/paginate.js";


// @route   GET /api/v1/products
// @desc    getting all products
// @access  Private

export const getAllProducts = asyncHandler(async (req, res, next) => {
  
  const cachedProducts = await redisClient.get("products");

  console.log("cachedProducts", cachedProducts);

  const { page, limit = 10 } = req.query;

  const options = getPaginateOptions(page, limit);

  if (cachedProducts) {
    console.log("getting data from cache 1");
  
    const parsedProducts = JSON.parse(cachedProducts);

    console.log("getting data from cache 2");

    console.log("parsedProducts", parsedProducts);
  
    baseResponseHandler({
      message: `Products Retrieved Successfully`,
      res,
      statusCode: 200,
      success: true,
      data: parsedProducts,
    });
  
    return;
  }

  const products = await Product.paginate({}, options);

  const productsData = transformPaginateResponse(products);

  await redisClient.set("products", JSON.stringify(productsData), { EX: 60 });

  baseResponseHandler({
    message: `Products Retrived Successfully`,
    res,
    statusCode: 200,
    success: true,
    data: productsData,
  })

});
