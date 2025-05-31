import { Router, Request, Response } from 'express'

const r = Router()

r.get('/', async (req: Request, res: Response) => {
    try {
        res.json([])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

export default router
