"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../../src");
function TypeGuid() {
    return function (target, key) {
        src_1.Type(function (type1) { return Guid; })(target, key);
        src_1.Transform(function (value) {
            console.log("to plain:" + JSON.stringify(value));
            if (value instanceof Array) {
                return value.map(function (value1) { return value1.toString(); });
            }
            return value.toString();
        }, { toPlainOnly: true })(target, key);
        src_1.Transform(function (value) {
            console.log("to class:" + JSON.stringify(value));
            if (value instanceof Array) {
                return value.map(function (value1) { return Guid.parse(value1); });
            }
            return Guid.parse(value);
        }, { toClassOnly: true })(target, key);
    };
}
exports.TypeGuid = TypeGuid;
var Guid = /** @class */ (function () {
    function Guid(guid) {
        if (!guid) {
            throw new TypeError("Invalid argument; `value` has no value.");
        }
        this.value = Guid.EMPTY;
        if (guid && Guid.isGuid(guid)) {
            this.value = guid.toString();
        }
    }
    Guid.isGuid = function (guid) {
        var value = guid.toString();
        return guid && (guid instanceof Guid || Guid.validator.test(value));
    };
    Guid.create = function () {
        return new Guid([Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-"));
    };
    Guid.createEmpty = function () {
        return new Guid("emptyguid");
    };
    Guid.parse = function (guid) {
        return new Guid(guid);
    };
    Guid.equals = function (from, to) {
        return new Guid(from || Guid.EMPTY).equals(new Guid(to));
    };
    Guid.raw = function () {
        return [Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-");
    };
    Guid.gen = function (count) {
        var out = "";
        for (var i = 0; i < count; i++) {
            // tslint:disable-next-line:no-bitwise
            out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return out;
    };
    Guid.prototype.equals = function (other) {
        // Comparing string `value` against provided `guid` will auto-call
        // toString on `guid` for comparison
        return Guid.isGuid(other) && this.value === other.toString();
    };
    Guid.prototype.isEmpty = function () {
        return this.value === Guid.EMPTY;
    };
    Guid.prototype.toString = function () {
        return this.value;
    };
    Guid.prototype.toJSON = function () {
        return {
            value: this.value,
        };
    };
    Guid.validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");
    Guid.EMPTY = "00000000-0000-0000-0000-000000000000";
    return Guid;
}());
exports.Guid = Guid;
//# sourceMappingURL=Guid.js.map