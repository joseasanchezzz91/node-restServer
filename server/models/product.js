const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    price: { type: Number, required: [true, 'El precio únitario es necesario'] },
    description: { type: String, required: false },
    status: { type: Boolean, required: true, default: true },
    img: {
        type: String,
        required: false,
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Product', productSchema);