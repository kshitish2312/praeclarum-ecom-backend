import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';

const schemas = {
  signup: yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Valid email is required').required(),
    password: yup.string().min(6, 'Password must be at least 6 characters').required(),
  }),
  login: yup.object({
    email: yup.string().email('Valid email is required').required(),
    password: yup.string().required('Password is required'),
  }),
};

const validate = (schemaName: keyof typeof schemas) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = await schemas[schemaName].validate(req.body, { abortEarly: false });
    next();
  } catch (err:any) {
    res.status(400).json({ errors: err.errors });
  }
};

export default validate;
