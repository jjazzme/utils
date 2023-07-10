type TDynamicInstance = {
    [key: string]: {
        Constructor: InstanceType<any>;
        tags: string[];
    };
};
declare class Utils {
    constructor();
    readJsonFileSync(path: string): any;
    cloneObject(obj: Object): any;
    test(source: number): number;
    dipCleanDir(path: string, masks: string[]): Promise<void>;
    get generateId(): string;
    sleep(ms: number): Promise<unknown>;
    wait(condition: () => boolean): Promise<void>;
    instanceClone<T>(instance: T): T;
    /**
     * @deprecated The method should not be used. Use createClass
     */
    instanceCreate<T>(type: {
        new (): T;
    }): T;
    createClass<T>(constructor: new (...args: any[]) => T, ...args: any): T;
    differenceToJson<T extends Record<string, any>>(newValue: T, oldValue: T): Partial<T>;
    toJson<T extends Record<string, any>>(source: T): Partial<T>;
    dynamicInstance<T>(instanceName: string, instances: TDynamicInstance, ...args: any[]): T;
}
declare const utils: Utils;
declare class DynamicInstance {
    constructor(instanceName: string, instances: TDynamicInstance, ...args: any[]);
}
export * from "./baseObject.js";
export * from "./extendedObject.js";
export * from "./extendedObject/user.js";
export * from "./extendedObject/role.js";
export { utils, TDynamicInstance, DynamicInstance, };
