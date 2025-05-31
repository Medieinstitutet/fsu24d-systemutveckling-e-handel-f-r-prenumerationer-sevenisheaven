import 'dotenv'
import express from 'express'
// await impo mongoose = require('mongoose')
import cors from 'cors'

const app = express()             

app.use(cors()) 

app.use(express.json())

app.use('/products', require('./routes/products'))

app.listen(process.env.PORT || 5000);
