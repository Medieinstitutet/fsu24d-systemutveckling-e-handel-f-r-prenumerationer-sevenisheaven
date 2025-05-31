import 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import productsRouter from './routes/products'

const app = express()             

app.use(cors()) 

app.use(express.json())

app.use('/products', productsRouter)


mongoose.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {console.log('DB connected')}
)

app.listen(process.env.PORT || 5000)
