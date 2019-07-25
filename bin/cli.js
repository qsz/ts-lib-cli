#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const path = require('path');
const { readFileSync, writeFileSync } = require("fs");
const { copyFile, copyDir, readDir, mkDir, writeFile, readFile } = require('./util.js');
const { libDependencies, programPath, currentPath } = require('./config');
const pkg = JSON.parse(
  readFileSync(path.resolve(__dirname, "../", "package.json"))
);
program.version(pkg.version);

const libChoices =  [
    "parcel",
    "jest",
    "ncu"
];
const promptList = [
    {
        type: 'checkbox',
        name: 'lib',
        message: '选择需要安装的辅助库',
        choices: libChoices
    },
    {
        type: 'input',
        name: 'name',
        message: '项目名称',
        default: 'ts-lib-cli'
    }
]
 
program
    .option('--f', '快速创建项目')
    .description('初始化项目')
    .action(function (option) {
        if(option.f){
            const answers = {
                name: 'ts-lib-cli',
                lib: libChoices
            }
            prompt(answers)
            return
        } 
        inquirer.prompt(promptList).then(function(answers) {
            prompt(answers)
        });
    });

program.on('--help', function(){
    console.log('')
    console.log('Examples:');
    console.log('  $ tlc');
    console.log('  $ tlc --f');
});

program.parse(process.argv)  

async function prompt(answers) {
    try {
        const programName = answers.name
        const libs = answers.lib.concat(['basis'])
        const currentProgramPath = `${currentPath}${programName}`       // cli项目地址，相对路径
        const programPackagePath =  path.resolve(programPath, './package.json')  // 模版package 地址
        const currentPackagePath = `${currentProgramPath}/package.json` // clipackage 地址，相对路径
        let programPkg = JSON.parse( await readFile(programPackagePath))
        await mkDir(currentProgramPath)
        const files = await readDir(programPath);
        await copyDir(files, programPath, currentProgramPath);

        // 按需配置相应库
        for(const lib of libs) {
            const { dirs, files, pkgJson = {}, pkgOther = {} } = libDependencies[`${lib}_dependencies`];
            if(dirs) { // 需要的文件夹
                for(const dir of dirs){
                    const dirPath = path.resolve(programPath, '.', dir);   // 模版dir路径
                    const dirFiles = await readDir(dirPath);
                    const dirname = path.basename(dirPath);
                    const currentDependenciesPath = `${currentProgramPath}/${dirname}`  // cli dir路径
                    await mkDir(currentDependenciesPath)
                    await copyDir(dirFiles, dirPath, currentDependenciesPath)
                }
            } 
            if(files) { // 需要的文件
                for(const file of files) {
                    await copyFile(path.resolve(programPath, '.', file), `${currentProgramPath}/${file}`)
                }
            }
            if(pkgJson || pkgOther) {
                programPkg = {...programPkg, ...pkgOther}
                Object.keys(pkgJson).forEach(function(key){
                    const value = pkgJson[key]
                    programPkg[key] = {...programPkg[key], ...value}
                })
            }
        }
        writeFileSync(currentPackagePath, JSON.stringify(programPkg, null, 4))
    } catch(err) {
        console.log(err)
    }
}



