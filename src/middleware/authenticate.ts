import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import redis from '../config/redis';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded; // Gán thông tin người dùng vào req.user
        console.log('Tube req.user:', req.user);
        
        const redisData = await redis.get(`token:${req.user.email}`, (err, data) => {
            if (err) {
                console.error('Redis error:', err);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }
            if (!data) {
                
                redis.del(`token:${req.user.email}`);
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
        })

        if (!redisData) {
            res.status(401).json({ message: 'Unauthorized: Session expired or token revoked' });
            return;
        }
        next();
    } catch (error) {     
        res.status(403).json({ message: 'Invalid Token' });
        return;
    }
}