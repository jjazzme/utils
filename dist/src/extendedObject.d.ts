import { JJDBRole, JJEventEmitter, TJJAbstractUser } from "./index.js";
import { JJDBQuery } from "./extendedObjects/query.js";
import { TJJAclEntry, TJJDeniedStrategy, TJJStrategyActions } from "./extendedObjects/entry.js";
type TJJAEOptions<D, TN extends string, DB extends JJAbstractStoreConnector<TN>> = {
    keys?: (keyof D)[];
    connector?: DB;
};
type TJJTableProperty<TN extends string> = {
    name: TN;
    constructor: (i: TJJExtendedObject<any, any, any>, c: any) => any;
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
declare abstract class JJAbstractExtendedObject<D, C, M, TN extends string, DB extends JJAbstractStoreConnector<TN>> extends JJEventEmitter {
    #private;
    id: string;
    created?: number;
    updated?: number;
    version?: number;
    saved?: number;
    data?: D;
    chaos?: C;
    _meta: M | Partial<M>;
    _connector?: DB;
    protected constructor(s: string | TJJExtendedObject<D, C, M>, tableProperties: Record<TN, TJJTableProperty<TN>>, options?: TJJAEOptions<D, TN, DB>);
    get isRef(): boolean;
    toJsonExt(source?: Record<string, any> | Array<any>): Record<string, any> | string | Array<any>;
}
declare abstract class JJAbstractStoreConnector<TN extends string> extends JJEventEmitter {
    tables: Record<TN, TJJTableProperty<TN>>;
    queries?: JJDBQuery;
    rootToken?: string;
    roles?: JJDBRole[];
    acl: JJAcl;
    protected constructor(tables: Record<TN, TJJTableProperty<TN>>, options?: {
        rootToken?: string;
        queries?: JJDBQuery;
        roles?: JJDBRole[];
        acl?: JJAcl;
    });
    abstract open(): Promise<void>;
    abstract close(): Promise<void>;
    abstract save<D, C, M, T extends JJAbstractExtendedObject<D, C, M, TN, JJAbstractStoreConnector<TN>>>(s: T, token: string): Promise<any>;
    abstract delete<D, C, M, T extends JJAbstractExtendedObject<D, C, M, TN, JJAbstractStoreConnector<TN>>>(thing: string, token: string): Promise<any>;
    abstract getOne<D, C, M, T extends JJAbstractExtendedObject<D, C, M, TN, JJAbstractStoreConnector<TN>>>(thing: string, token: string): Promise<T>;
    abstract getAll<D, C, M, T extends JJAbstractExtendedObject<D, C, M, TN, JJAbstractStoreConnector<TN>>>(thing: string, token: string): Promise<T[]>;
    abstract query(queryNameOrId: string, token: string): Promise<any>;
}
declare class JJAcl {
    defaultDeniedStrategy: TJJDeniedStrategy;
    entriesCore: TJJAclEntry[];
    anonymousRoleId: string;
    rootRoleId: string;
    rootToken?: string;
    getSubjectsIdByToken: (token: string) => Promise<[string]>;
    constructor(s?: {
        defaultDeniedStrategy?: TJJDeniedStrategy;
        entriesCore?: TJJAclEntry[];
        usersCore?: TJJAbstractUser[];
        anonymousRoleId?: string;
        rootRoleId?: string;
        getSubjectByToken: (token: string) => Promise<[string]>;
        rootToken?: string;
    });
    allow(action: TJJStrategyActions, token: string, objectId: string): Promise<boolean>;
}
export { TJJExtendedObject, JJAbstractExtendedObject, TJJAEOptions, JJAbstractStoreConnector, TJJTableProperty, JJAcl };
