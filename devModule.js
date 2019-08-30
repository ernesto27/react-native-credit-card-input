const fs = require('fs');
const { exec } = require('child_process');
const chokidar = require('chokidar');
require('dotenv').config();

const toFolder = process.env.REACT_NATIVE_PROJECT_FOLDER;
const nodeModules = '/node_modules';
const libName = '/react-native-credit-card-input';
const fullPath = toFolder + nodeModules + libName; 


if (!fs.existsSync(fullPath)) {
    var command = exec('mkdir ' + fullPath, function(err){
        if(err) console.log(err);
        console.log('Carpeta ' + fullPath + ' generada');
        copyFiles();
    });
} else {
    copyFiles();
}



function copyFiles() {
    exec('cp -a . ' + fullPath, function(err){
        if(err) console.log(err);
        console.log('Se copio el contenido de la libreria en ' + fullPath);
        startWatch();
    });
}


function startWatch() {
    chokidar.watch('.', {ignored: /node_modules|\.git/ }).on('all', (event, path) => {
        console.log(event, path);

        if(event === 'add' || event === 'change') {
            exec('cp ' + path + ' ' + fullPath + '/' + path, function(err){
                if(err) console.log(err);
                console.log('Se copio el contenido de ' + path + ' en ' + fullPath);
            });
        }

        if(event === 'unlink') {
            exec('rm ' + fullPath + '/' + path, function(err){
                if(err) console.log(err);
                console.log('Se elimino el archivo ' + path + ' en ' + fullPath);
            });
        }
    });
}
