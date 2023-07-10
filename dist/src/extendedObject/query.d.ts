type TJJDBQueryCacheItem = {
    argsMD5: string;
    expired: number;
    value: any;
};
declare class JJDBQuery {
    #private;
    name: string;
    cacheTTL: number;
    query: ((...args: any[]) => string) | string;
    maximumCacheItems: number;
    cache: TJJDBQueryCacheItem[];
    constructor(name: string, query: ((...args: any[]) => string) | string, o?: {
        cacheTTL?: number;
        maximumCacheItems?: number;
    });
    run(...args: any[]): any;
}
export { JJDBQuery };
