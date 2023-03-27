import {execSync} from "child_process";

execSync(`rm -rf ./node_modules`, { stdio: 'inherit' });
execSync(`rm -rf ./package-lock.json`, { stdio: 'inherit' });
execSync(`npm install`, { stdio: 'inherit' });