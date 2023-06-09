import {customAlphabet} from "nanoid";
import {execSync} from "child_process";
import {readdir} from "fs/promises";
import fs from "fs";

const surid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 21)
type TDynamicInstance = {
    [key: string]: {
        Constructor: InstanceType<any>,
        tags: string[]
    }
}
class Utils {

    constructor() {}

    readJsonFileSync(path: string) {
        try {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        } catch (e) {
            return undefined
        }
    }
    cloneObject(obj: Object) {
        return JSON.parse(JSON.stringify(obj));
    }
    test(source: number) {
        return source * 2;
    }
    async dipCleanDir(path: string, masks: string[]) {
        for (const mask of masks) {
            execSync(`rm -rf ${path}/${mask}`, { stdio: 'inherit' });
        }
        const dirs =( await readdir(path, { withFileTypes: true })).filter(dirent => dirent.isDirectory());
        for (let dirent of dirs) {
            const _root = `${path}/${dirent.name}`;
            await this.dipCleanDir(_root, masks);
        }
    }
    get generateId(): string {
        return surid();
    }
    sleep(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
    wait(condition: () => boolean) {
        return new Promise<void>( async (resolve) => {
            while (!condition()) {
                await this.sleep(100);
            }
            resolve();
        });
    }
    //???
    instanceClone<T>(instance: T): T {
        // @ts-ignore
        const copy = new (instance.constructor as { new (): T })();
        // @ts-ignore
        Object.assign(copy, instance);
        return copy;
    }
    /**
     * @deprecated The method should not be used. Use createClass
     */
    instanceCreate<T>(type: { new(): T ;} ): T {
        return new type();
    }
    createClass<T>(constructor: new (...args: any[]) => T, ...args: any): T {
        return new constructor(...args);
    }
    differenceToJson<T extends Record<string, any>>(newValue: T, oldValue: T): Partial<T> {
        const n = this.toJson(newValue);
        const o = this.toJson(oldValue);
        const result: Partial<T> = {};

        for (const [key, value] of Object.entries(n)) {

        }

        return result;
    }
    toJson<T extends Record<string, any>>(source: T): Partial<T> {
        const target: Partial<T> = {};
        for (const [key, value] of Object.entries(source)) {
            if (value !== undefined) {
                if (value?.toJson) {
                    target[key as keyof T] = value.toJson();
                } else if ( Array.isArray(value)) {
                    const valueArray = []
                    for (const item of value) {
                        valueArray.push(item?.toJson ? item.toJson() : item);
                    }
                    // @ts-ignore
                    target[key as keyof T] = valueArray;
                } else {
                    target[key as keyof T] = value;
                }
            }
        }
        return target;
    }
    dynamicInstance<T>(instanceName: string, instances: TDynamicInstance, ...args: any[]): T {
        return new instances[instanceName].Constructor(...args);
    }
}

const utils = new Utils();

class DynamicInstance {
    constructor (instanceName: string, instances: TDynamicInstance, ...args: any[]) {
        return new instances[instanceName].Constructor(...args);
    }
}

export * from "./baseObject.js";
export * from "./extendedObject.js"
export * from "./extendedObject/user.js"
export * from "./extendedObject/role.js"

export {
    utils,
    TDynamicInstance,
    DynamicInstance,
}

