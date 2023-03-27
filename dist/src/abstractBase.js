import { utils } from "./index.js";
class AbstractBaseObject {
    id;
    created;
    updated;
    constructor(source) {
        this.id = source.id ?? utils.generateId;
        this.created = source.created ?? Date.now();
    }
    toJson(source) {
        return utils.toJson(source);
    }
    get createdAsDate() {
        return new Date(this.created);
    }
    get updatedAsDate() {
        return this.updated == undefined ? undefined : new Date(this.updated);
    }
}
export { AbstractBaseObject };
