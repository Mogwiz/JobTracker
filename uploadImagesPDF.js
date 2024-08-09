const cloudinary = require('./config/cloudinary');
const multer = require('multer');
const path = require('path');

const uploadImage = async (imagePath) => {
    try {
        const result = await cloudinary.uploader.upload(imagePath);
        return result.url;
    } catch (error) {
        throw new Error('Error uploading image: ' + error.message);
    }
};

const uploadTempPDF = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/'); // Specify the destination directory
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const extension = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Ensure unique file name
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

const uploadPDF = async (pdfPath) => {
    try {
        console.log(pdfPath)
        const result = await cloudinary.uploader.upload(pdfPath, { 
            resource_type: 'raw',
    });
        return result.secure_url;
    } catch (error) {
        throw new Error('Error uploading PDF: ' + error.message);
    }
};

module.exports = { uploadImage, uploadTempPDF, uploadPDF };
