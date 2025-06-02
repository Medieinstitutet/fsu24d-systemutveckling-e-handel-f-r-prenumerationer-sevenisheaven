import { Request, Response } from 'express'

import Subscription from '../models/Subscription'

export const getSubscriptions = (async (req: Request, res: Response) => {
    try {
        const subscriptions = await Subscription.find()
        res.json(subscriptions)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export const getSubscriptionById = ( async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        
        const subscription = await Subscription.findById(id)
        res.json(subscription)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
