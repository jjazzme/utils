import {
    JJAbstractExtendedObject,
    JJAbstractStoreConnector,
    TJJAEOptions,
    TJJExtendedObject,
    TJJTableProperty
} from "../extendedObject.js";
import {TJJDBRole} from "./role.js";

type TJJDBQuery = {
    name: string;
    query: string;
    description?: string;
}
class JJDBQuery extends JJAbstractExtendedObject<TJJDBQuery, never, never, string, JJAbstractStoreConnector<any>> {

    constructor(s: string | TJJExtendedObject<TJJDBQuery, never, never>, tableProperties: Record<string, TJJTableProperty<string>>, options?: TJJAEOptions<TJJDBQuery, string, JJAbstractStoreConnector<string>> ) {
        super(s, tableProperties, options);
    }
}

export {
    TJJDBQuery,
    JJDBQuery
}