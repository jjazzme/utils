import { JJEventEmitter } from "./index.js";
import { JJAbstractStoreConnector } from "./extendedObject/storeConnector.js";
type TJJAEOptions<D, TN extends string, DB extends JJAbstractStoreConnector<TN>> = {
    keys?: (keyof D)[];
    unique?: (keyof D)[];
    connector?: DB;
    transformations?: {
        save?: Record<keyof D, (value: any) => any>;
        read?: Record<keyof D, (value: any) => any>;
    };
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
    unique?: (keyof D)[];
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
    _lastSaved?: any;
    protected constructor(s: string | TJJExtendedObject<D, C, M>, tableProperties: Record<TN, TJJTableProperty<TN>>, options?: TJJAEOptions<D, TN, DB>);
    get isRef(): boolean;
    toJsonExt(source?: Record<string, any> | Array<any>): Record<string, any> | string | Array<any>;
    create<T extends JJAbstractExtendedObject<any, any, any, string, JJAbstractStoreConnector<string>>>(s: T, token: string): Promise<T>;
    update<T extends JJAbstractExtendedObject<any, any, any, string, JJAbstractStoreConnector<string>>>(s: T, token: string): Promise<T>;
}
export { TJJExtendedObject, JJAbstractExtendedObject, TJJAEOptions, TJJTableProperty, };
