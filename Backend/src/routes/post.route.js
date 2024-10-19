import express from "express";
import Post from "../models/post.model.js";
import {
    commentOnPost,
    createPost,
    deletePost,
    getAllPosts,
    getUserPosts,
   
} from "../controllers/post.controller.js";


const router = express.Router();

// Get all posts
router.get("/all", protectRoute, getAllPosts);



// Get posts by a specific user
router.get("/user/:username", protectRoute, getUserPosts);

// Create a new post
router.post("/create", protectRoute, createPost);


// Comment on a post
router.post("/comment/:id", protectRoute, commentOnPost);

// Delete a post
router.delete("/:id", protectRoute, deletePost);

// Get posts for a specific season
router.get("/season/:season", protectRoute, async (req, res) => {
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
        const posts = await Post.find({ userId }); // Fetch posts where userId matches
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

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
