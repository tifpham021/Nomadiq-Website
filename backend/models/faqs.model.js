import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    question:{
        type: String,
        required: true
    },
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema);
export default Product;