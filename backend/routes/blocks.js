const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Block = require('../models/Block');
const Page = require('../models/Page');

// Get all blocks for a page
router.get('/:pageId', auth, async (req, res) => {
    try {
        const page = await Page.findById(req.params.pageId);
        if (!page || page.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const blocks = await Block.find({ pageId: req.params.pageId }).sort({ order: 1 });
        res.json(blocks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new block
router.post('/', auth, async (req, res) => {
    try {
        const { pageId, content, order } = req.body;

        const page = await Page.findById(pageId);
        if (!page || page.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const newBlock = new Block({
            pageId,
            content: content || '',
            order: order || 0
        });

        const block = await newBlock.save();
        
        page.updatedAt = Date.now();
        await page.save();

        res.json(block);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update block
router.put('/:id', auth, async (req, res) => {
    try {
        let block = await Block.findById(req.params.id);

        if (!block) {
            return res.status(404).json({ message: 'Block not found' });
        }

        const page = await Page.findById(block.pageId);
        if (!page || page.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        block.content = req.body.content !== undefined ? req.body.content : block.content;
        block.order = req.body.order !== undefined ? req.body.order : block.order;

        await block.save();

        page.updatedAt = Date.now();
        await page.save();

        res.json(block);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete block
router.delete('/:id', auth, async (req, res) => {
    try {
        const block = await Block.findById(req.params.id);

        if (!block) {
            return res.status(404).json({ message: 'Block not found' });
        }

        const page = await Page.findById(block.pageId);
        if (!page || page.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Block.findByIdAndDelete(req.params.id);

        page.updatedAt = Date.now();
        await page.save();

        res.json({ message: 'Block deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;