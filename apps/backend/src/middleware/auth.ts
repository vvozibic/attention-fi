import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'No token' })

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
    next()
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
