export class Utils {
    sleep(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    instanceClone<T>(instance: T): T {
        // @ts-ignore
        const copy = new (instance.constructor as { new (): T })();
        // @ts-ignore
        Object.assign(copy, instance);
        return copy;
    }

    instanceCreate<T>(type: { new(): T ;} ): T {
        return new type();
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
}

export const utils = new Utils();
