import {JJDBRole} from "./role.js";
import {
    JJAbstractExtendedObject,
    JJAbstractStoreConnector,
    TJJAEOptions,
    TJJExtendedObject,
    TJJTableProperty
} from "../extendedObject.js";

type TJJTokenSet = {
    value: string;
    expired: number;
}[]
type TJJAbstractUser = {
    roles: JJDBRole[];
    login: string;
    passwordMD5: string | false;
    tokens: TJJTokenSet;
};
abstract class JJAbstractUser<UD extends TJJAbstractUser> extends JJAbstractExtendedObject<UD, any, any, string, JJAbstractStoreConnector<string>>{

    protected constructor(s: string | TJJExtendedObject<UD, any, any>, tableProperties: Record<string, TJJTableProperty<string>>, options?: TJJAEOptions<UD, string, JJAbstractStoreConnector<string>>  ) {
        super(s, tableProperties, {...options, unique: ['login', ...(options?.unique ?? [])]});
    }
}

export {
    TJJAbstractUser,
    JJAbstractUser,
    TJJTokenSet
}