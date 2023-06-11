import { JJEventEmitter } from "./index.js";
class JJAbstractStoreConnector extends JJEventEmitter {
}
class JJAbstractExtendedObject extends JJEventEmitter {
    id;
    created;
    updated;
    version;
    saved;
    data;
    chaos;
    _meta;
    _connector;
    #options;
    constructor(s, options) {
        super();
        if (options)
            this.#options = options;
        if (options?.connector)
            this._connector = options.connector;
        if (typeof s === 'string') {
            this.id = s;
            this._meta = {};
        }
        else {
            this.id = s.id;
            this.created = s.created ?? Date.now();
            if (s.updated)
                this.updated = s.updated;
            if (s.version)
                this.version = s.version;
            if (s.saved)
                this.saved = s.saved;
            if (options?.keys && s.data) {
                for (const [key] of Object.entries(s.data)) {
                    if (!options.keys.includes(key))
                        delete s.data[key];
                }
            }
            this.data = s.data;
            if (this.data) {
                if (options?.arrayKeys) {
                    for (const { key, constructor } of options.arrayKeys) {
                        if (this.data[key]) {
                            const target = [];
                            for (const item of this.data[key]) {
                                target.push(constructor(item));
                            }
                            this.data[key] = target;
                        }
                    }
                }
                if (options?.singleKeys) {
                    for (const { key, constructor } of options.singleKeys) {
                        if (this.data[key])
                            this.data[key] = constructor(this.data[key]);
                    }
                }
            }
            if (s.chaos)
                this.chaos = s.chaos;
            if (s._meta) {
                this._meta = s._meta;
            }
            else {
                this._meta = {};
            }
        }
    }
    get isRef() {
        return !this.data;
    }
    toJsonExt(source) {
        source ??= this;
        if (Array.isArray(source)) {
            const target = [];
            for (let value of source) {
                if (typeof value === 'object' && value != undefined) {
                    value = this.toJsonExt(value);
                }
                target.push(value);
            }
            return target;
        }
        else {
            if (source.toJsonExt && source.isRef === true)
                return source.id;
            const target = {};
            for (const [key, value] of Object.entries(source)) {
                if (value != undefined && key.charAt(0) !== '_') {
                    if (typeof value === 'object') {
                        target[key] = this.toJsonExt(value);
                    }
                    else {
                        target[key] = value;
                    }
                }
            }
            return target;
        }
    }
}
;
export { JJAbstractExtendedObject, JJAbstractStoreConnector };
//# sourceMappingURL=extendedObject.js.map