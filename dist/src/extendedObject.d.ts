import { JJEventEmitter } from "./index.js";
type TJJAEOptions<D> = {
    keys?: string[];
    arrayKeys?: {
        key: keyof D;
        constructor: (i: any) => any;
    }[];
    singleKeys?: {
        key: keyof D;
        constructor: (i: any) => any;
    }[];
    connector?: JJAbstractStoreConnector;
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
declare abstract class JJAbstractStoreConnector extends JJEventEmitter {
    abstract open(): Promise<void>;
    abstract close(): Promise<void>;
    abstract expand<D, C, M>(s: string): Promise<JJAbstractExtendedObject<D, C, M>>;
    abstract save<D, C, M>(s: JJAbstractExtendedObject<D, C, M>): Promise<(Record<string, any> & {
        id: string;
    })[]>;
    abstract delete(thing: string): Promise<(Record<string, any> & {
        id: string;
    })[]>;
}
declare abstract class JJAbstractExtendedObject<D, C, M> extends JJEventEmitter {
    #private;
    id: string;
    created?: number;
    updated?: number;
    version?: number;
    saved?: number;
    data?: D;
    chaos?: C;
    _meta: M | Partial<M>;
    _connector?: JJAbstractStoreConnector;
    protected constructor(s: TJJExtendedObject<D, C, M>, options?: TJJAEOptions<D>);
    get isRef(): boolean;
    toJsonExt(source?: Record<string, any> | Array<any>): Record<string, any> | string | Array<any>;
}
export { TJJExtendedObject, JJAbstractExtendedObject, TJJAEOptions, JJAbstractStoreConnector };
