const express = require("express");
const router = express.Router();
const highlightPosts = require('../models/studentHighlightModel');
const { requireNPAuth, requireStudent, requireAdmin } = require('../middleware/samlAuth');

// GET approved student highlights
router.get("/", async (req, res) => {
    try {
        const rows = await highlightPosts.getAllPosts();
        res.json(rows);
    } catch (err) {
        console.error('Error getting student highlights:', err);
        res.status(500).json({ message: err.message });
    }
});



// GET pending student highlights
router.get("/pending", async (req, res) => {
    try {
        const rows = await highlightPosts.getPendingPosts();
        res.json(rows);
    } catch (err) {
        console.error('Error getting student highlights:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET student highlight by ID
router.get("/:id", async (req, res) => {
    try {
        const rows = await highlightPosts.getPostById(req.params.id);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Student highlight not found" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error getting student highlights:', err);
        res.status(500).json({ message: err.message });
    }
}
);


// POST new student highlight (legacy - no auth)
router.post("/", async (req, res) => {
    try {
        await highlightPosts.addPost(req.body);

        res.status(201).json({ message: "Student highlight added successfully" });
    } catch (err) {
        console.error("Error adding student highlight:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }

});

// POST new student highlight with SAML authentication
router.post("/submit-authenticated", requireNPAuth, requireStudent, async (req, res) => {
    try {
        const { project_title, summary, project_description, project_link, github_link, banner_image, headshot_url } = req.body;

        // Auto-populate from SAML user
        const postData = {
            project_title,
            summary,
            project_description,
            project_link,
            github_link,
            student_name: req.samlUser.display_name || `${req.samlUser.given_name || ''} ${req.samlUser.family_name || ''}`.trim(),
            student_email: req.samlUser.email,
            headshot_url: headshot_url || null,
            banner_image: banner_image || null,
            submitted_by_saml: true
        };

        const result = await highlightPosts.addPost(postData);
        res.status(201).json({
            message: 'Project submitted successfully',
            id: result
        });
    } catch (error) {
        console.error('Error submitting project:', error);
        res.status(500).json({ message: 'Failed to submit project' });
    }
});

// DELETE student highlight
router.delete("/:id", async (req, res) => {
    try {
        const result = await highlightPosts.deletePost(req.params.id);
        if (result === 0) {
            return res.status(404).json({ message: "Student highlight not found"});
        }
        res.json({ affectedRows: result });
    } catch (err) {
        console.error('Error deleting student highlight:', err);
        res.status(500).json({ message: err.message });
    }
});

// UPDATE project title
router.put("/:id/title", async (req, res) => {
    try {
        const result = await highlightPosts.updateTitle(req.params.id, req.body.title);
        if (result === 0) {
            return res.status(404).json({ message: "Student highlight not found" });
        }
        res.json({ affectedRows: result });
    } catch (err) {
        console.error('Error updating project title:', err);
        res.status(500).json({ message: err.message });
    }
});

// UPDATE project summary
router.put("/:id/summary", async (req, res) => {
    try {
        const result = await highlightPosts.updateSummary(req.params.id, req.body.summary);
        if (result === 0) {
            return res.status(404).json({ message: "Student highlight not found" });
        }
        res.json({ affectedRows: result });
    } catch (err) {
        console.error('Error updating summary:', err);
        res.status(500).json({ message: err.message });
    }
});

// UPDATE project description
router.put("/:id/description", async (req, res) => {
    try {
        const result = await highlightPosts.updateDescription(req.params.id, req.body.description);
        if (result === 0) {
            return res.status(404).json({ message: "Student highlight not found" });
        }
        res.json({ affectedRows: result });
    } catch (err) {
        console.error('Error updating description:', err);
        res.status(500).json({ message: err.message });
    }
});

// UPDATE project link
router.put("/:id/project-link", async (req, res) => {
    try {
        const result = await highlightPosts.updateProjectLink(req.params.id, req.body.projectLink);
        if (result === 0) {
            return res.status(404).json({ message: "Student highlight not found" });
        }
        res.json({ affectedRows: result });
    } catch (err) {
        console.error('Error updating project link:', err);
        res.status(500).json({ message: err.message });
    }
});

// UPDATE github link
router.put("/:id/github-link", async (req, res) => {
    try {
        const result = await highlightPosts.updateGithubLink(req.params.id, req.body.githubLink);
        if (result === 0) {
            return res.status(404).json({ message: "Student highlight not found" });
        }
        res.json({ affectedRows: result });
    } catch (err) {
        console.error('Error updating github link:', err);
        res.status(500).json({ message: err.message });
    }
});

// UPDATE headshot URL
router.put("/:id/headshot", async (req, res) => {
    try {
        const result = await highlightPosts.updateHeadshot(req.params.id, req.body.headshot);
        if (result === 0) {
            return res.status(404).json({ message: "Student highlight not found" });
        }
        res.json({ affectedRows: result });
    } catch (err) {
        console.error('Error updating headshot:', err);
        res.status(500).json({ message: err.message });
    }
});

// UPDATE headshot URL
router.put("/approve/:id", async (req, res) => {
    try {
        const result = await highlightPosts.approve(req.params.id);
        if (result === 0) {
            return res.status(404).json({ message: "Student highlight not found" });
        }
        res.json({ affectedRows: result });
    } catch (err) {
        console.error('Error updating approval:', err);
        res.status(500).json({ message: err.message });
    }
});

// UPDATE all fields of a student highlight
router.put("/:id", async (req, res) => {
    try {
        const result = await highlightPosts.editPost(req.params.id, req.body); // Pass all form data to the model
        if (result === 0) {
            return res.status(404).json({ message: "Student highlight not found" });
        }
        res.json({ affectedRows: result });
    } catch (err) {
        console.error("Error updating student highlight:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

