import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware('ADMIN'));

router.get('/users', adminController.getAllUsers);
router.delete('/user/:id', adminController.deleteUser);
router.get('/captains', adminController.getAllCaptains);
router.patch('/captain/:id/verify', adminController.verifyCaptain);
router.get('/requests', adminController.getAllServiceRequests);

export default router;
