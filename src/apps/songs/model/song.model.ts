import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Song';
const COLLECTION_NAME = 'songs';

export interface Song {
    _id: Types.ObjectId;
    title: string;
    artist: string;
    album: string;
    genre: string;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new Schema<Song>(
    {
        title: {
            type: Schema.Types.String,
            required: true,
            trim: true,
            unique: true
        },
        artist: {
            type: Schema.Types.String,
            required: true,
            trim: true
        },
        album: {
            type: Schema.Types.String,
            required: true,
            trim: true
        },
        genre: {
            type: Schema.Types.String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);
schema.index({ artist: 1, genre: 1 });

export const SongModel = model<Song>(DOCUMENT_NAME, schema, COLLECTION_NAME);
