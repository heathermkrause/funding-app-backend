const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            default: ''
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Project', ProjectSchema);
