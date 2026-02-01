const express = require("express");
const router = express.Router();
const techPosts = require('../models/techBlogPostsModel');
const { verifySSO, requireAdmin } = require('../middleware/ssoAuth');

// Get all tech blog posts
router.get("/", async (req, res) => {
    try {
        console.log("Hi from tech blog");
        const rows = await techPosts.getAllPosts();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get pending tech blog posts (admin only)
router.get("/pending", verifySSO, requireAdmin, async (req, res) => {
    try {
        const rows = await techPosts.getPendingPosts();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new tech blog post (authenticated users can submit)
router.post("/", verifySSO, async (req, res) => {
    try {
        // Auto-fill submitter info from SSO token
        const postData = {
            ...req.body,
            author: req.body.author || req.user.name,
            submitter_email: req.user.email
        };
        await techPosts.addPost(postData);

        res.status(201).json({ message: "Tech Blog Post added successfully" });
    } catch (err) {
        console.error("Error adding tech blog post :", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete a tech blog post (admin only)
router.delete("/:id", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await techPosts.removePost(req.params.id);
        res.json({ affectedRows: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update author (admin only)
router.put("/:id/author", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await techPosts.updateAuthor(req.params.id, req.body.author);
        res.json({ affectedRows: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update title (admin only)
router.put("/:id/title", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await techPosts.updateTitle(req.params.id, req.body.title);
        res.json({ affectedRows: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update summary (admin only)
router.put("/:id/summary", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await techPosts.updateSummary(req.params.id, req.body.summary);
        res.json({ affectedRows: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update link (admin only)
router.put("/:id/link", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await techPosts.updateLink(req.params.id, req.body.link);
        res.json({ affectedRows: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get tech blog post by ID
router.get("/:id", async (req, res) => {
    try {
        const result = await techPosts.getPostById(req.params.id);
        if (result.length === 0) {
            return res.status(404).json({ message: "Tech Blog Post not found" });
        }
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Approve tech blog post (admin only)
router.put("/approve/:id", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await techPosts.approvePost(req.params.id);
        res.json({ affectedRows: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Updating entire tech blog post (admin only)
router.put("/:id", verifySSO, requireAdmin, async (req, res) => {
    try {
        const result = await techPosts.editPost(req.params.id, req.body);
        if (result === 0) {
            return res.status(404).json({ message: "Tech Blog Post not found" });
        }
        res.json({ affectedRows: result });
    } catch (err) {
        console.error('Error updating Tech Blog Post:', err);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;

