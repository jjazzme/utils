import {JJEventEmitter} from "./index.js";

type TJJAEOptions<D> = {
    keys?: string[];
    arrayKeys?: { key: keyof D, constructor: (i: any)=>any}[];
    singleKeys?: { key: keyof D, constructor: (i: any)=>any}[];
    connector?: JJAbstractStoreConnector;
};

type TJJExtendedObject<D, C, M> = string | {
    id: string;
    created?: number;
    updated?: number;
    version?: number;
    saved?: number;
    data?: D;
    chaos?: C;
    _meta?: M;
};

abstract class JJAbstractStoreConnector extends JJEventEmitter{
    abstract open(): Promise<void>;
    abstract close(): Promise<void>;
    abstract expand<D, C, M>(s: string): Promise<JJAbstractExtendedObject<D, C, M>>;
    abstract save<D, C, M>(s: JJAbstractExtendedObject<D, C, M>): Promise<(Record<string, any>  & { id: string; })[]>;
    abstract delete(thing: string): Promise<(Record<string, any>  & { id: string; })[]>
}

abstract class JJAbstractExtendedObject<D, C, M> extends JJEventEmitter{
    id: string;
    created?: number;
    updated?: number;
    version?: number;
    saved?: number;
    data?: D;
    chaos?: C;
    _meta: M | Partial<M>;
    _connector?: JJAbstractStoreConnector;

    #options?: TJJAEOptions<D>

    protected constructor(s: TJJExtendedObject<D, C, M>, options?: TJJAEOptions<D>) {
        super();
        if (options) this.#options = options;
        if (options?.connector) this._connector = options.connector;

        if (typeof s === 'string') {
            this.id = s;
            this._meta = {};
        } else {
            this.id = s.id;
            this.created = s.created ?? Date.now();
            if (s.updated) this.updated = s.updated;
            if (s.version) this.version = s.version;
            if (s.saved) this.saved = s.saved;
            if (options?.keys && s.data) {
                for (const [key] of Object.entries(s.data)){
                    if (!options.keys.includes(key)) delete s.data[key as keyof D];
                }
            }
            this.data = s.data;
            if (this.data) {
                if (options?.arrayKeys) {
                    for (const {key, constructor} of options.arrayKeys) {
                        if (this.data[key]) {
                            const target = [];
                            for (const item of this.data[key] as any[]) {
                                target.push(constructor(item));
                            }
                            (this.data[key] as any[]) = target;
                        }
                    }
                }
                if (options?.singleKeys) {
                    for (const {key, constructor} of options.singleKeys) {
                        if (this.data[key]) this.data[key] = constructor(this.data[key]);
                    }
                }
            }
            if (s.chaos) this.chaos = s.chaos;
            if (s._meta) {
                this._meta = s._meta;
            } else {
                this._meta = {};
            }
        }
    }

    get isRef(): boolean {
        return !this.data
    }

    toJsonExt(source?: Record<string, any> | Array<any>): Record<string, any> | string | Array<any>{
        source ??= this;
        if (Array.isArray(source)) {
            const target = [];
            for (let value of source) {
                if (typeof value === 'object' && value != undefined) {
                    value = this.toJsonExt(value);
                }
                target.push(value);
            }
            return target
        } else {
            if (source.toJsonExt && source.isRef === true) return source.id;

            const target: Record<string, any> = {};
            for (const [key, value] of Object.entries(source)) {
                if (value != undefined && key.charAt(0) !== '_') {
                    if (typeof value === 'object') {
                        target[key] = this.toJsonExt(value);
                    } else {
                        target[key] = value;
                    }
                }
            }
            return target;
        }
    }
};

export {
    TJJExtendedObject,
    JJAbstractExtendedObject,
    TJJAEOptions,
    JJAbstractStoreConnector
};