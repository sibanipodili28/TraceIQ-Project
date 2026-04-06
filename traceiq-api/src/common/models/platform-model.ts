import { ObjectId } from "mongoose";

export interface PlatformBaseModel{
    _id?:ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    isActiveVersion: boolean;
    version?: number;
    isDeleted?: boolean;
}