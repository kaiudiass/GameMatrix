import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import matchRoutes from './matchRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    system: 'MATRIX_API',
    version: '2.0.0 (Sequelize)'
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/matches', matchRoutes);

export default router;
