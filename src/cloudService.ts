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

// TODO затирать данные в файле в начале записи??
export function save(call, callback) {
    // const file_name = call.request.file_name;
    const file_name = call.metadata.get('file_name');
    // const bytes = call.request.bytes;
    const filePath = path.resolve(__dirname, `./../files/${file_name}`);

    const writer = Bun.file(filePath);//.writer();

    call.on('data', (chunk: {bytes: string}) => {
        console.log(chunk.bytes);
        //Bun.write(filePath, chunk.bytes, {mode: 'append'});
        writer.write(chunk.bytes);
    });

    call.on('end', () => {
        writer.end();
        callback(null, {message: "OK", status: 0});
    });

    call.on('error', (err) => {
        console.log(err);
    });

    // await writeFile(filePath, bytes);
    
    // callback(null, {message: "OK", status: 0});
}