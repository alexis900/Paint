/**
 * Created by Pablo on 25 Jul 17.
 */

const {BrowserWindow, app} = require('electron');

const path = require('path');
const url = require('url');

const pug = require('pug');
const less = require('less');

require('electron-interceptor')([
    {
        extension: '.pug',
        mimeType: 'text/html',
        exec: (content, callback) => {
            callback(pug.render(content.toString(), {}));
        }
    },
    {
        extension: '.less',
        mimeType: 'text/css',
        exec: (content, callback) => {
            less.render(content.toString(), (error, compiled) => {
                if(error){
                    callback(error);
                    return;
                }
                callback(compiled.css);
            });
        }
    }
]);

let win;

const create_window = () => {

    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 275,
        minHeight: 400,
        frame: false
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'base.pug'),
        protocol: 'file',
        slashes: true
    }));

    win.setPosition((1920 *2 + 800) / 2, win.getPosition()[1]);

    win.webContents.openDevTools();

    win.on('closed', () => {
       win = null;
    });

};

app.on('ready', create_window);

app.on('window-all-closed', () => {

    if(process.platform !== 'darwin')
        app.quit();
});

app.on('activate', () => {

    if(win === null)
        create_window();
});
