import {
    JJAbstractExtendedObject,
    JJAbstractStoreConnector,
    TJJAEOptions,
    TJJExtendedObject,
    TJJTableProperty
} from "../extendedObject.js";

type TJJDBRole = {
    id: string;
    name: string;
    weight: number;
    description?: string;
}
class JJDBRole extends JJAbstractExtendedObject<TJJDBRole, never, never, string, JJAbstractStoreConnector<string>> {

    constructor(s: string | TJJExtendedObject<TJJDBRole, never, never>, tableProperties: Record<string, TJJTableProperty<string>>, options?: TJJAEOptions<TJJDBRole, string, JJAbstractStoreConnector<string>> ) {
        super(s, tableProperties, options);
    }
}

export {
    TJJDBRole,
    JJDBRole
}