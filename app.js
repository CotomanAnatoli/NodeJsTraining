import Router from './router.js'
import formidable from 'formidable'
import util from 'util'
import fsExtra from 'fs-extra'
import path from 'path'

const router = new Router(3001)

router.set('/get', (req, res) => {
    res.writeHead(200, {"content-type": "text/html"});
    res.end(
        `<form action="/update" enctype="multipart/form-data" method="post">
            <input type="text" name="name">
            <br>
            <input type="file" name="avatar">
            <br>
            <input type="submit" value="Submit">
        </form>`
    )
})

router.set('/update', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        const tempPath = files.avatar.filepath;
        const fileName = files.avatar.originalFilename;
        const newPath = `./images/${fields.name}${path.extname(fileName)}`;

        fsExtra.copy(tempPath, newPath, function(err) {
            if (err) throw err;
        });

        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    });
})
