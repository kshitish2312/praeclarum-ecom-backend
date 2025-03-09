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
exports.removeCartItem = exports.updateCartItem = exports.getCart = exports.addToCart = void 0;
const db_1 = __importDefault(require("../utils/db"));
const CartItem_1 = require("../entities/CartItem");
const Product_1 = require("../entities/Product");
const User_1 = require("../entities/User");
const logger_1 = require("../Logger/logger");
// Add item to cart
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity } = req.body;
        const userRepo = db_1.default.getRepository(User_1.User);
        const productRepo = db_1.default.getRepository(Product_1.Product);
        const cartRepo = db_1.default.getRepository(CartItem_1.CartItem);
        const user = yield userRepo.findOne({ where: { id: req.user.id } });
        const product = yield productRepo.findOne({ where: { id: productId } });
        if (!user || !product) {
            return res.status(404).json({ message: "User or product not found" });
        }
        // Check if product already exists in cart
        let cartItem = yield cartRepo.findOne({ where: { user, product } });
        if (cartItem) {
            cartItem.quantity += quantity;
        }
        else {
            cartItem = cartRepo.create({ user, product, quantity });
        }
        yield cartRepo.save(cartItem);
        return res.status(201).json({ message: "Item added to cart", cartItem });
    }
    catch (error) {
        (0, logger_1.logError)(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.addToCart = addToCart;
// Get user's cart items
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartRepo = db_1.default.getRepository(CartItem_1.CartItem);
        const cartItems = yield cartRepo.find({
            where: { user: { id: Number(req.user.id) } },
            relations: ["product"], // Include product details
        });
        return res.status(200).json({ cartItems });
    }
    catch (error) {
        (0, logger_1.logError)(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCart = getCart;
// Update cart item quantity
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const cartRepo = db_1.default.getRepository(CartItem_1.CartItem);
        const cartItem = yield cartRepo.findOne({ where: { id: Number(id) } });
        if (!cartItem)
            return res.status(404).json({ message: "Cart item not found" });
        cartItem.quantity = quantity;
        yield cartRepo.save(cartItem);
        return res.status(200).json({ message: "Cart item updated", cartItem });
    }
    catch (error) {
        (0, logger_1.logError)(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateCartItem = updateCartItem;
// Remove item from cart
const removeCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const cartRepo = db_1.default.getRepository(CartItem_1.CartItem);
        const cartItem = yield cartRepo.findOne({ where: { id: Number(id) } });
        if (!cartItem)
            return res.status(404).json({ message: "Cart item not found" });
        yield cartRepo.remove(cartItem);
        return res.status(200).json({ message: "Cart item removed" });
    }
    catch (error) {
        (0, logger_1.logError)(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.removeCartItem = removeCartItem;
