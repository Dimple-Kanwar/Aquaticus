import express from 'express';
const router = express.Router();
import { authLimiter } from '../middleware/rateLimiter.middleware';
import authController from '../controllers/auth.controller';

router.post('/login', authLimiter, authController.login);

module.exports = router;