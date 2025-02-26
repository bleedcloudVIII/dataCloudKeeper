import * as grpc from '@grpc/grpc-js';
import type { DownloadRequest } from './proto/interface/downloadRequest';
import type { DownloadResponse } from './proto/interface/downloadResponse';
import type { SaveRequest } from './proto/interface/saveRequest';
import type { SaveResponse } from './proto/interface/saveResponse';
import { readFile, writeFile } from "fs/promises";
import * as path from 'path';

// TODO обработку ошибок, чтобы не крашилось

export async function download(call: grpc.ServerUnaryCall<DownloadRequest, DownloadResponse>, callback: grpc.sendUnaryData<DownloadResponse>) {
    const file_name = call.request.file_name;
    const location = call.request.location;
    const filePath = path.resolve(__dirname, `./../files/${file_name}`);

    const content = await readFile(filePath)
    callback(null, { bytes: `${content}` });
}

export async function save(call: grpc.ServerUnaryCall<SaveRequest, SaveResponse>, callback: grpc.sendUnaryData<SaveResponse>) {
    const file_name = call.request.file_name;
    const bytes = call.request.bytes;
    const filePath = path.resolve(__dirname, `./../files/${file_name}`);

    await writeFile(filePath, bytes);
    
    callback(null, {message: "OK", status: 0});
}