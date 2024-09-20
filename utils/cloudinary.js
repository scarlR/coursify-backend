import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'course_images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif']
  },
});

export const uploadFiles = multer({ storage: storage }).single('file');

export const uploadOnCloudinary = async (file) => {
  try {
    if (!file) return null;
    
    // The file is already uploaded to Cloudinary by multer-storage-cloudinary
    // We just need to return the file information
    return {
      url: file.path,
      public_id: file.filename
    };
  } catch (error) {
    console.error('Error in uploadOnCloudinary:', error);
    return null;
  }
};