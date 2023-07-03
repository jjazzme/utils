import { JJDBRole } from "./role.js";
import { JJAbstractExtendedObject, JJAbstractStoreConnector, TJJAEOptions, TJJExtendedObject, TJJTableProperty } from "../extendedObject.js";
type TJJAbstractUser = {
    id: string;
    roles: JJDBRole[];
    token: string;
    tokenTTL: number;
};
declare abstract class JJAbstractUser extends JJAbstractExtendedObject<TJJAbstractUser, any, any, string, JJAbstractStoreConnector<string>> {
    protected constructor(s: string | TJJExtendedObject<TJJAbstractUser, any, any>, tableProperties: Record<string, TJJTableProperty<string>>, options?: TJJAEOptions<TJJAbstractUser, string, JJAbstractStoreConnector<string>>);
}
export { TJJAbstractUser, JJAbstractUser };
