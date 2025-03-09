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
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const db_1 = __importDefault(require("../utils/db"));
const Product_1 = require("../entities/Product");
const config_1 = require("../config/config");
const logger_1 = require("../Logger/logger");
const REDIS_TTL = Number(config_1.config.REDIS_TTL);
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, stock, description } = req.body;
        const images = req.files;
        if (!images || images.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }
        const imageUrls = images.map((file) => file.location);
        const productRepository = db_1.default.getRepository(Product_1.Product);
        const newProduct = productRepository.create({ name, price, stock, images: imageUrls, description });
        yield productRepository.save(newProduct);
        return res.status(201).json({ message: 'Product created successfully', product: newProduct });
    }
    catch (error) {
        (0, logger_1.logError)(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createProduct = createProduct;
const getAllProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const cachedProducts = await redisClient.get('products');
        // if (cachedProducts) return res.status(200).json(JSON.parse(cachedProducts));
        const productRepository = db_1.default.getRepository(Product_1.Product);
        const products = yield productRepository.find();
        // await redisClient.set('products', JSON.stringify(products), { EX: REDIS_TTL });
        return res.status(200).json(products);
    }
    catch (error) {
        (0, logger_1.logError)(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllProducts = getAllProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // const cachedProduct = await redisClient.get(`product:${id}`);
        // if (cachedProduct) return res.status(200).json(JSON.parse(cachedProduct));
        const productRepository = db_1.default.getRepository(Product_1.Product);
        const product = yield productRepository.findOne({ where: { id: parseInt(id) } });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        // await redisClient.set(`product:${id}`, JSON.stringify(product), { EX: REDIS_TTL });
        return res.status(200).json(product);
    }
    catch (error) {
        (0, logger_1.logError)(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, price, stock, images, description } = req.body;
        const productRepository = db_1.default.getRepository(Product_1.Product);
        const product = yield productRepository.findOne({ where: { id: parseInt(id) } });
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        const newImages = images ? JSON.parse(images) : [];
        const uploadedImages = req.files
            ? req.files.map((file) => file.location)
            : [];
        const imagesToRemove = product.images.filter((img) => !newImages.includes(img));
        const updatedImages = [...newImages, ...uploadedImages];
        product.name = name || product.name;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.images = updatedImages;
        product.description = description || product.description;
        yield productRepository.save(product);
        return res.status(200).json({
            message: "Product updated successfully",
            product,
            removedImages: imagesToRemove,
        });
    }
    catch (error) {
        (0, logger_1.logError)(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productRepository = db_1.default.getRepository(Product_1.Product);
        const product = yield productRepository.findOne({ where: { id: parseInt(id) } });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        yield productRepository.remove(product);
        // await redisClient.del(`product:${id}`);
        return res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        (0, logger_1.logError)(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteProduct = deleteProduct;
