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