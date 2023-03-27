import {utils} from "./index.js";

abstract class AbstractBaseObject {
    id: string | number;
    created: number;
    updated?: number;
    protected constructor(source: Partial<AbstractBaseObject>) {
        this.id = source.id ?? utils.generateId;
        this.created = source.created ?? Date.now();

    }
    toJson(source: any) {
        return utils.toJson(source);
    }

    get createdAsDate(): Date {
        return new Date(this.created);
    }

    get updatedAsDate(): Date | undefined {
        return this.updated == undefined ? undefined : new Date(this.updated);
    }
}

export {
    AbstractBaseObject
}