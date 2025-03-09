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
exports.getProfile = exports.refreshToken = exports.login = exports.signup = void 0;
const db_1 = __importDefault(require("../utils/db"));
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const logger_1 = require("../Logger/logger");
const config_1 = require("../config/config");
const userRepository = db_1.default.getRepository(User_1.User);
const generateToken = (user) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, config_1.config.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, config_1.config.JWT_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    try {
        const { name, email, password } = req.body;
        const existingUser = yield userRepository.findOne({ where: { email } });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });
        const newUser = userRepository.create({ name, email, password });
        yield userRepository.save(newUser);
        return res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        (0, logger_1.logError)(error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    try {
        const { email, password } = req.body;
        const user = yield userRepository.findOne({ where: { email } });
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password)))
            return res.status(401).json({ message: "Invalid credentials" });
        const tokens = generateToken(user);
        return res.status(200).json(tokens);
    }
    catch (error) {
        (0, logger_1.logError)(error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        if (!token)
            return res.status(400).json({ message: "Refresh token required" });
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        if (!decoded)
            return res.status(403).json({ message: "Invalid refresh token" });
        const user = yield userRepository.findOne({ where: { id: decoded.id } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const newTokens = generateToken(user);
        return res.status(200).json(newTokens);
    }
    catch (error) {
        (0, logger_1.logError)(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.refreshToken = refreshToken;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield userRepository.findOne({ where: { id: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }
    catch (error) {
        (0, logger_1.logError)(error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.getProfile = getProfile;
