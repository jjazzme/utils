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
    emitOnChange(pack: TJJEventDataPacket): any;
    onDestroy(callback: (pack: TJJEventDataPacket) => any): void;
    emitOnDestroy(pack: TJJEventDataPacket): any;
    onError(callback: (pack: TJJEventDataPacket) => any): void;
    emitOnError(pack: TJJEventDataPacket): any;
}
declare class JJBaseObject extends JJEventEmitter {
    id: string | number;
    created: number;
    updated?: number;
    constructor(source: Partial<JJBaseObject>);
    protected toJson(source: any): any | undefined;
    get createdAsDate(): Date;
    get updatedAsDate(): Date | undefined;
}
export { JJBaseObject, JJEventEmitter, TJJEventDataPacket };
