declare class Utils {
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
export { utils };
