import express from 'express';
import * as captainController from '../controllers/captain.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { validate, schemas } from '../utils/validators.js';

const router = express.Router();

router.use(authMiddleware('CAPTAIN'));

const handleCaptainImageUploads = async (req, res, next) => {
    if (!req.files) return next();
    try {
        if (req.files.avatarUrl && req.files.avatarUrl.length > 0) {
            const url = await uploadToCloudinary(req.files.avatarUrl[0].buffer, 'FixBuddy/captains');
            req.body.avatarUrl = url;
        }
        if (req.files.workImages && req.files.workImages.length > 0) {
            const uploadPromises = req.files.workImages.map(file => uploadToCloudinary(file.buffer, 'FixBuddy/captains/work'));
            const urls = await Promise.all(uploadPromises);
            req.body.workImages = urls;
        }
        next();
    } catch (error) {
        console.error('Cloudinary Upload Error (Captain):', error);
        return res.status(500).json({ success: false, message: 'Failed to upload images', error: error.message || error });
    }
};

router.get('/profile', captainController.getProfile);
router.put('/profile',
    upload.fields([{ name: 'avatarUrl', maxCount: 1 }, { name: 'workImages', maxCount: 10 }]),
    handleCaptainImageUploads,
    captainController.updateProfile
);
router.get('/requests', captainController.getRequests);
router.get('/service-request/:id', captainController.getServiceRequest);

// Accept or reject could also just use the status update endpoint in the frontend
router.patch('/request/:id/status', validate(schemas.statusUpdate), captainController.updateRequestStatus);

router.patch('/toggle-active', captainController.toggleActive);
router.patch('/update-location', captainController.updateLocation);
router.get('/reviews', captainController.getMyReviews);
router.get('/stats', captainController.getDashboardStats);

export default router;
