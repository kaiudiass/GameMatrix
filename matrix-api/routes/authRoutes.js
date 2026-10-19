import { Router } from 'express';
import { AuthController } from '../controller/authController.js';
import { validate } from '../config/middleware/validationMiddleware.js';
import { authenticate } from '../config/middleware/authMiddleware.js';
import { registerDTO, loginDTO } from '../dtos/request/authDTO.js';

const router = Router();

router.post('/register', validate(registerDTO), AuthController.register);
router.post('/login', validate(loginDTO), AuthController.login);
router.get('/me', authenticate, AuthController.me);

export default router;
