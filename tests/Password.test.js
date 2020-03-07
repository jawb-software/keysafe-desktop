import Crypt from "../src/components/DataBase/Security/Crypt";
import Password from "../src/components/Basic/Types/Password";
import {calculateScore} from "../src/components/Basic/PasswordGenerator/pwanalyse";
import ViewConfiguration from "../src/components/Basic/Types/ViewConfiguration";

describe("Password tests", () => {

    const PASSWORD = new Password({
        _id : '46',
        name : 'Facebook',
        userName : 'user@name.com',
        password : 'password',
        category : 'categoryId',
        profile  : 'profileId',
        lchash   :  Crypt.hash_sha1_lc('Facebook'),
        score    :  calculateScore('password').score().toString()
    });


    test('create', () => {

        const password = Password.createNew("Facebook", "user@name.com", "password", "categoryId", "profileId");

        expect(password.lchash).toBe("y+ZIkJA0wGJMIF/iGdP70QBSxxU=");
        expect(password.name).toBe("Facebook");
        expect(password.userName).toBe("user@name.com");
        expect(password.password).toBe("password");
        expect(password.category).toBe("categoryId");
        expect(password.profile).toBe("profileId");
        expect(password.score).toBe("0");

    });

    test('clone is perfect', () => {

        const cloned = PASSWORD.clone();

        expect(JSON.stringify(cloned)).toBe(JSON.stringify(PASSWORD));

    });

    test('change password -> recalculate score', () => {

        const cloned = PASSWORD.clone();

        cloned.apply({
            password : 'fJ4/kFwI6'
        });

        expect(cloned.score).not.toBe(PASSWORD.score);

    });

    test('change name -> recalculate lchash', () => {

        const cloned = PASSWORD.clone();

        cloned.apply({
            name : 'Twitter'
        });

        expect(cloned.lchash).not.toBe(PASSWORD.lchash);

    });

    test('encrypt -> decrypt', () => {

        const cipher = new Crypt("12345");

        const password = PASSWORD.clone();

        password.encrypt(cipher);

        // sollte sich ändern
        expect(password.name).not.toBe("Facebook");
        expect(password.userName).not.toBe("user@name.com");
        expect(password.password).not.toBe("password");

        // sollte sich NICHT ändern
        expect(password.lchash).toBe("y+ZIkJA0wGJMIF/iGdP70QBSxxU=");
        expect(password.category).toBe("categoryId");
        expect(password.profile).toBe("profileId");
        expect(password.score).not.toBe("0");

        password.decrypt(cipher);

        expect(JSON.stringify(password)).toBe(JSON.stringify(PASSWORD));
    });

    test('decrypt with ViewConfiguration (stars)', () => {

        const cipher = new Crypt("12345");

        const password = PASSWORD.clone();

        password.encrypt(cipher);

        password.decrypt(cipher, new ViewConfiguration({
            showUserName: false,
            showPassword : false,
            showPasswordScore : false
        }));

        expect(password.userName).toMatch(/\*+/);
        expect(password.password).toMatch(/\*+/);

    });

    test('decrypt with ViewConfiguration (plain text)', () => {

        const cipher = new Crypt("12345");

        const password = PASSWORD.clone();

        password.encrypt(cipher);

        password.decrypt(cipher, new ViewConfiguration({
            showUserName: true,
            showPassword : true,
            showPasswordScore : false
        }));

        expect(password.userName).toMatch(PASSWORD.userName);
        expect(password.password).toMatch(PASSWORD.password);
    });


});

