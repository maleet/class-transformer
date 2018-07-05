import "reflect-metadata";
import {serialize, deserialize, deserializeArray, plainToClass, classToPlain} from "../../src/index";
import {defaultMetadataStorage} from "../../src/storage";
import {Exclude, Type, Transform} from "../../src/decorators";
import {Guid, TypeGuid} from "./Guid";

describe("serialization and deserialization objects", () => {

    it("should perform serialization and deserialization properly", () => {
        defaultMetadataStorage.clear();

        class User {
            firstName: string;
            lastName: string;
            @Exclude()
            password: string;
        }

        const user = new User();
        user.firstName = "Umed";
        user.lastName = "Khudoiberdiev";
        user.password = "imnosuperman";

        const user1 = new User();
        user1.firstName = "Dima";
        user1.lastName = "Zotov";
        user1.password = "imnosuperman";

        const user2 = new User();
        user2.firstName = "Bakhrom";
        user2.lastName = "Baubekov";
        user2.password = "imnosuperman";

        const users = [user1, user2];

        const plainUser = {
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman"
        };

        const plainUsers = [{
            firstName: "Dima",
            lastName: "Zotov",
            password: "imnobatman"
        }, {
            firstName: "Bakhrom",
            lastName: "Baubekov",
            password: "imnosuperman"
        }];

        const plainedUser = serialize(user);
        plainedUser.should.be.eql(JSON.stringify({
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        }));

        const plainedUsers = serialize(users);
        plainedUsers.should.be.eql(JSON.stringify([{
            firstName: "Dima",
            lastName: "Zotov",
        }, {
            firstName: "Bakhrom",
            lastName: "Baubekov",
        }]));

        const classedUser = deserialize(User, JSON.stringify(plainUser));
        classedUser.should.be.instanceOf(User);
        classedUser.should.be.eql({
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });

        const classedUsers = deserializeArray(User, JSON.stringify(plainUsers));
        classedUsers[0].should.be.instanceOf(User);
        classedUsers[1].should.be.instanceOf(User);

        const userLike1 = new User();
        userLike1.firstName = "Dima";
        userLike1.lastName = "Zotov";

        const userLike2 = new User();
        userLike2.firstName = "Bakhrom";
        userLike2.lastName = "Baubekov";

        classedUsers.should.be.eql([userLike1, userLike2]);
    });

    it("should successfully deserialize object with unknown nested properties ", () => {
        defaultMetadataStorage.clear();

        class TestObject {
            prop: string;
        }

        const payload = {
            prop: "Hi",
            extra: {
                anotherProp: "let's see how this works out!"
            }
        };

        const result = deserialize(TestObject, JSON.stringify(payload));

        result.should.be.instanceof(TestObject);
        result.prop.should.be.eql("Hi");
        // We should strip, but it's a breaking change
        // (<any>result).extra.should.be.undefined;
    });


    it("should successfully deserialize Guid", () => {
        defaultMetadataStorage.clear();

        class TestGrandParent {
            @TypeGuid()
                // @Transform(value => value.toString(), {toPlainOnly: true})
                // @Transform(value => Guid.parse(value), {toClassOnly: true})
            Status?: Guid;
        }

        class TestParent extends TestGrandParent {
            @TypeGuid()
                // @Transform(value => value.toString(), {toPlainOnly: true})
                // @Transform(value => Guid.parse(value), {toClassOnly: true})
            Statuses: Guid[];
        }

        class TestObject extends TestParent {
            @TypeGuid()
                // @Transform(value => value.toString(), {toPlainOnly: true})
                // @Transform(value => Guid.parse(value), {toClassOnly: true})
            Status2: Guid;
        }

        const payload = {
            Status: "73002479-b697-4eb8-a6c3-52dfaedd9e9c",
            Statuses: ["83002479-b697-4eb8-a6c3-52dfaedd9e9c", "93002479-b697-4eb8-a6c3-52dfaedd9e9c"]
        };

        const result = plainToClass(TestObject, payload);
        const plain = classToPlain<TestObject>(result);
        console.log(serialize<TestObject>(result));

        result.should.be.instanceof(TestObject);
        result.Status.should.be.eql(Guid.parse("73002479-b697-4eb8-a6c3-52dfaedd9e9c"));



        plain.should.be.eql({
            Status: payload.Status,
            Statuses: ["83002479-b697-4eb8-a6c3-52dfaedd9e9c", "93002479-b697-4eb8-a6c3-52dfaedd9e9c"]
        });

        // We should strip, but it's a breaking change
        // (<any>result).extra.should.be.undefined;
    });

});
