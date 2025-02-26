import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = __dirname + '/proto/cloud.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const CloudProto = grpc.loadPackageDefinition(packageDefinition).cloud;

function download(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    const l = call.request.location;
    const fn = call.request.file_name;
    console.log(l);
    console.log(fn);
    callback(null, { bytes: `Hello, downloading  ${l}/${fn}\n..........` });
}

function main() {
    const server = new grpc.Server();
    server.addService((CloudProto.FileService as any).service, {
        download,
    });
    server.bindAsync('0.0.0.0:5000', grpc.ServerCredentials.createInsecure(), () => {
        // server.start();
        console.log('Server running on http://0.0.0.0:50051');
    });
}

main();