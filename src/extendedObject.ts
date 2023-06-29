import {JJEventEmitter} from "./index.js";

type TJJAEOptions<D, N extends string> = {
    keys?: string[];
    connector?: JJAbstractStoreConnector<N>;
};

type TJJTableProperty<N> = {
    name: N;
    constructor: (i: TJJExtendedObject<any, any, any>, c: any) => any;
}

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

type TAbstractRoles<CT extends Record<string, true>> = {
    root?: true;
    administrator?: true;
    author?: true;
    moderator?: true;
    user?: true;
} & CT;

type TAbstractRolesWeight<CN extends Record<string, number>> = {
    root: 1000000;
    administrator: 900000;
    author: 300000;
    moderator: 200000;
    user: 100000;
} & CN;

abstract class JJAbstractRoles<CT extends Record<string, true>, CN extends Record<string, number>>  {
    data?: TAbstractRoles<CT>
    rolePriority: TAbstractRolesWeight<CN>;

    constructor(s?: {data?: TAbstractRoles<CT>, rolePriority?: TAbstractRolesWeight<CN> }) {
        if (s?.data) this.data = s.data
        this.rolePriority = s?.rolePriority ?? {
            root: 1000000,
            administrator: 900000,
            author: 300000,
            moderator: 200000,
            user: 100000,
        } as TAbstractRolesWeight<any>;
    }

    abstract anonymous(): boolean;
}

abstract class JJAbstractUser<CT extends Record<string, true>, CN extends Record<string, number>> extends JJEventEmitter{
    roles: JJAbstractRoles<CT, CN>
    token: string;
    tokenTTL: number;

    protected constructor(s: Partial<JJAbstractUser<CT, CN>> ) {
        super();
    }
}

type TStoreConnectorACL = {
    id: string,
    type: 'thing' | 'query',
    initialStrategy: 'denyAll' |
}

abstract class JJAbstractStoreConnector<N extends string> extends JJEventEmitter{
    tables: Record<N, TJJTableProperty<N>>;
    token?: string;
    protected constructor(tables: Record<N, TJJTableProperty<N>>) {
        super();
        this.tables = tables;
    }

    abstract open(): Promise<void>;
    abstract close(): Promise<void>;

    abstract save<D, C, M, T extends JJAbstractExtendedObject<D, C, M, N> >(s: T, token: string): Promise<T>; //Promise<(Record<string, any>  & { id: string; })[]>;
    abstract delete<D, C, M, T extends JJAbstractExtendedObject<D, C, M, N> >(thing: string, token: string): Promise<(Record<string, any>  & { id: string; })[]>;
    abstract get<T>(thing: string, token: string): T;
    abstract query<T>(query: any, token: string): T;
}

abstract class JJAbstractExtendedObject<D, C, M, N extends string> extends JJEventEmitter{
    id: string;
    created?: number;
    updated?: number;
    version?: number;
    saved?: number;
    data?: D;
    chaos?: C;
    _meta: M | Partial<M>;
    _connector?: JJAbstractStoreConnector<N>;

    #options?: TJJAEOptions<D, N>

    protected constructor(s: TJJExtendedObject<D, C, M>, tableProperties: Record<N, TJJTableProperty<N>>, options?: TJJAEOptions<D, N>) {
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
                for (const [key, value] of Object.entries(this.data)) {
                    if (Array.isArray(value)) {
                        value.forEach((val, ind) => {
                            const instance = this.#stringOrObjectToInstance(val, tableProperties, this._connector);
                            const t = this.data![key as keyof D] as any[];
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

    #stringIsIdOfTable(str: string): N | false {
        const reg = /^[a-zA-Z_0-9]+:[a-zA-Z_0-9]{9,42}$/gm;
        const match = reg.exec(str);
        return match ? match[1] as N : false;
    }
    #stringOrObjectToInstance(value: any, tableProperties: Record<N, TJJTableProperty<N>>, connector: JJAbstractStoreConnector<N> | undefined): any {
        if (!(value && (typeof value === 'string' || value.id))) return false
        const maybeId = typeof value === 'string' ? value : (value as any).id;

        const name = this.#stringIsIdOfTable(maybeId);
        if (!name) return false;

        const entry = Object.entries(tableProperties).find(([key, value])=>key===name);
        if (entry) {
            const constructor =  entry[1] as (i: TJJExtendedObject<any, any, any>, c: any) => any;
            return constructor(value, connector);
        }
        return false;
    }

    get isRef(): boolean {
        return !this.data
    }

    abstract isDataObject(value: any): boolean;
    expandData<T extends JJAbstractExtendedObject<D, C, M, N> >(levels: number, level: number = 0, obj?: T | typeof this): void {
        obj ??= this;
        for (const [key, value] of Object.entries(obj.data ?? [])){
            if (key !== 'id' and )
        }
    };


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
    JJAbstractStoreConnector,
    TJJTableProperty.
};