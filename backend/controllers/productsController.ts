import { Request, Response } from 'express'

import Product from '../models/Product'

export const getProducts = ( async (req: Request, res: Response) => {
    try {
        const products = await Product.find().populate('subscription_id');
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export const getProductById = ( async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        
        const product = await Product.findById(id).populate('subscription_id');
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export const createProduct = ( async (req: Request, res: Response) => {
    try {
        await Product.insertMany(req.body)
        res.json({ message: 'Created Product' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export const updateProduct = (async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        //todo: validate body maybe instead?

        await Product.updateOne({ _id: id }, { ...req.body  })
        
        res.json({ message: `Update Product With ${id}` })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export const deleteProduct = ( async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        await Product.deleteOne({ _id: id })
        
        res.json({ message: `Deleted Product With ${id}` })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
