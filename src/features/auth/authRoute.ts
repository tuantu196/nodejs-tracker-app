import { authenticate } from '../../middleware/authenticate.ts';
import * as authController from './authController.ts';
import { Router } from 'express';

const router = Router();

router.post('/login' ,authController.login);
router.post('/register', authController.register);
router.post('/logout', authenticate, authController.logout);
router.get('/refresh', authenticate, authController.refresh);
router.get('/userInformation', authenticate, authController.userInformation);

export default router;