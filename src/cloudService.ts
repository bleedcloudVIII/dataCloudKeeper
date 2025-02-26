import * as grpc from '@grpc/grpc-js';
import type { DownloadRequest } from './proto/interface/downloadRequest';
import type { DownloadResponse } from './proto/interface/downloadResponse';
import type { SaveRequest } from './proto/interface/saveRequest';
import type { SaveResponse } from './proto/interface/saveResponse';

export function download(call: grpc.ServerUnaryCall<DownloadRequest, DownloadResponse>, callback: grpc.sendUnaryData<DownloadResponse>) {
    const l = call.request.location;
    const fn = call.request.file_name;
    
    callback(null, { bytes: `Hello, downloading  ${l}/${fn}\n..........`});
}

export function save(call: grpc.ServerUnaryCall<SaveRequest, SaveResponse>, callback: grpc.sendUnaryData<SaveResponse>) {

}