class Utils {
    constructor() { }
    test(source) {
        return source * 2;
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
    instanceClone(instance) {
        // @ts-ignore
        const copy = new instance.constructor();
        // @ts-ignore
        Object.assign(copy, instance);
        return copy;
    }
    instanceCreate(type) {
        return new type();
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
}
const utils = new Utils();
class DynamicInstance {
    constructor(instanceName, instances, ...args) {
        return new instances[instanceName].Constructor(...args);
    }
}
export { utils, DynamicInstance };
