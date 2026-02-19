import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: Number, required: true },
    image: { type: String, required: true },
    features: { type: [String], required: true },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
