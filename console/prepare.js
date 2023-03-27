import { execSync } from 'child_process';

const root = process.argv[2];
if (root) {
    execSync(`node ./console/clean ${root}`, { stdio: 'inherit' });
    execSync('tsc', { stdio: 'inherit' });
    execSync(`mkdir -p ${root}/_`, { stdio: 'inherit' });
    execSync(`git add ${root}`, { stdio: 'inherit' });
    console.log('PREPARE OK');
} else {
    console.log('NO PATH IN ARGS. Use like "node ./console/clean ./dist/src"')
}


