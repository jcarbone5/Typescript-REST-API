import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface IPayload {
    id: string;
    lat: number;
    ext: number;
}

export const validateToken = (req: any, res: Response, next: NextFunction) => {
    const token = req.header('x-access-token');

    try {
        if (!token) res.status(400).json({ message: 'No token provider' });

        const payload = jwt.verify(token!, 'secret-rest-api-ts') as IPayload;

        req.userId = payload.id;

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}