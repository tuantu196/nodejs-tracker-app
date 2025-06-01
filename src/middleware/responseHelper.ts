import { Request, Response, NextFunction } from 'express';


const responseEnhancer = (req: Request, res: Response, next: NextFunction) => {
    res.success = function <T>(message: string, data?: T | null) {
        return this.status(200).json({
            success: true,
            message,
            data, 
            error: null,
        })
    }

    res.failure = function <T>(message: string, errorCode: number, error?: string | null) {
        return this.status(errorCode).json({
            success: false,
            message,
            error,
        })
    }

    next()
}

export default responseEnhancer