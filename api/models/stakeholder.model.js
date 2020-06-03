const mongoose = require('mongoose');
const { Schema } = mongoose;

const StakeholderSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            default: ''
        },
        date: {
            type: Date,
            required: true,
            default: new Date()
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Stakeholder', StakeholderSchema);
