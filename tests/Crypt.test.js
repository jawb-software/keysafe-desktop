import Crypt from "../src/components/DataBase/Security/Crypt";
import CryptError from "../src/components/Basic/Types/CryptError";
import {CHARS_LC, CHARS_NR, CHARS_SPECIAL, CHARS_UP} from "../src/components/Basic/consts";

describe("Crypt tests", () => {

    const ALL_CHARS = CHARS_UP +  CHARS_LC + CHARS_NR + CHARS_SPECIAL;

    test('encrypt, decrypt', () => {

        const cipher = new Crypt("12345");

        const encrypted = cipher.encrypt(ALL_CHARS);
        const decrypted = cipher.decrypt(encrypted);

        expect(decrypted).toBe(ALL_CHARS);

    });

    test('base64', () => {
        expect(Crypt.base64("EasyBase64")).toBe("RWFzeUJhc2U2NA==");
    });

    test('bad password', () => {

        const cipher1 = new Crypt("12345");
        const cipher2 = new Crypt("123456");

        const encrypted = cipher1.encrypt(ALL_CHARS);

        expect(() => {
            cipher2.decrypt(encrypted);
        }).toThrowError(CryptError);

    });

    test('clean', () => {

        const cipher = new Crypt("12345");

        const encrypted = cipher.encrypt(ALL_CHARS);

        expect(() => {
            cipher.clean();
            cipher.decrypt(encrypted);
        }).toThrowError(CryptError);

    });

    test('multiple encryption', () => {

        const cipher = new Crypt("12345");

        let toCrypt = ALL_CHARS;

        for(let i = 0; i < 10; i++){
            toCrypt = cipher.encrypt(toCrypt);
        }

        for(let i = 0; i < 10; i++){
            toCrypt = cipher.decrypt(toCrypt);
        }

        expect(toCrypt).toBe(ALL_CHARS);

    });

    test('compatibility', () => {

        const password     = "12345";
        const encryptedMsg = "M9Nw0F72PggRrIP0XV8fkau5fvNU98fI1qEuPnC+qok=#AGNqlt1u/MdgovVMarKpMQ==#oaivciC1gk6tyRo3BiSV5Q==";
        const expectedTxt  = "Test_3+%mFD*";

        const cipher = new Crypt(password);

        const decrypted = cipher.decrypt(encryptedMsg);

        expect(decrypted).toBe(expectedTxt);
    });

    test('compatibility no # - salt, iv data', ()=>{

        const encryptedText = "M9Nw0F72PggRrIP0XV8fkau5fvNU98fI1qEuPnC+qok=AGNqlt1u/MdgovVMarKpMQ==oaivciC1gk6tyRo3BiSV5Q==";

        const parts = new Array(3);
        parts[0] = encryptedText.substring(0, 44);
        parts[1] = encryptedText.substring(44, 68);
        parts[2] = encryptedText.substring(68, 92);

        expect(parts[0].length).toBe(44);
        expect(parts[1].length).toBe(24);
        expect(parts[2].length).toBe(24);

    });

    test('compatibility no #', () => {

        const password     = "12345";
        const encryptedMsg = "M9Nw0F72PggRrIP0XV8fkau5fvNU98fI1qEuPnC+qok=AGNqlt1u/MdgovVMarKpMQ==oaivciC1gk6tyRo3BiSV5Q==";
        const expectedTxt  = "Test_3+%mFD*";

        const cipher = new Crypt(password);

        const decrypted = cipher.decrypt(encryptedMsg);

        expect(decrypted).toBe(expectedTxt);
    });


    test('randomness', () => {

        const password     = "12345";

        const cipher = new Crypt(password);

        const encrypted1 = cipher.encrypt(ALL_CHARS);
        const encrypted2 = cipher.encrypt(ALL_CHARS);

        expect(encrypted1).not.toBe(encrypted2);
    });

    test('random numbers', () => {
        for(let i = 0; i < 100; i++){
            const number = Crypt.random_number(0, 10);
            expect(number).not.toBeGreaterThan(10);
            expect(number).not.toBeLessThan(0);
        }
    });

});

