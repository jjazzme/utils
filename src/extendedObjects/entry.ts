import {
    JJAbstractExtendedObject,
    JJAbstractStoreConnector,
    TJJAEOptions,
    TJJExtendedObject,
    TJJTableProperty
} from "../extendedObject.js";
import {TJJDBRole} from "./role.js";
type TJJStrategyActions = 'r' | 'w' | 'd' | 'e' // read write delete execute
type TJJDeniedStrategy = Partial<Record<TJJStrategyActions, true>>;
type TJJAclEntry = {
    subjectId?: string; // if undefined = for all
    objectId: string;
    denied?: TJJDeniedStrategy;
    ttl: number;
    description?: string
}
class JJAclEntry extends JJAbstractExtendedObject<TJJAclEntry, never, never, string, JJAbstractStoreConnector<string>> {

    constructor(s: string | TJJExtendedObject<TJJAclEntry, never, never>, tableProperties: Record<string, TJJTableProperty<string>>, options?: TJJAEOptions<TJJAclEntry, string, JJAbstractStoreConnector<string>> ) {
        super(s, tableProperties, options);
    }
}

export {
    TJJAclEntry,
    JJAclEntry,
    TJJDeniedStrategy,
    TJJStrategyActions
}