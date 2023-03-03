import { Types } from 'mongoose';
import { NoDataError, BadRequestError } from '@core/ApiError';

import { Song, SongModel } from './song.model';

const createSong = async ({
    album,
    artist,
    genre,
    title
}: Pick<Song, 'title' | 'album' | 'artist' | 'genre'>): Promise<Song> => {
    try {
        const song = await SongModel.create({ album, artist, genre, title });
        return song;
    } catch (error: { code: number; keyPattern: any; keyValue: any } | any) {
        const keys = Object.keys(error.keyPattern);
        const errorMessage: string[] = [];
        switch (error.code) {
            case 11000:
                keys.forEach((key) => {
                    const message = ` "${key}" with "${error.keyValue[key]}" already exist`;
                    errorMessage.push(message);
                });
                throw new BadRequestError(`${errorMessage}`);
            default:
                throw new BadRequestError('Unknown error ');
        }
    }
};

const updateSong = async ({
    _id: id,
    album,
    artist,
    genre,
    title
}: Pick<
    Song,
    '_id' | 'title' | 'album' | 'artist' | 'genre'
>): Promise<Song> => {
    try {
        const song = await SongModel.findByIdAndUpdate(
            id,
            {
                album,
                artist,
                genre,
                title
            },
            { new: true }
        );

        if (!song) {
            throw new NoDataError(`No song with id ${id} found`);
        }
        return song;
    } catch (error: { code: number; keyPattern: any; keyValue: any } | any) {
        const keys = Object.keys(error.keyPattern);
        const errorMessage: string[] = [];
        switch (error.code) {
            case 11000:
                keys.forEach((key) => {
                    const message = ` "${key}" with "${error.keyValue[key]}" already exist`;
                    errorMessage.push(message);
                });
                throw new BadRequestError(`${errorMessage}`);
            default:
                throw new BadRequestError('Unknown error ');
        }
    }
};

const getSongs = async (): Promise<Song[]> => {
    const songs = await SongModel.find();
    return songs;
};

const deleteSong = async (id: Types.ObjectId): Promise<void> => {
    const result = await SongModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
        throw new NoDataError(`No song with id ${id} found`);
    }
};

const getStats = async () => {
    const stats = await SongModel.aggregate([
        {
            $group: {
                _id: { artist: '$artist', album: '$album' },
                numSongs: { $sum: 1 },
                genres: { $addToSet: '$genre' }
            }
        },
        {
            $group: {
                _id: '$_id.artist',
                albums: {
                    $push: {
                        name: '$_id.album',
                        totalSongs: '$numSongs'
                    }
                },
                totalSongs: { $sum: '$numSongs' },
                totalAlbums: { $addToSet: '$_id.album' },
                totalGenres: { $addToSet: '$genres' }
            }
        },

        {
            $group: {
                _id: null,
                totalSongs: { $sum: '$totalSongs' },
                totalArtists: { $sum: 1 },
                totalAlbums: { $sum: { $size: '$totalAlbums' } },
                totalGenres: {
                    $addToSet: '$totalGenres'
                },
                singers: {
                    $push: {
                        name: '$_id',
                        totalSongs: '$totalSongs',
                        totalAlbums: { $size: '$totalAlbums' },
                        totalGenres: { $sum: { $size: '$totalGenres' } },
                        albums: '$albums'
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalSongs: 1,
                totalArtists: 1,
                totalGenres: { $sum: { $size: '$totalGenres' } },
                totalAlbums: 1,
                singers: 1
            }
        }
    ]);
    return stats[0];
};

export { createSong, updateSong, getSongs, deleteSong, getStats };
