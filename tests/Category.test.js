import Crypt from "../src/components/DataBase/Security/Crypt";
import CryptError from "../src/components/Basic/Types/CryptError";
import {CHARS_LC, CHARS_NR, CHARS_SPECIAL, CHARS_UP} from "../src/components/Basic/consts";
import Category from "../src/components/Basic/Types/Category";

describe("Category tests", () => {

    test('create', () => {
        const name = 'Category-1';
        const hash = Crypt.hash_sha1_lc(name);

        const category = Category.create('profileId', name, 0);

        expect(category.name).toBe(name);
        expect(category.lchash).toBe(hash);
    });

    test('change', () => {

        const name = 'Category-1';
        const hash = Crypt.hash_sha1_lc(name);

        const category = Category.create('profileId', "abcdef", 0);

        category.apply({
            name: name
        });

        expect(category.name).toBe(name);
        expect(category.lchash).toBe(hash);
    });

    test('encryption', () => {

        const name = 'Category-1';
        const hash = Crypt.hash_sha1_lc(name);

        const category = Category.create('profileId', name, 0);

        const cipher = new Crypt('123');

        category.encrypt(cipher);

        expect(category.name).not.toBe(name);
        expect(category.lchash).toBe(hash);

        category.decrypt(cipher);

        expect(category.name).toBe(name);
        expect(category.lchash).toBe(hash);

    });

    test('clone', () => {

        const category = Category.create('profileId', "abcdef", 0);
        const clone    = category.clone();

        expect(JSON.stringify(category)).toBe(JSON.stringify(clone));

    });

    test('toDbDoc', () => {

        const category = Category.create('profileId', "abcdef", 0);
        const dbDoc    = category.toDbDoc();

        expect(dbDoc.id).toBeUndefined();
        expect(category.id).toEqual(dbDoc._id);

        expect(dbDoc['updatedAt']).toBeUndefined();
        expect(dbDoc['createdAt']).toBeUndefined();

    });
});

