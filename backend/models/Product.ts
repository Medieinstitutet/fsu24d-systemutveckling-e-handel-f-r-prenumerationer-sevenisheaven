import { Schema, model } from 'mongoose'

const Product = new Schema({
    product_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    subscription_id: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
})

export default model('products', Product)