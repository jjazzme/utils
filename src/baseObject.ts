import {utils} from "./index.js";
import EventEmitter from "events";

class JJEventEmitter {
    #events: {
        eventName: string,
        callback: (...args: any[]) => any
    }[];
    #onChange?: (...args: any[]) => any;
    #onDestroy?: (...args: any[]) => any;
    #onError?: (...args: any[]) => any;

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
    onChange(callback: (...args: any[]) => any) {
        this.#onChange = callback;
    }
    emitOnChange(...args: any[]){
        return this.#onChange ? this.#onChange(...args) : undefined;
    }
    onDestroy(callback: (...args: any[]) => any) {
        this.#onDestroy = callback;
    }
    emitOnDestroy(...args: any[]){
        return this.#onDestroy ? this.#onDestroy(...args) : undefined;
    }
    onError(callback: (...args: any[]) => any) {
        this.#onError = callback;
    }
    emitOnError(...args: any[]){
        return this.#onError ? this.#onError(...args) : undefined;
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
    JJEventEmitter
}