import { DateResourceModel } from "jack-hermanson-ts-utils";

export interface FileRequest {
    data: string;
    name: string;
    mimeType: string;
}

export interface FileRecord extends FileRequest, DateResourceModel {}
