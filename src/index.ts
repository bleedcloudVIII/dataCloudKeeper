import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { download, save } from './cloudService';

const PROTO_PATH = __dirname + '/proto/cloud.proto';
const PORT = 5000;
const HOST = "0.0.0.0"

const options: protoLoader.Options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    
}

const serverOptions: grpc.ServerOptions = {
    "grpc.max_receive_message_length": 1024 * 1024 * 100,
    "grpc.max_send_message_length": 1024 * 1024 * 100,
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const CloudProto = grpc.loadPackageDefinition(packageDefinition).cloud;

function main() {
    const server = new grpc.Server(serverOptions);
    server.addService((CloudProto.FileService as any).service, {
        download,
        save
    });
    server.bindAsync(`${HOST}:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
        console.log(`Server running on http://${HOST}:${PORT}`);
    });
}

main();