import {TypeMetadata} from "../../src/metadata/TypeMetadata";
import {defaultMetadataStorage} from "../../src/storage";
import {TransformMetadata} from "../../src/metadata/TransformMetadata";
import {Transform, Type} from "../../src";

export function TypeGuid() {
    return function (target: any, key: string) {
        Type(type1 => Guid)(target, key);
        Transform((value: Guid | Guid[]) => {
            console.log("to plain:" + JSON.stringify(value));
            if (value instanceof Array) {
                return value.map(value1 => value1.toString());
            }
            return value.toString();
        }, {toPlainOnly: true})(target, key);
        Transform((value: string | string[]) => {
            console.log("to class:" + JSON.stringify(value));
            if (value instanceof Array) {
                return value.map(value1 => Guid.parse(value1));
            }
            return Guid.parse(value);
        }, {toClassOnly: true})(target, key);
    };
}

export class Guid {

    public static validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");

    public static EMPTY = "00000000-0000-0000-0000-000000000000";

    readonly value: string;

    public static isGuid(guid: any) {
        const value: string = guid.toString();
        return guid && (guid instanceof Guid || Guid.validator.test(value));
    }

    public static create(): Guid {
        return new Guid([Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-"));
    }

    public static createEmpty(): Guid {
        return new Guid("emptyguid");
    }

    public static parse(guid: string): Guid {
        return new Guid(guid);
    }

    public static equals(from: string | Guid, to: string | Guid): boolean {
        return new Guid(from || Guid.EMPTY).equals(new Guid(to));
    }

    public static raw(): string {
        return [Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-");
    }

    private static gen(count: number) {
        let out = "";
        for (let i = 0; i < count; i++) {
            // tslint:disable-next-line:no-bitwise
            out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return out;
    }

    private constructor(guid: string | Guid) {
        if (!guid) {
            throw new TypeError("Invalid argument; `value` has no value.");
        }

        this.value = Guid.EMPTY;

        if (guid && Guid.isGuid(guid)) {
            this.value = guid.toString();
        }
    }

    public equals(other: Guid): boolean {
        // Comparing string `value` against provided `guid` will auto-call
        // toString on `guid` for comparison
        return Guid.isGuid(other) && this.value === other.toString();
    }

    public isEmpty(): boolean {
        return this.value === Guid.EMPTY;
    }

    public toString(): string {
        return this.value;
    }

    public toJSON(): any {
        return {
            value: this.value,
        };
    }
}


