import {utils} from "./index.js";
import EventEmitter from "events";

type TJJEventDataPacket = {
    data: any;
    hint?: any;
    args?: any;
}
class JJEventEmitter {
    #events: {
        eventName: string,
        callback: (...args: any[]) => any
    }[];
    #onChange?: (pack: TJJEventDataPacket) => any;
    #onDestroy?: (pack: TJJEventDataPacket) => any;
    #onError?: (pack: TJJEventDataPacket) => any;
    #onLog?: (pack: TJJEventDataPacket) => any;

    constructor() {
        this.#events = [];
    }

    on(eventName: string, callback: (...args: any[]) => any) {
        this.#events.push({eventName, callback});
    }
    emit(eventName: string, ...args: any[]): any {
        const event = this.#events.find(item => item.eventName === eventName);
        if (event == undefined) return undefined;
        return event.callback(...args);
    }
    removeOn(eventName: string): {eventName: string,callback: (...args: any[]) => any} | false {
        const ind = this.#events.findIndex(item => item.eventName === eventName);
        if (ind < 0) return false;
        const removed = this.#events.splice(ind, 1);
        return removed[0];
    }

    onChange(callback: (pack: TJJEventDataPacket) => any) {
        this.#onChange = callback;
    }
    /**
     * @deprecated The method should not be used. Use emitChange
     */
    emitOnChange(pack: TJJEventDataPacket){
        return this.#onChange ? this.#onChange(pack) : undefined;
    }
    emitChange(pack: TJJEventDataPacket){
        return this.#onChange ? this.#onChange(pack) : undefined;
    }

    onDestroy(callback: (pack: TJJEventDataPacket) => any) {
        this.#onDestroy = callback;
    }
    /**
     * @deprecated The method should not be used. Use emitDestroy
     */
    emitOnDestroy(pack: TJJEventDataPacket){
        return this.#onDestroy ? this.#onDestroy(pack) : undefined;
    }
    emitDestroy(pack: TJJEventDataPacket){
        return this.#onDestroy ? this.#onDestroy(pack) : undefined;
    }

    onError(callback: (pack: TJJEventDataPacket) => any) {
        this.#onError = callback;
    }
    /**
     * @deprecated The method should not be used. Use emitError
     */
    emitOnError(pack: TJJEventDataPacket){
        return this.#onError ? this.#onError(pack) : undefined;
    }
    emitError(pack: TJJEventDataPacket){
        return this.#onError ? this.#onError(pack) : undefined;
    }

    onLog(callback: (pack: TJJEventDataPacket) => any) {
        this.#onLog = callback;
    }
    emitLog(pack: TJJEventDataPacket){
        return this.#onLog ? this.#onLog(pack) : undefined;
    }
}

class JJBaseObject extends JJEventEmitter{
    id: string | number;
    created: number;
    updated?: number;

    constructor(source: Partial<JJBaseObject>) {
        super();
        this.id = source.id ?? utils.generateId;
        this.created = source.created ?? Date.now();
    }

    protected toJson(source: any): any | undefined {
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
    JJBaseObject,
    JJEventEmitter,
    TJJEventDataPacket
}