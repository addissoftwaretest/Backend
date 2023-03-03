import express from 'express';
import validator, { ValidationSource } from '@helpers/validator';

import {
    CreateSong,
    GetSongs,
    RemoveSong,
    UpdateSong,
    GetStats
} from './song.controller';
import schema from './song.schema';

const router = express.Router();

router.get('/', GetSongs);

router.post(
    '/',
    validator(schema.songSchema, ValidationSource.BODY),
    CreateSong
);

router.delete(
    '/:id',
    validator(schema.songId, ValidationSource.PARAM),
    RemoveSong
);

router.put(
    '/:id',
    validator(schema.songId, ValidationSource.PARAM),
    UpdateSong
);

router.get('/getstats', GetStats);

export default router;
