import { Schema, model, Types } from "mongoose";

const BackgroundTasks = new Schema({
    type: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    }
})

export default model('background_tasks', BackgroundTasks)