import { JJEventEmitter } from "./index.js";
class JJAbstractStoreConnector extends JJEventEmitter {
    tables;
    constructor(tables) {
        super();
        this.tables = tables;
    }
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
    constructor(s, tableProperties, options) {
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
                for (const [key, value] of Object.entries(this.data)) {
                    if (Array.isArray(value)) {
                        value.forEach((val, ind) => {
                            const instance = this.#stringOrObjectToInstance(val, tableProperties, this._connector);
                            const t = this.data[key];
                            if (instance)
                                this.data[key][ind] = instance;
                        });
                    }
                    else {
                        const instance = this.#stringOrObjectToInstance(value, tableProperties, this._connector);
                        if (instance)
                            this.data[key] = instance;
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
    #stringIsIdOfTable(str) {
        const reg = /^[a-zA-Z_0-9]+:[a-zA-Z_0-9]{9,42}$/gm;
        const match = reg.exec(str);
        return match ? match[1] : false;
    }
    #stringOrObjectToInstance(value, tableProperties, connector) {
        if (!(value && (typeof value === 'string' || value.id)))
            return false;
        const maybeId = typeof value === 'string' ? value : value.id;
        const name = this.#stringIsIdOfTable(maybeId);
        if (!name)
            return false;
        const entry = Object.entries(tableProperties).find(([key, value]) => key === name);
        if (entry) {
            const constructor = entry[1];
            return constructor(value, connector);
        }
        return false;
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