import { Request, Response } from 'express'

import Role from '../models/Role'

export const getRoles = (async (req: Request, res: Response) => {
    try {
        const roles = await Role.find()
        res.json(roles)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export const getRoleById = ( async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        
        const role = await Role.findById(id)
        res.json(role)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
