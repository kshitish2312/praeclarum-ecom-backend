import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { Request } from 'express';
import { config } from '../config/config';


// ✅ Setup S3 Client
const s3 = new S3Client({
  region: config.AWS_REGION as string,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY as string,
  },
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: config.AWS_S3_BUCKET_NAME as string,
    contentType: multerS3.AUTO_CONTENT_TYPE, 
    metadata: (req: Request, file:any, cb:any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req: Request, file:any, cb:any) => {
      const fileName = `products/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req: Request, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  },
});

export default upload;
