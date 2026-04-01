import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { validate, schemas } from '../utils/validators.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

router.use(authMiddleware('USER')); // All user routes are protected

router.get('/captains', userController.getCaptains);
router.get('/captain/:id', userController.getCaptainById);
router.get('/service-requests', userController.getUserServiceRequests);
router.get('/profile', userController.getProfile);

const handleUserProfileImageUpload = async (req, res, next) => {
    if (!req.file) return next();
    try {
        const url = await uploadToCloudinary(req.file.buffer, 'FixBuddy/users');
        req.body.profileImage = url;
        next();
    } catch (error) {
        console.error('Cloudinary Upload Error (User Profile):', error);
        return res.status(500).json({ success: false, message: 'Failed to upload profile image', error: error.message || error });
    }
};

router.put('/profile',
    upload.single('profileImage'),
    handleUserProfileImageUpload,
    userController.updateProfile
);

// Middleware wrapper for Cloudinary upload before controller
const handleImageUploads = async (req, res, next) => {
    if (!req.files || req.files.length === 0) return next();
    try {
        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, 'FixBuddy/requests'));
        const urls = await Promise.all(uploadPromises);
        req.body.images = urls; // Attach URLs to body for controller
        req.files = req.files.map((file, i) => ({ ...file, path: urls[i] })); // Mock format if needed
        next();
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to upload images', error: error.message || error });
    }
};

router.post('/service-request',
    upload.array('images', 5),
    handleImageUploads,
    validate(schemas.createServiceRequest),
    userController.createServiceRequest
);

router.get('/service-request/:id', userController.getServiceRequest);
router.put('/service-request/:id', validate(schemas.updateServiceRequest), userController.updateServiceRequest);
router.delete('/service-request/:id', userController.deleteServiceRequest);
router.post('/review', validate(schemas.addReview), userController.createReview);

export default router;
