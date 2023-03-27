import { execSync } from 'child_process';
import { readdir } from 'fs/promises'

async function delFiles(path) {
    execSync(`rm -rf ${path}/*.js`, { stdio: 'inherit' });
    execSync(`rm -rf ${path}/*.d.ts`, { stdio: 'inherit' });

    const dirents =( await readdir(path, { withFileTypes: true }));
    for (let dirent of dirents.filter(dirent => dirent.isDirectory())) {
        const _root = `${path}/${dirent.name}`;
        await delFiles(_root);
    }
    return true;
}

const root = process.argv[2];
if (!root) {
    console.log('NO PATH IN ARGS. Use like "node ./console/clean ./dist/src"')
} else {
    execSync(`mkdir -p ${root}`, { stdio: 'inherit' });
    delFiles(root)
        .then(res => {console.log('CLEAN OK')})
        .catch(err => {console.log('ERROR: ', err)})
        .finally(() => process.exit(0));
}



