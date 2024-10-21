import express from "express";
import {
    commentOnPost,
    createPost,
    deletePost,
    getAllPosts,
    getUserPosts,
    getFollowingPosts
} from "../controllers/post.controller.js";
import Post from "../models/post.model.js";
import multer from "multer";
import path from "path";
import  {verifyJWT}  from "../middlewares/auth.middleware.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/temp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

// Get all posts
router.get("/all", getAllPosts);

// Get posts by a specific user
router.get("/user/:username", getUserPosts);

// Create a new post
router.post("/create", createPost);

// Comment on a post
router.post("/comment/:id", commentOnPost);

// Delete a post
router.delete("/:id", deletePost);

// Get posts for a specific season
router.get("/season/:season", async (req, res) => {
    const { season } = req.params;
    try {
        const posts = await Post.find({ bestSeasonToVisit: season })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            });

        if (!posts.length) {
            return res.status(404).json({ message: `No posts found for the ${season} season` });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error fetching posts by season:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get posts by userId
router.get('/posts/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ user: userId });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get posts from followed users
router.get('/feed', getFollowingPosts);

// Upload temporary images
router.post('/public/temp', upload.array('images', 10), (req, res) => {
    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(400).send("No files were uploaded.");
    }

    // Array of file paths
    const imagePaths = files.map(file => `/public/temp/${file.filename}`);
    res.status(200).json({ message: "Images uploaded successfully!", imagePaths });
});

export default router;