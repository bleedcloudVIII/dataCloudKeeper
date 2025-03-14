import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { download, save } from './cloudService';

const PROTO_PATH = __dirname + '/proto/cloud.proto';
const PORT = 5000;
const HOST = "0.0.0.0"

const proto_loader_options: protoLoader.Options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, proto_loader_options);

const CloudProto = grpc.loadPackageDefinition(packageDefinition).keeper;

function main() {
    const server = new grpc.Server();
    // @ts-ignore
    server.addService((CloudProto.FileService as any).service, {
        download,
        save
    });
    server.bindAsync(`${HOST}:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
        console.log(`Server running on http://${HOST}:${PORT}`);
    });
}

main();