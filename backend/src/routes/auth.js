import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate, schemas } from '../utils/validators.js';

const router = express.Router();

// User Auth
router.post('/user/signup', validate(schemas.userSignup), authController.userSignup);
router.post('/user/login', validate(schemas.loginRequest), authController.userLogin);
router.post('/user/verify-otp', validate(schemas.verifyOtp), authController.userVerifyOtp);

// Captain Auth
router.post('/captain/signup', validate(schemas.captainSignup), authController.captainSignup);
router.post('/captain/login', validate(schemas.loginRequest), authController.captainLogin);
router.post('/captain/verify-otp', validate(schemas.verifyOtp), authController.captainVerifyOtp);

// Admin Auth
router.post('/admin/login', authController.adminLogin);

// Common
router.post('/resend-otp', authController.resendOtp);
router.post('/forget-password', authController.forgetPassword);

export default router;
