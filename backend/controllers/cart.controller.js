import Product from "../models/product.model.js";

export const addToCart = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const user = req.user;
    let existingItem = req.user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
};

export const removeAllFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateCartProductQuantity = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id == productId);
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCartProducts = (req, res, next) => {
  try {
    const products = Product.find({ _id: { $in: req.user.cartItems } });
  } catch (error) {
    return res.status(404).json({ message: "Cart is empty" });
  }
};

export const checkoutCart = (req, res, next) => { };
