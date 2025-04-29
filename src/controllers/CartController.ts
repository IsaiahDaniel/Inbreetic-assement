import Cart from '../models/Cart';
import mongoose from 'mongoose';
import Product from '../models/Product';
import asyncHandler from "express-async-handler";
import ErrorResponse from '../messages/ErrorResponse.js';
import baseResponseHandler from '../messages/BaseResponseHandler.js';
import { getAuthUser } from '../helpers/utils';


// @route   POST /api/v1/cart
// @desc    Add Item To cart
// @access  Private

export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (quantity <= 0) { 
    return next(new ErrorResponse(`Quantity must be greater than 0`, 400))
  };

  const user = await getAuthUser(req, next);

  const userId =  user._id;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const itemIndex = cart.items.findIndex((i: any) => i.productId.equals(productId));

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();

  baseResponseHandler({
    message: `Product Added To Cart Successfully`,
    res,
    statusCode: 201,
    success: true,
    data: cart,
  })

});

// @route   DELETE /api/v1/cart
// @desc    Remove Item To cart
// @access  Private

export const removeFromCart = asyncHandler(async (req, res, next) => {

  const { userId, productId } = req.body;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return next(new ErrorResponse(`Cart Not Found`, 404));
  };

  cart.items.pull({ productId });

  await cart.save();
  

  baseResponseHandler({
    message: `Product Removed From cart`,
    res,
    statusCode: 200,
    success: true,
    data: cart,
  })

});

// @route   POST /api/v1/cart/checkout
// @desc    Checkout Cart
// @access  Private

export const checkoutCart = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    
    const user = await getAuthUser(req, next);

    const userId = user._id;

    const cart = await Cart.findOne({ userId }).populate('items.productId').session(session);

    console.log("cart", cart);

    if (!cart || cart.items.length === 0) {
      return next(new ErrorResponse(`Cart Is Empty`, 400))
    };

    

    for (const item of cart.items) {
      
      if (!item.productId) {
       return next(new ErrorResponse(`Product Item Not Found In cart`, 404));
      }

      const product = await Product.findOne({ _id: item.productId._id }).session(session);

      // ${item.productId.name}

      if (!product || product.stock < item.quantity) {
        return next(new ErrorResponse(`Not enough stock for this item`, 404));
      }


      product.stock -= item.quantity;
      await product.save({ session });
    }

    cart.set('items', []);

    await cart.save({ session });

    await session.commitTransaction();

    baseResponseHandler({
      message: `Checkout Was successfull`,
      res,
      statusCode: 200,
      success: true,
      data: cart
    })

  } catch (err: any) {
    await session.abortTransaction();
    return next(new ErrorResponse(`${err.message ? err.message : "Something Went Wrong"}`, 500));
  } finally {
    session.endSession();
  }
});
