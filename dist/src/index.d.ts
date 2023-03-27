import { AbstractBaseObject } from "./abstractBase.js";
type TDynamicInstance = {
    [key: string]: {
        Constructor: InstanceType<any>;
        tags: string[];
    };
};
declare class Utils {
    constructor();
    test(source: number): number;
    dipCleanDir(path: string, masks: string[]): Promise<void>;
    get generateId(): string;
    sleep(ms: number): Promise<unknown>;
    wait(condition: () => boolean): Promise<void>;
    instanceClone<T>(instance: T): T;
    instanceCreate<T>(type: {
        new (): T;
    }): T;
    differenceToJson<T extends Record<string, any>>(newValue: T, oldValue: T): Partial<T>;
    toJson<T extends Record<string, any>>(source: T): Partial<T>;
    dynamicInstance<T>(instanceName: string, instances: TDynamicInstance, ...args: any[]): T;
}
declare const utils: Utils;
declare class DynamicInstance {
    constructor(instanceName: string, instances: TDynamicInstance, ...args: any[]);
}
export { utils, TDynamicInstance, DynamicInstance, AbstractBaseObject };
