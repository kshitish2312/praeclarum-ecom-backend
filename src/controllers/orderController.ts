import { Request, Response } from "express";
import AppDataSource from "../utils/db";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { AuthRequest } from "../interfaces/interface";
import { OrderStatus } from "../entities/Order";

export const createOrder = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { orderItems } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const productRepo = AppDataSource.getRepository(Product);
    const orderRepo = AppDataSource.getRepository(Order);
    const orderItemRepo = AppDataSource.getRepository(OrderItem);

    const user = await userRepo.findOne({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    let totalAmount = 0;
    const itemsToSave: OrderItem[] = [];

    for (const item of orderItems) {
      const product = await productRepo.findOne({ where: { id: item.productId } });
      if (!product) return res.status(404).json({ message: `Product with ID ${item.productId} not found` });

      totalAmount += product.price * item.quantity;
      const orderItem = orderItemRepo.create({ product, quantity: item.quantity, price: product.price });
      itemsToSave.push(orderItem);
    }

    const order = orderRepo.create({ user, orderItems: itemsToSave });
    await orderRepo.save(order);

    return res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

    const orderRepo = AppDataSource.getRepository(Order);
    const orders = await orderRepo.find({ relations: ["user", "orderItems", "orderItems.product"] });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const orders = await orderRepo.find({
      where: { user: { id: req.user.id } },
      relations: ["orderItems", "orderItems.product"],
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const orderRepo = AppDataSource.getRepository(Order);

    const order = await orderRepo.findOne({
      where: { id: Number(id) },
      relations: ["user", "orderItems", "orderItems.product"],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const orderRepo = AppDataSource.getRepository(Order);

    const order = await orderRepo.findOne({ where: { id: Number(id) } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== OrderStatus.PENDING) {
      return res.status(400).json({ message: "Order cannot be canceled" });
    }

    order.status = OrderStatus.CANCELLED;
    await orderRepo.save(order);

    return res.status(200).json({ message: "Order canceled successfully", order });
  } catch (error) {
    console.error("Error canceling order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
