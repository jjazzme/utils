import { JJDBRole } from "./role.js";
import { JJAbstractExtendedObject, JJAbstractStoreConnector, TJJAEOptions, TJJExtendedObject, TJJTableProperty } from "../extendedObject.js";
type TJJTokenSet = {
    value: string;
    expired: number;
}[];
type TJJAbstractUser = {
    roles: JJDBRole[];
    login: string;
    passwordMD5: string | false;
    tokens: TJJTokenSet;
};
declare abstract class JJAbstractUser<UD extends TJJAbstractUser> extends JJAbstractExtendedObject<UD, any, any, string, JJAbstractStoreConnector<string>> {
    protected constructor(s: string | TJJExtendedObject<UD, any, any>, tableProperties: Record<string, TJJTableProperty<string>>, options?: TJJAEOptions<UD, string, JJAbstractStoreConnector<string>>);
}
export { TJJAbstractUser, JJAbstractUser, TJJTokenSet };
