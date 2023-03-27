#!/usr/bin/env node

import {execSync} from "child_process";

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

async function help() {
    console.log('HELP: ');
    for (let [k, v] of Object.entries(commandDict)) {
        console.log(`${k}: ${v.help} [${v.count} args]`);
    }
}

async function repack() {
    execSync(`node ./console/repack`, { stdio: 'inherit' });
}
async function clean(path) {
    execSync(`node ./console/clean ${path}`, { stdio: 'inherit' });
}
async function prepare(path) {
    execSync(`node ./console/prepare ${path}`, { stdio: 'inherit' });
}