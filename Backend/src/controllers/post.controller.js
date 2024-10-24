import Post from "../models/post.model.js";
import {User} from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
    try {
        // User authentication logic can be uncommented if needed
        // if (!req.user) {
        //     return res.status(401).json({ error: "User not authenticated" });
        // }

        const { text, placeName, location, bestSeasonToVisit, category } = req.body;
        let { img } = req.body; // Expecting img to be an array of image URLs

        // Uncomment if user authentication is required
        // const userId = req.user._id;
        // const user = await User.findById(userId);
        // if (!user) return res.status(404).json({ message: "User not found" });

        // Validate required fields
        if (!placeName || !location || !bestSeasonToVisit || !category) {
            return res.status(400).json({
                error: "Place name, location, best season to visit, and category are required",
            });
        }

        // Ensure there is text or at least one image
        if (!text && !img) {
            return res.status(400).json({ error: "Post must have text or an image" });
        }

        // Handle image uploads
        if (img && Array.isArray(img)) {
            // If img is an array, handle multiple uploads
            const uploadPromises = img.map(async (image) => {
                // Assuming the image is a URL; modify this line if images are file uploads
                const uploadedResponse = await cloudinary.uploader.upload(image);
                return uploadedResponse.secure_url; // Return the uploaded image URL
            });
            img = await Promise.all(uploadPromises); // Wait for all uploads to complete
            console.log("Images uploaded successfully:", img);
        } else if (img) {
            // Handle single image if not an array
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = [uploadedResponse.secure_url]; // Wrap single image URL in an array
            console.log("Image uploaded successfully:", img);
        }

        // Create a new post
        const newPost = new Post({
            // user: userId, // Uncomment if user association is needed
            text,
            img, // This will now be an array of image URLs
            placeName,
            location,
            bestSeasonToVisit,
            category,
        });

        // Save the post to the database
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error in createPost controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export default createPost;

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Error in deletePost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const comment = { user: userId, text };

        post.comments.push(comment);
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        console.log("Error in commentOnPost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        if (posts.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getAllPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const following = user.following;

        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(feedPosts);
    } catch (error) {
        console.log("Error in getFollowingPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const posts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getUserPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export {
    createPost,
    deletePost,
    commentOnPost,
    getAllPosts,
    getFollowingPosts,
    getUserPosts
};