const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categotySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true,"la decripción es obligatoria"],
    },
    user:{type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Category',categotySchema)