const path = require('path');
const fs = require('fs');

const readDir = function (path) {
    return new Promise(function(resolve){
        fs.readdir(path, function (err, files) {
            if (err) throw err;
            resolve(files)
        })  
    })  
}

const readFile = function (path) {
    return new Promise(function (resolve) {
        fs.readFile(path, (err, data) => {
            if (err) throw err;
            resolve(data)
          });   
    })   
}

const mkDir = function (path) {
    return new Promise(function (resolve) {
        fs.mkdir(path, { recursive: true }, (err) => {
            if (err) throw err;
            resolve()
        });
    })
}

const copyDir = function (files, srcPath, destFilesPath) {
    return new Promise(async function(resolve){
        for(const file of files) {
            const filePath = path.resolve(srcPath, '.', file);
            const stat = fs.statSync(filePath)
            if(stat.isFile()) {
                await copyFile(filePath, `${destFilesPath}/${file}`)
            } 
        }
        resolve()
    })  
}

const copyFile = function (src, dest){
    return new Promise(function(resolve){
        fs.copyFile(src, dest, fs.constants.COPYFILE_EXCL, function (err) {
            if (err) throw err;
            resolve()
        })  
    })  
}

const writeFile = function (file, data){
    return new Promise(function(resolve){
        fs.writeFile(file, data, (err) => {
            if (err) throw err;
            resolve()
        });
    })   
}

module.exports = {
    copyFile,
    copyDir,
    readDir,
    readFile,
    mkDir,
    writeFile
}