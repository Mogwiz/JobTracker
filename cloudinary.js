require('dotenv').config();
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: "dknkidggj",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const cloudinaryUpload = async () =>{
    const results = await cloudinary.uploader.upload('./cloudinary/cutiecat.jpg');
    
    const url = cloudinary.url(results.public_id, {
        transformation: [
            {
                aspect_ratio: "1:1",
                gravity: "auto",
                width: 500,
                crop: "auto",
            },
            {
                radius: "max",
            }
            ]
    })
    console.log(results);
};

cloudinaryUpload();