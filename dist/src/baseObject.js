import { utils } from "./index.js";
class JJEventEmitter {
    #events;
    #onChange;
    #onDestroy;
    #onError;
    constructor() {
        this.#events = [];
    }
    on(eventName, callback) {
        this.#events.push({ eventName, callback });
    }
    emit(eventName, ...args) {
        const event = this.#events.find(item => item.eventName === eventName);
        if (event == undefined)
            return undefined;
        return event.callback(...args);
    }
    removeOn(eventName) {
        const ind = this.#events.findIndex(item => item.eventName === eventName);
        if (ind < 0)
            return false;
        const removed = this.#events.splice(ind, 1);
        return removed[0];
    }
    onChange(callback) {
        this.#onChange = callback;
    }
    emitOnChange(...args) {
        return this.#onChange ? this.#onChange(...args) : undefined;
    }
    onDestroy(callback) {
        this.#onDestroy = callback;
    }
    emitOnDestroy(...args) {
        return this.#onDestroy ? this.#onDestroy(...args) : undefined;
    }
    onError(callback) {
        this.#onError = callback;
    }
    emitOnError(...args) {
        return this.#onError ? this.#onError(...args) : undefined;
    }
}
class JJBaseObject extends JJEventEmitter {
    id;
    created;
    updated;
    constructor(source) {
        super();
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
export { JJBaseObject, JJEventEmitter };
