import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        console.log('Attempting to upload file:', localFilePath);
        
        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.error('File does not exist:', localFilePath);
            return null;
        }

        // Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        console.log("File uploaded successfully:", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}