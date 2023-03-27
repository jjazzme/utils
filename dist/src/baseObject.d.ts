declare class JJEventEmitter {
    #private;
    constructor();
    on(eventName: string, callback: (...args: any[]) => any): void;
    emit(eventName: string, ...args: any[]): any;
    removeOn(eventName: string): {
        eventName: string;
        callback: (...args: any[]) => any;
    } | false;
    onChange(callback: (...args: any[]) => any): void;
    emitOnChange(...args: any[]): any;
    onDestroy(callback: (...args: any[]) => any): void;
    emitOnDestroy(...args: any[]): any;
    onError(callback: (...args: any[]) => any): void;
    emitOnError(...args: any[]): any;
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
export { JJBaseObject, JJEventEmitter };
