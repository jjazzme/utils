import {Md5} from 'ts-md5';

type TJJDBQueryCacheItem = {
    argsMD5: string;
    expired: number;
    value: any;
}
class JJDBQuery {
    name: string;
    cacheTTL: number;
    query: ((...args: any[])=>string) | string;
    maximumCacheItems: number;
    cache: TJJDBQueryCacheItem[];

    constructor(name: string, query: ((...args: any[])=>string) | string, o?: {
        cacheTTL?: number;
        maximumCacheItems?: number;
    }) {
        this.name = name;
        this.cacheTTL = o?.cacheTTL ?? 30000;
        this.maximumCacheItems = o?.maximumCacheItems ?? 100
        this.query= query;
        this.cache = [];
    }

    #clearOld() {
        this.cache = this.cache.filter(i=>i.expired<Date.now());
    }

    run(...args: any[]): any {
        this.#clearOld();
        const argsMD5 = Md5.hashStr(JSON.stringify(args));

    }
}

export {
    JJDBQuery
}