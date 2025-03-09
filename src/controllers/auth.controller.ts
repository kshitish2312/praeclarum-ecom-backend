import { Request, Response } from "express";
import AppDataSource from "../utils/db";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { AuthRequest } from "../interfaces/interface";
import { logError } from "../Logger/logger";
import { config } from "../config/config";

const userRepository = AppDataSource.getRepository(User);

const generateToken = (user: User): any => {
  const accessToken: any = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  const refreshToken: any = jwt.sign(
    { id: user.id },
    config.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const signup = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password } = req.body;
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = userRepository.create({ name, email, password });
    await userRepository.save(newUser);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error:any) {
    logError(error)

    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const tokens = generateToken(user);
    return res.status(200).json(tokens);
  } catch (error: any) {
    logError(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ message: "Refresh token required" });

    const decoded: any = jwt.verify(token, config.JWT_SECRET as string);
    if (!decoded)
      return res.status(403).json({ message: "Invalid refresh token" });

    const user = await userRepository.findOne({ where: { id: decoded.id } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const newTokens = generateToken(user);

    return res.status(200).json(newTokens);
  } catch (error:any) {
    logError(error)
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const user = await userRepository.findOne({ where: { id: req?.user?.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error:any) {
    logError(error)
    return res.status(500).json({ message: "Server error" });
  }
};
