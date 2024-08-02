import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    param?: string;
    errors?: { message: string }[];
    name:string
}

// Middleware error handler
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    const { name, param } = err;
    let status = 500;
    let message = 'Internal server error';

    if (name === 'Not Found') {
        status = 404;
        message = `${param} is not found`;
    } else if (name === 'token not found') {
        status = 401;
        message = 'please login first';
    } else if (name === 'access_denied') {
        status = 401;
        message = 'access denied';
    } else if (name === 'login failed') {
        status = 401;
        message = 'email or password was wrong';
    } else if (name === 'Wrong Password/PIN') {
        status = 401;
        message = `${param} was wrong`;
    } else if (name === 'Bad Request') {
        status = 400;
        message = param || 'Bad Request';
    } else if (name === 'SequelizeValidationError') {
        status = 400;
        message = err.errors && err.errors.length > 0 ? err.errors[0].message : 'Validation error';
    } else if (name === 'SequelizeUniqueConstraintError') {
        status = 400;
        message = err.message || 'Unique constraint error';
    } else if (name === 'invalid token' || name === 'JsonWebTokenError') {
        status = 401;
        message = 'Invalid Token';
    } else if (name === 'forbidden') {
        status = 403;
        message = 'Forbidden Access';
    } else if (name === 'Required') {
        status = 400;
        message = `${param} is required`;
    } else if (name === 'Unauthorized Store') {
        status = 400;
        message = `Cannot delete user not in your store`;
    } else if (name === 'Unauthorized Delete') {
        status = 400;
        message = `You do not have permission to delete this ${param}`;
    } else {
        console.log(err);
        
    }

    if (status === 500) {
        console.log(err, '<<<<< [[ ERROR ]]');
    }

    res.status(status).json({ message });
};

export default errorHandler;
