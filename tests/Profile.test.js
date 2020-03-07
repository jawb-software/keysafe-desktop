import Profile from "../src/components/Basic/Types/Profile";
import Crypt from "../src/components/DataBase/Security/Crypt";

describe("Profile tests", () => {

    const date = new Date();

    const original = new Profile({
        _id : "46",
        name : "dit.k",
        categoryId: "42",
        cryptCheck: "cryptCheck",
        sessionTimeout : 1000,
        viewConfiguration : {
            showUserName : true,
            showPassword : true,
            showLastChange : true,
            showPasswordScore : true,
        },
        passwordGeneratorConfiguration : {
            useUpperCases : 'true',
            upperCases : "ABCD",
            useLowerCases : 'true',
            lowerCases : "abcd",
            useDigits: 'true',
            digits: "12345",
            useSymbols: 'true',
            symbols: "%&/",
            passwordLength: "6",
            minPasswordScore: "60"
        },
        lastLogin : date,
        currentLogin: date,
        updatedAt: date
    });

    test('clone - id is cloned', () => {

        const cloned = original.clone();
        expect(cloned.id).toBe('46');
    });

    test('clone - clone is perfect', () => {

        const cloned = original.clone();

        const p1Json = JSON.stringify(original);
        const p2Json = JSON.stringify(cloned);

        expect(p1Json).toBe(p2Json);

    });

    test('clone - is deep copy', () => {

        const clone = original.clone();

        // Ändere ein Unterobjekt -> original darf von der änderung nicht betroffen sein!
        clone.viewConfiguration.showLastChange = false;

        expect(clone.viewConfiguration.showLastChange).toBe(false);
        expect(original.viewConfiguration.showLastChange).toBe(true);

    });

    test('apply - changes', () => {

        const clone = original.clone();

        const change = {
            categoryId : "43",
            viewConfiguration : {
                showUserName : false
            },
            passwordGeneratorConfiguration: {
                upperCases : "A"
            }
        };

        clone.apply(change);

        expect(clone.categoryId).toBe("43");
        expect(clone.viewConfiguration.showUserName).toBe(false);
        expect(clone.viewConfiguration.showLastChange).toBe(true);
        expect(clone.viewConfiguration.showPassword).toBe(true);
        expect(clone.viewConfiguration.showPasswordScore).toBe(true);
        expect(clone.passwordGeneratorConfiguration.upperCases).toBe("A");
        expect(clone.passwordGeneratorConfiguration.symbols).toBe("%&/");

    });

    test('toDbDoc', () => {

        const clone = original.clone();

        clone.encrypt(new Crypt('123'));

        const dbDoc = clone.toDbDoc();

        expect(dbDoc.id).toBeUndefined(); // 'id' wird in der DB als '_id' gespeichert.
        expect(clone.id).toEqual(dbDoc._id); //

        expect(dbDoc['updatedAt']).toBeUndefined(); // wird von der DB automatisch gesetzt
        expect(dbDoc['createdAt']).toBeUndefined(); // wird von der DB automatisch gesetzt

    });

    test('encrypt', () => {

        const clone = original.clone();

        const crypt = new Crypt("123");

        clone.encrypt(crypt);

        const encryptedClone = original.clone().encrypt(crypt);

        expect(encryptedClone.passwordGeneratorConfiguration.symbols).not.toBe("%&/");

        const decryptedClone = encryptedClone.decrypt(crypt);

        expect(encryptedClone.passwordGeneratorConfiguration.symbols).toBe("%&/");

        const p1Json = JSON.stringify(original);
        const p2Json = JSON.stringify(decryptedClone);

        expect(p1Json).toBe(p2Json);
    });


});

