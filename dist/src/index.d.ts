declare class Utils {
    constructor();
    test(source: number): number;
    sleep(ms: number): Promise<unknown>;
    instanceClone<T>(instance: T): T;
    instanceCreate<T>(type: {
        new (): T;
    }): T;
    differenceToJson<T extends Record<string, any>>(newValue: T, oldValue: T): Partial<T>;
    toJson<T extends Record<string, any>>(source: T): Partial<T>;
}
declare const utils: Utils;
type TDynamicInstance = {
    [key: string]: {
        Constructor: InstanceType<any>;
        tags?: string[];
    };
};
declare class DynamicInstance {
    constructor(instanceName: string, instances: TDynamicInstance, ...args: any[]);
}
export { utils, TDynamicInstance, DynamicInstance };
