const cloudinary = require('./config/cloudinary');

const uploadImage = async (imagePath) => {
    try {
        const result = await cloudinary.uploader.upload(imagePath);
        return result.url;
    } catch (error) {
        throw new Error('Error uploading image: ' + error.message);
    }
};

module.exports = uploadImage;
