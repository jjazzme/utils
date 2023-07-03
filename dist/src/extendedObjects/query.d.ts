import { JJAbstractExtendedObject, JJAbstractStoreConnector, TJJAEOptions, TJJExtendedObject, TJJTableProperty } from "../extendedObject.js";
type TJJDBQuery = {
    name: string;
    query: string;
    description?: string;
};
declare class JJDBQuery extends JJAbstractExtendedObject<TJJDBQuery, never, never, string, JJAbstractStoreConnector<any>> {
    constructor(s: string | TJJExtendedObject<TJJDBQuery, never, never>, tableProperties: Record<string, TJJTableProperty<string>>, options?: TJJAEOptions<TJJDBQuery, string, JJAbstractStoreConnector<string>>);
}
export { TJJDBQuery, JJDBQuery };
