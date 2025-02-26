import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { download } from './cloudService';

const PROTO_PATH = __dirname + '/proto/cloud.proto';
const PORT = 5000;
const HOST = "0.0.0.0"

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const CloudProto = grpc.loadPackageDefinition(packageDefinition).cloud;

function main() {
    const server = new grpc.Server();
    server.addService((CloudProto.FileService as any).service, {
        download,
    });
    server.bindAsync(`${HOST}:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
        console.log(`Server running on http://${HOST}:${PORT}`);
    });
}

main();