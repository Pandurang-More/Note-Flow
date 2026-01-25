const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Page = require('../models/Page');
const Block = require('../models/Block');

// Get all pages for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const filter = { userId: req.user.id };
        
        // Filter by favorites
        if (req.query.favorites === 'true') {
            filter.isFavorite = true;
            filter.isDeleted = false;
        }
        // Filter by trash
        else if (req.query.trash === 'true') {
            filter.isDeleted = true;
        }
        // All pages (not deleted)
        else {
            filter.isDeleted = false;
        }

        const pages = await Page.find(filter).sort({ createdAt: -1 });
        res.json(pages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single page
router.get('/:id', auth, async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        if (page.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(page);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new page
router.post('/', auth, async (req, res) => {
    try {
        const newPage = new Page({
            userId: req.user.id,
            title: req.body.title || 'Untitled',
            icon: req.body.icon || '📄'
        });

        const page = await newPage.save();
        res.json(page);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update page
router.put('/:id', auth, async (req, res) => {
    try {
        let page = await Page.findById(req.params.id);

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        if (page.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        page.title = req.body.title || page.title;
        page.icon = req.body.icon || page.icon;
        page.updatedAt = Date.now();

        await page.save();
        res.json(page);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete page
router.delete('/:id', auth, async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        if (page.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Block.deleteMany({ pageId: req.params.id });
        await Page.findByIdAndDelete(req.params.id);

        res.json({ message: 'Page deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle favorite
router.patch('/:id/favorite', auth, async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        if (page.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        page.isFavorite = !page.isFavorite;
        page.updatedAt = Date.now();

        await page.save();
        res.json(page);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Move to trash (soft delete)
router.patch('/:id/trash', auth, async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        if (page.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        page.isDeleted = true;
        page.updatedAt = Date.now();

        await page.save();
        res.json({ message: 'Page moved to trash', page });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Restore from trash
router.patch('/:id/restore', auth, async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        if (page.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        page.isDeleted = false;
        page.updatedAt = Date.now();

        await page.save();
        res.json({ message: 'Page restored', page });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Permanently delete page
router.delete('/:id/permanent', auth, async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        if (page.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Block.deleteMany({ pageId: req.params.id });
        await Page.findByIdAndDelete(req.params.id);

        res.json({ message: 'Page permanently deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;