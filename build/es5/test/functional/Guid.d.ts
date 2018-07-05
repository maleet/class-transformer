export declare function TypeGuid(): (target: any, key: string) => void;
export declare class Guid {
    static validator: RegExp;
    static EMPTY: string;
    readonly value: string;
    static isGuid(guid: any): boolean;
    static create(): Guid;
    static createEmpty(): Guid;
    static parse(guid: string): Guid;
    static equals(from: string | Guid, to: string | Guid): boolean;
    static raw(): string;
    private static gen(count);
    private constructor();
    equals(other: Guid): boolean;
    isEmpty(): boolean;
    toString(): string;
    toJSON(): any;
}
