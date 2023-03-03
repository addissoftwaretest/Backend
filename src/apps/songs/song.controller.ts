import { Request, Response } from 'express';
import { Types } from 'mongoose';
import asyncHandler from '@helpers/asyncHandler';
import { SuccessResponse } from '@core/ApiResponse';

import {
    createSong,
    deleteSong,
    getSongs,
    getStats,
    updateSong
} from './model/song.repository';

interface SongRequest extends Request {
    body: {
        title: string;
        artist: string;
        album: string;
        genre: string;
    };
    params: {
        id?: string;
    };
}

export const CreateSong = asyncHandler(
    async (req: SongRequest, res: Response) => {
        const { album, artist, genre, title } = req.body;
        const song = await createSong({ album, artist, genre, title });

        new SuccessResponse('Song created successfully', {
            song
        }).send(res);
    }
);

export const UpdateSong = asyncHandler(
    async (req: SongRequest, res: Response) => {
        const { id } = req.params;
        console.log(`cort ${id}`);
        const { album, artist, genre, title } = req.body;
        const song = await updateSong({
            _id: id! as unknown as Types.ObjectId,
            album,
            artist,
            genre,
            title
        });

        new SuccessResponse('Song updated successfully', {
            song
        }).send(res);
    }
);

export const RemoveSong = asyncHandler(
    async (req: SongRequest, res: Response) => {
        const { id } = req.params;
        await deleteSong(id! as unknown as Types.ObjectId);
        new SuccessResponse('Song removed', {}).send(res);
    }
);

export const GetSongs = asyncHandler(async (req: Request, res: Response) => {
    const songs = await getSongs();
    new SuccessResponse('Song lists', {
        songs
    }).send(res);
});

export const GetStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await getStats();
    new SuccessResponse('Song Stats', {
        stats
    }).send(res);
});
