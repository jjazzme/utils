import { JJAbstractExtendedObject, JJAbstractStoreConnector, TJJAEOptions, TJJExtendedObject, TJJTableProperty } from "../extendedObject.js";
type TJJDBRole = {
    id: string;
    name: string;
    weight: number;
    description?: string;
};
declare class JJDBRole extends JJAbstractExtendedObject<TJJDBRole, never, never, string, JJAbstractStoreConnector<string>> {
    constructor(s: string | TJJExtendedObject<TJJDBRole, never, never>, tableProperties: Record<string, TJJTableProperty<string>>, options?: TJJAEOptions<TJJDBRole, string, JJAbstractStoreConnector<string>>);
}
export { TJJDBRole, JJDBRole };
