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
        default: 'text'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Block', blockSchema);
