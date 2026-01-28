const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page',
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ['text', 'heading1', 'heading2', 'heading3', 'bullet', 'numbered', 'quote'],
        default: 'text'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Block', blockSchema);