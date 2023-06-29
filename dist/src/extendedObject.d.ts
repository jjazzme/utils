import { JJEventEmitter } from "./index.js";
type TJJAEOptions<D, N extends string> = {
    keys?: string[];
    connector?: JJAbstractStoreConnector<N>;
};
type TJJTableProperty<N> = {
    name: N;
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
declare abstract class JJAbstractStoreConnector<N extends string> extends JJEventEmitter {
    tables: Record<N, TJJTableProperty<N>>;
    protected constructor(tables: Record<N, TJJTableProperty<N>>);
    abstract open(): Promise<void>;
    abstract close(): Promise<void>;
    abstract expand<D, C, M>(s: string): Promise<JJAbstractExtendedObject<D, C, M, N>>;
    abstract save<D, C, M>(s: JJAbstractExtendedObject<D, C, M, N>): Promise<(Record<string, any> & {
        id: string;
    })[]>;
    abstract delete(thing: string): Promise<(Record<string, any> & {
        id: string;
    })[]>;
}
declare abstract class JJAbstractExtendedObject<D, C, M, N extends string> extends JJEventEmitter {
    #private;
    id: string;
    created?: number;
    updated?: number;
    version?: number;
    saved?: number;
    data?: D;
    chaos?: C;
    _meta: M | Partial<M>;
    _connector?: JJAbstractStoreConnector<N>;
    protected constructor(s: TJJExtendedObject<D, C, M>, tableProperties: Record<N, TJJTableProperty<N>>, options?: TJJAEOptions<D, N>);
    get isRef(): boolean;
    toJsonExt(source?: Record<string, any> | Array<any>): Record<string, any> | string | Array<any>;
}
export { TJJExtendedObject, JJAbstractExtendedObject, TJJAEOptions, JJAbstractStoreConnector, TJJTableProperty };
