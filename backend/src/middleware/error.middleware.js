import { ZodError } from 'zod';

const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`, err.stack);

    if (err.name === 'ZodError' || err instanceof ZodError) {
        const issues = err.issues || err.errors || [];
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: issues.map(e => ({ path: e.path?.join('.'), message: e.message }))
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Default basic error message
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};

export default errorHandler;
