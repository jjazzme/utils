type TJJEventDataPacket = {
    data: any;
    hint?: any;
    args?: any;
};
declare class JJEventEmitter {
    #private;
    constructor();
    on(eventName: string, callback: (...args: any[]) => any): void;
    emit(eventName: string, ...args: any[]): any;
    removeOn(eventName: string): {
        eventName: string;
        callback: (...args: any[]) => any;
    } | false;
    onChange(callback: (pack: TJJEventDataPacket) => any): void;
    /**
     * @deprecated The method should not be used. Use emitChange
     */
    emitOnChange(pack: TJJEventDataPacket): any;
    emitChange(pack: TJJEventDataPacket): any;
    onDestroy(callback: (pack: TJJEventDataPacket) => any): void;
    /**
     * @deprecated The method should not be used. Use emitDestroy
     */
    emitOnDestroy(pack: TJJEventDataPacket): any;
    emitDestroy(pack: TJJEventDataPacket): any;
    onError(callback: (pack: TJJEventDataPacket) => any): void;
    /**
     * @deprecated The method should not be used. Use emitError
     */
    emitOnError(pack: TJJEventDataPacket): any;
    emitError(pack: TJJEventDataPacket): any;
    onLog(callback: (pack: TJJEventDataPacket) => any): void;
    emitLog(pack: TJJEventDataPacket): any;
    onInit(callback: (pack?: TJJEventDataPacket) => any): void;
    emitInit(pack?: TJJEventDataPacket): any;
}
type TJJBaseObject = {
    id: string | number;
    created: number;
    updated?: number;
};
declare class JJBaseObject extends JJEventEmitter implements TJJBaseObject {
    id: string | number;
    created: number;
    updated?: number;
    constructor(source?: Partial<TJJBaseObject>);
    protected toJson(source: any): any | undefined;
    get createdAsDate(): Date | undefined;
    get updatedAsDate(): Date | undefined;
}
export { JJBaseObject, JJEventEmitter, TJJEventDataPacket };
