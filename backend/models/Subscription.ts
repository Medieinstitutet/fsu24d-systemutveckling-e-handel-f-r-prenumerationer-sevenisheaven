import { Schema, model } from 'mongoose'

const Subscription = new Schema({
    name: {
        type: String,
        required: true
    }
})

export default model('subscriptions', Subscription)