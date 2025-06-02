import { Schema, model } from 'mongoose'

const Role = new Schema({
    role_name: {
        type: String,
        required: true
    }
})

export default model('user_role', Role)
