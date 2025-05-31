import { Router, Request, Response } from 'express'

import Product from '../models/Product'

const r = Router()

r.get('/', async (req: Request, res: Response) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

r.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        
        const product = await Product.findById(id)
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

r.post('/', async (req: Request, res: Response) => {
    try {
        await Product.insertMany(req.body)
        res.json({ message: 'Created done' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

r.patch('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        //todo: validate body maybe instead?

        await Product.updateOne({ _id: id }, { ...req.body  })
        
        res.json({ message: 'Update done' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

r.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        await Product.deleteOne({ _id: id })
        
        res.json({ message: 'Deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default r
