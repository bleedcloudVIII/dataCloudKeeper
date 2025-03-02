import * as fs from 'fs';

const DIR_PATH = 'C:/dataCloud/files/';

function get_file_path(location: string, file_name: string): string {
    const location_dir_path = `${DIR_PATH}${location}`;

    if (location && file_name)
    {
        if (!fs.existsSync(location_dir_path)){
            fs.mkdirSync(location_dir_path, {recursive: true});
        }
    
        const file_path = `${DIR_PATH}${location}/${file_name}`;
    
        return file_path;
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

    if (fs.existsSync(file_path)){
        fs.writeFileSync(file_path, '');
    }

    const write_stream = fs.createWriteStream(file_path);

    call.on('data', (chunk: {bytes: any}) => {
        write_stream.write(chunk.bytes)
    });

    call.on('end', () => {
        write_stream.end();
        callback(null, {message: "OK", status: 0});
    });

    call.on('error', (err) => {
        callback(null, {message: err.message, status: 1});
    });
}