import { JJEventEmitter } from "../baseObject.js";
class JJAbstractStoreConnector extends JJEventEmitter {
    tables;
    queries;
    rootToken;
    roles;
    acl;
    cache;
    saveQueue;
    constructor(tables, options) {
        super();
        this.cache = [];
        this.saveQueue = [];
        this.tables = tables;
        this.rootToken = options?.rootToken;
        this.roles = options?.roles;
        this.queries = options?.queries;
        this.acl = options?.acl ?? new JJAcl();
    }
}
class JJAcl {
    defaultDeniedStrategy;
    entriesCore;
    anonymousRoleId;
    rootRoleId;
    rootToken;
    getSubjectsIdByToken; // обратить внимание на порядок
    constructor(s) {
        this.rootToken = s?.rootToken;
        this.defaultDeniedStrategy = s?.defaultDeniedStrategy ?? {};
        this.entriesCore = s?.entriesCore ?? [];
        this.anonymousRoleId = s?.anonymousRoleId ?? 'dbRoles:anonymous';
        this.rootRoleId = s?.rootRoleId ?? 'dbRoles:root';
        const defGetSubjectsIdByToken = async (token) => {
            return this.rootToken
                ? token === this.rootToken
                    ? [this.rootRoleId]
                    : [this.anonymousRoleId]
                : [this.anonymousRoleId];
        };
        this.getSubjectsIdByToken = s?.getSubjectByToken ?? defGetSubjectsIdByToken;
    }
    async allow(action, token, objectId) {
        if (this.rootToken && token === this.rootToken)
            return true;
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
                }
                else {
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
export { JJAbstractStoreConnector, JJAcl };
//# sourceMappingURL=storeConnector.js.map