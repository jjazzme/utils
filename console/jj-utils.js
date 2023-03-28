#!/usr/bin/env node
import {execSync} from "child_process";
import {readdir} from "fs/promises";
import fs from "fs";

const _args = process.argv;
_args.splice(0, 2);

const commandDict = {
    '-repack': {
        execute: repack,
        count: 0,
        help: 'Removes ./node_modules, ./package-lock.json and run "npm install"'
    },
    '-clean': {
        execute: clean,
        count: 1,
        help: 'Removes all *.js & *.d.ts recursively from args1 path'
    },
    '-prepare': {
        execute: prepare,
        count: 1,
        help: '-clean + tsc'
    },
    '-package': {
        execute: packagejson,
        count: 1,
        help: `Use "/package-dif.json" file && "dev" | "prod" arg for generate package.json with local/outer dependencies: 
    {
      "prod": {
        "dependencies": {
          "@jjazzme/utils": "jjazzme/utils#last"
        }
      },
      "dev": {
        "dependencies": {
          "@jjazzme/utils": "file:../utils"
        }
      }
    }
`
    },
    '-help': {
        execute: help,
        count: 0,
        help: 'this message'
    }
}

if (_args.length === 0) _args.push('-help')
processor(_args)
    .then(res => console.log('END: ', res))
    .catch(err => console.log('ERR: ', err))
    .finally(() => process.exit(0));

async function processor(args) {
    let marker = 0;
    const execs = []
    while (marker < args.length) {
        const com = args[marker];
        if (com.charAt(0) !== '-') throw Error(`ERROR: CAN'T INTERPRET COMMAND ${com}. COMMANDS START WITH "-"`);
        const command = commandDict[com];
        if (!command) throw Error(`ERROR: COMMAND "${com}" NOT FOUND!`);
        const commandArgs = [];
        for (let i = 0; i < command.count; i++) {
            if (++marker >= args.length || args[marker].charAt(0) === '-') throw Error(`ERROR: INSUFFICIENT NUMBER OF COMMAND ARGUMENTS ${com}`);
            commandArgs.push(args[marker]);
        }
        const exec = Object.assign({}, command, {args: commandArgs});
        execs.push(exec);
        marker++
    }

    for (const exec of execs) {
        await exec.execute(...exec.args);
    }

    return 'success';
}

async function packagejson(type) {
    const sourceDif = JSON.parse(fs.readFileSync(`${process.cwd()}/package-dif.json`, 'utf8'))[type];
    const source = JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`, 'utf8'));
    if (!["dev", "prod"].includes(type)) throw Error(`ERROR: ${commandDict['-package'].help}`);
    const target = deepMerge(source, sourceDif);
    fs.writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(target, null, 4))

    console.log(`CREATE package.json FROM ${type} SOURCE`);
}

async function help() {
    console.log('HELP: ');
    for (let [k, v] of Object.entries(commandDict)) {
        console.log(`${k}: ${v.help} [${v.count} args]`);
    }
}

async function repack() {
    execSync(`rm -rf ./node_modules`, { stdio: 'inherit' });
    execSync(`rm -rf ./package-lock.json`, { stdio: 'inherit' });
    execSync(`npm install`, { stdio: 'inherit' });
    console.log('REPACK OK');
}
async function clean(_path) {
    const treeRider = async (path) => {
        execSync(`rm -rf ${path}/*.js`, { stdio: 'inherit' });
        execSync(`rm -rf ${path}/*.d.ts`, { stdio: 'inherit' });

        const dirents =( await readdir(path, { withFileTypes: true }));
        for (let dirent of dirents.filter(dirent => dirent.isDirectory())) {
            const _root = `${path}/${dirent.name}`;
            await treeRider(_root);
        }
    }
    await treeRider(_path);
    console.log('CLEAN OK');
}
async function prepare(path) {
    await clean(path);
    execSync('tsc', { stdio: 'inherit' });
    execSync(`git add ${path}`, { stdio: 'inherit' });
    console.log('PREPARE OK');
}


function deepMerge(targetObject = {}, sourceObject = {}) {
    const copyTargetObject = JSON.parse(JSON.stringify(targetObject));
    const copySourceObject = JSON.parse(JSON.stringify(sourceObject));
    Object.keys(copySourceObject).forEach((key) => {
        if (typeof copySourceObject[key] === "object" && !Array.isArray(copySourceObject[key])) {
            copyTargetObject[key] = deepMerge(
                copyTargetObject[key],
                copySourceObject[key]
            );
        } else {
            copyTargetObject[key] = copySourceObject[key];
        }
    });

    return copyTargetObject;
}