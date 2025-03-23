import * as fs from 'fs';

const DIR_PATH = 'C:/dataCloud/files/';

function get_file_path(location: string, file_name: string): string {
    const location_dir_path = `${DIR_PATH}${location}`;

    if (location && file_name)
    {
        if (!fs.existsSync(location_dir_path)){
            fs.mkdirSync(location_dir_path, {recursive: true});
        }
    
        return `${DIR_PATH}${location}/${file_name}`;
    }
    return '';
}

// @ts-ignore
export function download(call, callback) {
    const file_path = get_file_path(call.request.location, call.request.file_name);

    if (file_path == '')
    {
        call.write({bytes: 0, message: 'error'});
        call.end();
        return;
    }

    const file = Bun.file(file_path);
    const file_stream = file.stream();
    const reader = file_stream.getReader();

    reader.read().then(function processChunk({ done, value }) {
        if (done) {
            call.end();
            return;
        }
        call.write({ bytes: value });
        reader.read().then(processChunk);
    });
}

// @ts-ignore
export function save(call, callback) {
    const file_path = get_file_path(call.metadata.get('location')[0], call.metadata.get('file_name')[0]);

    if (file_path == '') return callback(null, {message: 'empty metadata', status: 2});

    const writer = Bun.file(file_path).writer();
    
    call.on('data', (chunk: { bytes: any }) => {
        writer.write(chunk.bytes);
    });

    call.on('end', () => {
        callback(null, { message: "OK", status: 0 });
    });

    call.on('error', (err) => {
        writer.end();
        callback(null, { message: err.message, status: 1 });
    });
}