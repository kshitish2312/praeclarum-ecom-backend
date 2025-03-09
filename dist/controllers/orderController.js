"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.getOrderById = exports.getUserOrders = exports.getAllOrders = exports.createOrder = void 0;
const db_1 = __importDefault(require("../utils/db"));
const Order_1 = require("../entities/Order");
const OrderItem_1 = require("../entities/OrderItem");
const Product_1 = require("../entities/Product");
const User_1 = require("../entities/User");
const Order_2 = require("../entities/Order");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderItems } = req.body;
        const userRepo = db_1.default.getRepository(User_1.User);
        const productRepo = db_1.default.getRepository(Product_1.Product);
        const orderRepo = db_1.default.getRepository(Order_1.Order);
        const orderItemRepo = db_1.default.getRepository(OrderItem_1.OrderItem);
        const user = yield userRepo.findOne({ where: { id: req.user.id } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        let totalAmount = 0;
        const itemsToSave = [];
        for (const item of orderItems) {
            const product = yield productRepo.findOne({ where: { id: item.productId } });
            if (!product)
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            totalAmount += product.price * item.quantity;
            const orderItem = orderItemRepo.create({ product, quantity: item.quantity, price: product.price });
            itemsToSave.push(orderItem);
        }
        const order = orderRepo.create({ user, orderItems: itemsToSave });
        yield orderRepo.save(order);
        return res.status(201).json({ message: "Order placed successfully", order });
    }
    catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.createOrder = createOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(403).json({ message: "Access denied" });
        const orderRepo = db_1.default.getRepository(Order_1.Order);
        const orders = yield orderRepo.find({ relations: ["user", "orderItems", "orderItems.product"] });
        return res.status(200).json({ orders });
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllOrders = getAllOrders;
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderRepo = db_1.default.getRepository(Order_1.Order);
        const orders = yield orderRepo.find({
            where: { user: { id: req.user.id } },
            relations: ["orderItems", "orderItems.product"],
        });
        return res.status(200).json({ orders });
    }
    catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserOrders = getUserOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const orderRepo = db_1.default.getRepository(Order_1.Order);
        const order = yield orderRepo.findOne({
            where: { id: Number(id) },
            relations: ["user", "orderItems", "orderItems.product"],
        });
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        return res.status(200).json({ order });
    }
    catch (error) {
        console.error("Error fetching order:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getOrderById = getOrderById;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const orderRepo = db_1.default.getRepository(Order_1.Order);
        const order = yield orderRepo.findOne({ where: { id: Number(id) } });
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        if (order.status !== Order_2.OrderStatus.PENDING) {
            return res.status(400).json({ message: "Order cannot be canceled" });
        }
        order.status = Order_2.OrderStatus.CANCELLED;
        yield orderRepo.save(order);
        return res.status(200).json({ message: "Order canceled successfully", order });
    }
    catch (error) {
        console.error("Error canceling order:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.cancelOrder = cancelOrder;
