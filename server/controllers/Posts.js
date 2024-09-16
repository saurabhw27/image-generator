import Post from "../models/Posts.js";
import * as dotenv from "dotenv";
import { createError } from "../error.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all posts

export const getAllPosts = async (req, res, next) => {
  try {
    const pageSize = 14;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
console.log(pageNumber);
    // Calculate total number of posts
    const totalPosts = await Post.countDocuments({});

    // Calculate total pages
    const totalPages = Math.ceil(totalPosts / pageSize);

    // Retrieve paginated posts in descending order, so the newest posts appear first
    const posts = await Post.find({})
      .sort({ _id: -1 })  // Ensures the newest posts are retrieved first
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    let reversedPosts = posts.reverse();
    console.log(reversedPosts)
    return res.status(200).json({ 
      success: true, 
      data: reversedPosts, 
      totalPages 
    });
  } catch (error) {
    next(
      createError(
        error.status,
        error?.response?.data?.error?.message || error?.message
      )
    );
  }
};




//  Create Post
export const createPost = async (req, res, next) => {
  try {
    const { name='guest', prompt, photo } = req.body;
    const photoUrl = await cloudinary.uploader.upload(photo);
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl?.secure_url,
    });
    return res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    next(
      createError(
        error.status,
        error?.response?.data?.error?.message || error?.message
      )
    );
  }
};
