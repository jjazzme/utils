declare abstract class AbstractBaseObject {
    id: string | number;
    created: number;
    updated?: number;
    protected constructor(source: Partial<AbstractBaseObject>);
    toJson(source: any): Partial<any>;
    get createdAsDate(): Date;
    get updatedAsDate(): Date | undefined;
}
export { AbstractBaseObject };
