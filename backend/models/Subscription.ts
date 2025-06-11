import { Schema, model } from 'mongoose'

const Subscription = new Schema({
    level_name: {
        type: String,
        required: true
    },
    tier: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
})

export default model('subscriptions', Subscription)
