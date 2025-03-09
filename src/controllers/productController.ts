import { Request, Response } from 'express';
import AppDataSource from '../utils/db';
import { Product } from '../entities/Product';
import redisClient from '../utils/redis';
import { config } from '../config/config';
import { logError } from '../Logger/logger';

const REDIS_TTL=Number(config.REDIS_TTL)
export const createProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, price, stock,description } = req.body;
    const images = req.files as any


    if (!images || images.length === 0) {
        return res.status(400).json({ message: 'At least one image is required' });
      }
  
      const imageUrls = images.map((file:any) => file.location);
    const productRepository = AppDataSource.getRepository(Product);
    const newProduct = productRepository.create({ name, price, stock, images:imageUrls, description });

    await productRepository.save(newProduct);
    return res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error:any) {
    logError(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllProducts = async (_req: Request, res: Response): Promise<any> => {
  try {
    // const cachedProducts = await redisClient.get('products');
    // if (cachedProducts) return res.status(200).json(JSON.parse(cachedProducts));

    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find();

    // await redisClient.set('products', JSON.stringify(products), { EX: REDIS_TTL });

    return res.status(200).json(products);
  } catch (error:any) {
    logError(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    // const cachedProduct = await redisClient.get(`product:${id}`);
    // if (cachedProduct) return res.status(200).json(JSON.parse(cachedProduct));

    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id: parseInt(id) } });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // await redisClient.set(`product:${id}`, JSON.stringify(product), { EX: REDIS_TTL });

    return res.status(200).json(product);
  } catch (error:any) {
    logError(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};




export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, price, stock, images, description } = req.body;

    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id: parseInt(id) } });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const newImages: string[] = images ? JSON.parse(images) : [];

    const uploadedImages: string[] = req.files
      ? (req.files as Express.Multer.File[]).map((file:any) => file.location) 
      : [];

    const imagesToRemove = product.images.filter((img) => !newImages.includes(img));

    const updatedImages = [...newImages, ...uploadedImages];

    product.name = name || product.name;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.images = updatedImages;
    product.description = description || product.description;

    await productRepository.save(product);

    return res.status(200).json({
      message: "Product updated successfully",
      product,
      removedImages: imagesToRemove, 
    });

  } catch (error:any) {
    logError(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

  

export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id: parseInt(id) } });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    await productRepository.remove(product);
    // await redisClient.del(`product:${id}`);

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error:any) {
    logError(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};
