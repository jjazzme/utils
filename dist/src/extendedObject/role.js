import { JJAbstractExtendedObject } from "../extendedObject.js";
class JJDBRole extends JJAbstractExtendedObject {
    constructor(s, tableProperties, options) {
        super(s, tableProperties, { ...options, unique: ['name', ...(options?.unique ?? [])] });
    }
}
export { JJDBRole };
//# sourceMappingURL=role.js.map