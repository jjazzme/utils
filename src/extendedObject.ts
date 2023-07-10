import {JJDBRole, JJEventEmitter, TJJAbstractUser, TJJDBRole} from "./index.js";
import {JJDBQuery} from "./extendedObject/query.js";
import {TJJAclEntry, TJJDeniedStrategy, TJJStrategyActions} from "./extendedObject/entry.js";
import {JJAbstractStoreConnector, JJAcl} from "./extendedObject/storeConnector.js";

type TJJAEOptions<D, TN extends string, DB extends JJAbstractStoreConnector<TN>> = {
    keys?: (keyof D)[];
    unique?: (keyof D)[];
    connector?: DB;
    transformations?: {
        save?: Record<keyof D, (value: any)=>any>;
        read?: Record<keyof D, (value: any)=>any>
    }
};

type TJJTableProperty<TN extends string> = {
    name: TN;
    constructor: (i: TJJExtendedObject<any, any, any>, c: any) => any;
}

type TJJExtendedObject<D, C, M> = string | {
    id: string;
    created?: number;
    updated?: number;
    version?: number;
    saved?: number;
    data?: D;
    unique?: (keyof D)[]
    chaos?: C; //for save
    _meta?: M; // not for save
};

abstract class JJAbstractExtendedObject<D, C, M, TN extends string, DB extends JJAbstractStoreConnector<TN>> extends JJEventEmitter{
    id: string;
    created?: number;
    updated?: number;
    version?: number;
    saved?: number;
    data?: D;
    chaos?: C;
    _meta: M | Partial<M>;
    _connector?: DB;
    _lastSaved?: any;

    #options?: TJJAEOptions<D, TN, DB>

    protected constructor(s: string | TJJExtendedObject<D, C, M>, tableProperties: Record<TN, TJJTableProperty<TN>>, options?: TJJAEOptions<D, TN, DB>) {
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
                    if (!(options.keys as string[]).includes(key)) delete s.data[key as keyof D];
                }
            }
            this.data = s.data;
            if (this.data) {
                for (const [key, value] of Object.entries(this.data)) {
                    if (Array.isArray(value)) {
                        value.forEach((val, ind) => {
                            const instance = this.#stringOrObjectToInstance(val, tableProperties, this._connector);
                            if (instance) (this.data![key as keyof D] as any[])[ind] = instance;
                        })
                    } else {
                        const instance = this.#stringOrObjectToInstance(value, tableProperties, this._connector);
                        if (instance) this.data[key as keyof D] = instance;
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

    #stringIsIdOfTable(str: string): TN | false {
        const reg = /^[a-zA-Z_0-9]+:[a-zA-Z_0-9]{9,42}$/gm;
        const match = reg.exec(str);
        return match ? match[1] as TN : false;
    }
    #stringOrObjectToInstance(value: any, tableProperties: Record<TN, TJJTableProperty<TN>>, connector: JJAbstractStoreConnector<TN> | undefined): any {
        if (!(value && (typeof value === 'string' || value.id))) return false
        const maybeId = typeof value === 'string' ? value : (value as any).id;

        const name = this.#stringIsIdOfTable(maybeId);
        if (!name) return false;

        const entry = Object.entries(tableProperties).find(([key])=>key===name);
        if (entry) {
            const constructor =  entry[1] as (i: TJJExtendedObject<any, any, any>, c: any) => any;
            return constructor(value, connector);
        }
        return false;
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

    async create<T extends JJAbstractExtendedObject<any, any, any, string, JJAbstractStoreConnector<string>>>(s: T, token: string): Promise<T> {
        if (!(await this._connector.acl.allow('c', token, s.id))) throw Error('401');
        return this.create_(s);
    };
    async update<T extends JJAbstractExtendedObject<any, any, any, string, JJAbstractStoreConnector<string>>>(s: T, token: string): Promise<T> {
        if (!(await this.acl.allow('u', token, s.id))) throw Error('401');
        return this.update_(s);
    }
}

export {
    TJJExtendedObject,
    JJAbstractExtendedObject,
    TJJAEOptions,
    TJJTableProperty,
};