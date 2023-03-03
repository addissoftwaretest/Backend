import { JoiObjectId } from '@helpers/validator';
import Joi from 'joi';

export default {
    songSchema: Joi.object().keys({
        title: Joi.string().required(),
        artist: Joi.string().required(),
        album: Joi.string().required(),
        genre: Joi.string().required()
    }),
    songId: Joi.object().keys({
        id: JoiObjectId().required().required()
    })
};
