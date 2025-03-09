import { Request, Response } from "express";
import AppDataSource from "../utils/db";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { logError } from "../Logger/logger";
import { AuthRequest } from "../interfaces/interface";

// Add item to cart
export const addToCart = async (req: AuthRequest, res: Response):Promise<any> => {
  try {
    const { productId, quantity } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const productRepo = AppDataSource.getRepository(Product);
    const cartRepo = AppDataSource.getRepository(CartItem);

    const user = await userRepo.findOne({ where: { id: req.user.id  } });
    const product = await productRepo.findOne({ where: { id: productId } });

    if (!user || !product) {
      return res.status(404).json({ message: "User or product not found" });
    }

    // Check if product already exists in cart
    let cartItem = await cartRepo.findOne({ where: { user, product } });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = cartRepo.create({ user, product, quantity });
    }

    await cartRepo.save(cartItem);
    return res.status(201).json({ message: "Item added to cart", cartItem });
  } catch (error:any) {
    logError(error);    
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get user's cart items
export const getCart = async (req: AuthRequest, res: Response):Promise<any> => {
  try {
    const cartRepo = AppDataSource.getRepository(CartItem);
    const cartItems = await cartRepo.find({
      where: { user: { id: Number(req.user.id) } },
      relations: ["product"], // Include product details
    });

    return res.status(200).json({ cartItems });
  } catch (error:any) {
    logError(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartRepo = AppDataSource.getRepository(CartItem);
    const cartItem = await cartRepo.findOne({ where: { id: Number(id) } });

    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    cartItem.quantity = quantity;
    await cartRepo.save(cartItem);

    return res.status(200).json({ message: "Cart item updated", cartItem });
  } catch (error:any) {
    logError(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Remove item from cart
export const removeCartItem = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;

    const cartRepo = AppDataSource.getRepository(CartItem);
    const cartItem = await cartRepo.findOne({ where: { id: Number(id) } });

    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    await cartRepo.remove(cartItem);
    return res.status(200).json({ message: "Cart item removed" });
  } catch (error:any) {
    logError(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
