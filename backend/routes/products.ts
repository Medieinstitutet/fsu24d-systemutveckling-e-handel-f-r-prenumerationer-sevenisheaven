import { Router, Request, Response } from 'express'

const r = Router()

r.get('/', async (req: Request, res: Response) => {
    try {
        //todo: get all from DB
        res.json([])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

r.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        //todo: get from DB filtered by id
        
        res.json({})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

r.patch('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        //todo: update said object in db
        
        res.json([])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

r.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        //todo: update said object in db
        
        res.json({ message: 'Deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router
