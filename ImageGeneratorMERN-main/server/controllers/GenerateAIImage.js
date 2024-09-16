import * as dotenv from "dotenv";
import { createError } from "../error.js";
import OpenAI from "openai";
import Post from "../models/Posts.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const generateImage = async (req, res, next) => {
  try {
    const { prompt, name } = req.body;
    // Generate the image from OpenAI
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
      model: "dall-e-3"
    });

    const generatedImage = response.data[0].b64_json;

   try {
     // Prefix the base64 string with the proper data URI scheme
     const imageDataUri = `data:image/png;base64,${generatedImage}`;
 
     // Upload the image to Cloudinary
     const uploadResult = await cloudinary.uploader.upload(imageDataUri);
 
     // Create a new post with the uploaded image's URL
     const newPost = await Post.create({
       name,
       prompt,
       photo: uploadResult.secure_url,
     });
   return res.status(200).json({ photo: newPost?.photo });
   } catch (error) {
    
   }
  } catch (error) {
    console.log(error);
    next(
      createError(
        error.status || 500,
        error?.response?.data?.error?.message || error?.message || "Something went wrong"
      )
    );
  }
};
