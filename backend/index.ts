//import 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import productsRouter from './routes/products'
import subscriptionsRouter from './routes/subscriptions'

const app = express()             

app.use(cors()) 

app.use(express.json())

app.use('/products', productsRouter)
app.use('/subscriptions', subscriptionsRouter)

mongoose.connect(process.env.DB_URL || '')

app.listen(process.env.PORT || 5000)
