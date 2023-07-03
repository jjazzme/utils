import {JJDBRole, JJEventEmitter, TJJAbstractUser, TJJDBRole} from "./index.js";
import {JJDBQuery} from "./extendedObjects/query.js";
import {TJJAclEntry, TJJDeniedStrategy, TJJStrategyActions} from "./extendedObjects/entry.js";

type TJJAEOptions<D, TN extends string, DB extends JJAbstractStoreConnector<TN>> = {
    keys?: (keyof D)[];
    connector?: DB;
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
}

abstract class JJAbstractStoreConnector<TN extends string> extends JJEventEmitter{
    tables: Record<TN, TJJTableProperty<TN>>;
    queries?: JJDBQuery
    rootToken?: string;
    roles?: JJDBRole[];
    acl: JJAcl;

    protected constructor(
        tables: Record<TN, TJJTableProperty<TN>>,
        options?: {
            rootToken?: string,
            queries?:  JJDBQuery,
            roles?: JJDBRole[],
            acl?: JJAcl,
        }) {
        super();
        this.tables = tables;
        this.rootToken = options?.rootToken;
        this.roles = options?.roles;
        this.queries = options?.queries;
        this.acl = options?.acl ?? new JJAcl();
    }

    abstract open(): Promise<void>;
    abstract close(): Promise<void>;

    abstract save<D, C, M, T extends JJAbstractExtendedObject<D, C, M, TN, JJAbstractStoreConnector<TN>>>(s: T, token: string): Promise<any>; //Promise<(Record<string, any>  & { id: string; })[]>;
    abstract delete<D, C, M, T extends JJAbstractExtendedObject<D, C, M, TN, JJAbstractStoreConnector<TN>> >(thing: string, token: string): Promise<any>; //Promise<(Record<string, any>  & { id: string; })[]>;
    abstract getOne<D, C, M, T extends JJAbstractExtendedObject<D, C, M, TN, JJAbstractStoreConnector<TN>>>(thing: string, token: string): Promise<T>;
    abstract getAll<D, C, M, T extends JJAbstractExtendedObject<D, C, M, TN, JJAbstractStoreConnector<TN>>>(thing: string, token: string): Promise<T[]>;
    abstract query(queryNameOrId: string, token: string): Promise<any>;
}

class JJAcl{
    defaultDeniedStrategy: TJJDeniedStrategy;
    entriesCore: TJJAclEntry[];
    anonymousRoleId: string;
    rootRoleId: string;
    rootToken?: string;
    getSubjectsIdByToken: (token: string) => Promise<[string]>;// обратить внимание на порядок

    constructor(s?: {
        defaultDeniedStrategy?: TJJDeniedStrategy,
        entriesCore?: TJJAclEntry[];
        usersCore?: TJJAbstractUser[];
        anonymousRoleId?: string;
        rootRoleId?: string;
        getSubjectByToken: (token: string) => Promise<[string]>;
        rootToken?: string;
    }) {
        this.rootToken = s?.rootToken;
        this.defaultDeniedStrategy = s?.defaultDeniedStrategy ?? {};
        this.entriesCore = s?.entriesCore ?? [];
        this.anonymousRoleId = s?.anonymousRoleId ?? 'dbRoles:anonymous';
        this.rootRoleId = s?.rootRoleId ?? 'dbRoles:root';
        const defGetSubjectsIdByToken: (token: string) => Promise<[string]> = async (token: string) => {
            return this.rootToken
                ? token === this.rootToken
                    ? [this.rootRoleId]
                    : [this.anonymousRoleId]
                : [this.anonymousRoleId];
        }
        this.getSubjectsIdByToken = s?.getSubjectByToken ?? defGetSubjectsIdByToken;
    }

    async allow(action: TJJStrategyActions, token: string, objectId: string): Promise<boolean> {
        if (this.rootToken && token === this.rootToken) return true;
        const subjectsId = await this.getSubjectsIdByToken(token);
        let result = !this.defaultDeniedStrategy[action];

        for (const subjectId of subjectsId) {
            const entry = this.entriesCore.find(ent => ent.subjectId === subjectId && ent.objectId === objectId) ?? this.entriesCore.find(ent => ent.subjectId == undefined && ent.objectId === objectId);
            if (entry) {
                if (entry.denied) {
                    if (!entry.denied[action] !== result) {
                        result = !result;
                        break;
                    }
                } else {
                    if (!result) {
                        result = !result;
                        break;
                    }
                }
            }
        }
        return result;
    }
}



export {
    TJJExtendedObject,
    JJAbstractExtendedObject,
    TJJAEOptions,
    JJAbstractStoreConnector,
    TJJTableProperty,
    JJAcl
};