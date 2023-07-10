import { Md5 } from 'ts-md5';
class JJDBQuery {
    name;
    cacheTTL;
    query;
    maximumCacheItems;
    cache;
    constructor(name, query, o) {
        this.name = name;
        this.cacheTTL = o?.cacheTTL ?? 30000;
        this.maximumCacheItems = o?.maximumCacheItems ?? 100;
        this.query = query;
        this.cache = [];
    }
    #clearOld() {
        this.cache = this.cache.filter(i => i.expired < Date.now());
    }
    run(...args) {
        this.#clearOld();
        const argsMD5 = Md5.hashStr(JSON.stringify(args));
    }
}
export { JJDBQuery };
//# sourceMappingURL=query.js.map