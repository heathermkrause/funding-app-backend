const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConnectionSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            default: ''
        },
        from: {
            type: Schema.ObjectId,
            ref: 'Stakeholder',
            required: true,
        },
        to: {
            type: Schema.ObjectId,
            ref: 'Stakeholder',
            required: true
        },
        note: {
            type: String,
            default: null
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Connection', ConnectionSchema);
