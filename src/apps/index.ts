import express from 'express';

//
import songRoutes from './songs/song.router';

const router = express.Router();

router.use('/song', songRoutes);

export default router;
