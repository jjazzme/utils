import { JJEventEmitter } from "../baseObject.js";
import { JJDBQuery } from "./query.js";
import { JJDBRole } from "./role.js";
import { TJJAclEntry, TJJDeniedStrategy, TJJStrategyActions } from "./entry.js";
import { TJJAbstractUser } from "./user.js";
import { JJAbstractExtendedObject, TJJTableProperty } from "../extendedObject.js";
declare abstract class JJAbstractStoreConnector<TN extends string> extends JJEventEmitter {
    tables: Record<TN, TJJTableProperty<TN>>;
    queries?: JJDBQuery;
    rootToken?: string;
    roles?: JJDBRole[];
    acl: JJAcl;
    cache: any[];
    saveQueue: any[];
    protected constructor(tables: Record<TN, TJJTableProperty<TN>>, options?: {
        rootToken?: string;
        queries?: JJDBQuery;
        roles?: JJDBRole[];
        acl?: JJAcl;
    });
    abstract open(): Promise<void>;
    abstract close(): Promise<void>;
    abstract create_<T extends JJAbstractExtendedObject<any, any, any, string, JJAbstractStoreConnector<string>>>(s: T): Promise<T>;
    abstract update_<T extends JJAbstractExtendedObject<any, any, any, string, JJAbstractStoreConnector<string>>>(s: T): Promise<T>;
    abstract delete_<T extends JJAbstractExtendedObject<any, any, any, string, JJAbstractStoreConnector<string>>>(thing: string, token: string): Promise<any>;
    abstract getOne_<D, C, M, T extends JJAbstractExtendedObject<D, C, M, TN, JJAbstractStoreConnector<TN>>>(thing: string, token: string): Promise<T>;
    abstract getAll_<D, C, M, T extends JJAbstractExtendedObject<D, C, M, TN, JJAbstractStoreConnector<TN>>>(thing: string, token: string): Promise<T[]>;
    abstract queryExecute_(queryNameOrId: string, token: string): Promise<any>;
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
export { JJAbstractStoreConnector, JJAcl };
