import { JJAbstractExtendedObject } from "../extendedObject.js";
class JJAbstractUser extends JJAbstractExtendedObject {
    constructor(s, tableProperties, options) {
        super(s, tableProperties, { ...options, unique: ['login', ...(options?.unique ?? [])] });
    }
}
export { JJAbstractUser };
//# sourceMappingURL=user.js.map