import { Schema, model } from 'mongoose'

const Subscription = new Schema({
    level_name: {
        type: String,
        required: true
    },
    tier: {
        type: Number,
        required: true
    }
})

export default model('subscriptions', Subscription)
