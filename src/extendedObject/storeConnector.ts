import {JJEventEmitter} from "../baseObject.js";
import {JJDBQuery} from "./query.js";
import {JJDBRole} from "./role.js";
import {TJJAclEntry, TJJDeniedStrategy, TJJStrategyActions} from "./entry.js";
import {TJJAbstractUser} from "./user.js";
import {JJAbstractExtendedObject, TJJTableProperty} from "../extendedObject.js";


abstract class JJAbstractStoreConnector<TN extends string> extends JJEventEmitter{
    tables: Record<TN, TJJTableProperty<TN>>;
    queries?: JJDBQuery
    rootToken?: string;
    roles?: JJDBRole[];
    acl: JJAcl;
    cache: any[];
    saveQueue: any[];

    protected constructor(
        tables: Record<TN, TJJTableProperty<TN>>,
        options?: {
            rootToken?: string,
            queries?:  JJDBQuery,
            roles?: JJDBRole[],
            acl?: JJAcl,
        }) {
        super();
        this.cache = [];
        this.saveQueue = [];
        this.tables = tables;
        this.rootToken = options?.rootToken;
        this.roles = options?.roles;
        this.queries = options?.queries;
        this.acl = options?.acl ?? new JJAcl();
    }

    abstract open(): Promise<void>;
    abstract close(): Promise<void>;
    abstract create_<T extends JJAbstractExtendedObject<any, any, any, string, JJAbstractStoreConnector<string>>>(s: T): Promise<T>;
    abstract update_<T extends JJAbstractExtendedObject<any, any, any, string, JJAbstractStoreConnector<string>>>(s: T): Promise<T>;
    abstract delete_<T extends JJAbstractExtendedObject<any, any, any, string, JJAbstractStoreConnector<string>> >(thing: string, token: string): Promise<any>;
    abstract getOne_<D, C, M, T extends JJAbstractExtendedObject<D, C, M, TN, JJAbstractStoreConnector<TN>>>(thing: string, token: string): Promise<T>;
    abstract getAll_<D, C, M, T extends JJAbstractExtendedObject<D, C, M, TN, JJAbstractStoreConnector<TN>>>(thing: string, token: string): Promise<T[]>;
    abstract queryExecute_(queryNameOrId: string, token: string): Promise<any>;
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
    JJAbstractStoreConnector,
    JJAcl
}