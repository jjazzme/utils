import { customAlphabet } from "nanoid";
import { execSync } from "child_process";
import { readdir } from "fs/promises";
import fs from "fs";
const surid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 21);
class Utils {
    constructor() { }
    readJsonFileSync(path) {
        try {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        }
        catch (e) {
            return undefined;
        }
    }
    cloneObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    test(source) {
        return source * 2;
    }
    async dipCleanDir(path, masks) {
        for (const mask of masks) {
            execSync(`rm -rf ${path}/${mask}`, { stdio: 'inherit' });
        }
        const dirs = (await readdir(path, { withFileTypes: true })).filter(dirent => dirent.isDirectory());
        for (let dirent of dirs) {
            const _root = `${path}/${dirent.name}`;
            await this.dipCleanDir(_root, masks);
        }
    }
    get generateId() {
        return surid();
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    wait(condition) {
        return new Promise(async (resolve) => {
            while (!condition()) {
                await this.sleep(100);
            }
            resolve();
        });
    }
    //???
    instanceClone(instance) {
        // @ts-ignore
        const copy = new instance.constructor();
        // @ts-ignore
        Object.assign(copy, instance);
        return copy;
    }
    /**
     * @deprecated The method should not be used. Use createClass
     */
    instanceCreate(type) {
        return new type();
    }
    createClass(constructor, ...args) {
        return new constructor(...args);
    }
    differenceToJson(newValue, oldValue) {
        const n = this.toJson(newValue);
        const o = this.toJson(oldValue);
        const result = {};
        for (const [key, value] of Object.entries(n)) {
        }
        return result;
    }
    toJson(source) {
        const target = {};
        for (const [key, value] of Object.entries(source)) {
            if (value !== undefined) {
                if (value?.toJson) {
                    target[key] = value.toJson();
                }
                else if (Array.isArray(value)) {
                    const valueArray = [];
                    for (const item of value) {
                        valueArray.push(item?.toJson ? item.toJson() : item);
                    }
                    // @ts-ignore
                    target[key] = valueArray;
                }
                else {
                    target[key] = value;
                }
            }
        }
        return target;
    }
    dynamicInstance(instanceName, instances, ...args) {
        return new instances[instanceName].Constructor(...args);
    }
}
const utils = new Utils();
class DynamicInstance {
    constructor(instanceName, instances, ...args) {
        return new instances[instanceName].Constructor(...args);
    }
}
export * from "./baseObject.js";
export * from "./extendedObject.js";
export * from "./extendedObjects/user.js";
export * from "./extendedObjects/role.js";
export { utils, DynamicInstance, };
//# sourceMappingURL=index.js.map