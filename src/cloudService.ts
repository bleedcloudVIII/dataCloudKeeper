import * as grpc from '@grpc/grpc-js';
import type { DownloadRequest } from './proto/interface/downloadRequest';
import type { DownloadResponse } from './proto/interface/downloadResponse';
import type { SaveRequest } from './proto/interface/saveRequest';
import type { SaveResponse } from './proto/interface/saveResponse';
import { readFile, writeFile } from "fs/promises";
import * as path from 'path';
import * as fs from 'fs';

// TODO обработку ошибок, чтобы не крашилось

function get_file_path(metadata: grpc.Metadata) {
    const file_name = metadata.get('file_name');
    const location = metadata.get('location');

    const file_path = path.resolve(__dirname, `./../files/${location}/${file_name}`);
    console.log(file_path);
    fs.mkdirSync(file_path);

    return file_path;
}

export async function download(call: grpc.ServerUnaryCall<DownloadRequest, DownloadResponse>, callback: grpc.sendUnaryData<DownloadResponse>) {
    const file_name = call.request.file_name;
    const location = call.request.location;
    const file_path = path.resolve(__dirname, `./../files/${file_name}`);
    

    const content = await readFile(file_path)
    callback(null, { bytes: `${content}` });
}

// TODO затирать данные в файле в начале записи??
export function save(call, callback) {
    const file_path = get_file_path(call.metadata)

    const writer = Bun.file(file_path).writer();

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