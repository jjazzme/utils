import { JJAbstractExtendedObject, JJAbstractStoreConnector, TJJAEOptions, TJJExtendedObject, TJJTableProperty } from "../extendedObject.js";
type TJJStrategyActions = 'r' | 'a' | 'u' | 'c' | 'd' | 'e';
type TJJDeniedStrategy = Partial<Record<TJJStrategyActions, true>>;
type TJJAclEntry = {
    subjectId?: string;
    objectId: string;
    denied?: TJJDeniedStrategy;
    ttl: number;
    description?: string;
};
declare class JJAclEntry extends JJAbstractExtendedObject<TJJAclEntry, never, never, string, JJAbstractStoreConnector<string>> {
    constructor(s: string | TJJExtendedObject<TJJAclEntry, never, never>, tableProperties: Record<string, TJJTableProperty<string>>, options?: TJJAEOptions<TJJAclEntry, string, JJAbstractStoreConnector<string>>);
}
export { TJJAclEntry, JJAclEntry, TJJDeniedStrategy, TJJStrategyActions };
