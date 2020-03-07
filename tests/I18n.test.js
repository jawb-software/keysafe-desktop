import {TEXT} from "../src/components/Basic/I18n/translations";

describe("I18n tests", () => {

    test('all translated', () => {

        for(let key in TEXT){

            const translations = TEXT[key];

            expect(translations['de']).not.toBeUndefined();
            expect(translations['en']).not.toBeUndefined();
        }

    });

    test('No EN in DE', () => {

        for(let key in TEXT){

            const translations = TEXT[key];

            const de = translations['de'];

            let text = de;

            if(typeof de !== 'string'){
                text = JSON.stringify(de);
            }

            expect(text).not.toContain('Password');
            expect(text).not.toContain('password');
            expect(text).not.toContain('Profile');
            expect(text).not.toContain('profile');
        }

    });

    test('No DE in EN', () => {

        for(let key in TEXT){

            const translations = TEXT[key];

            const de = translations['en'];

            let text = de;

            if(typeof de !== 'string'){
                text = JSON.stringify(de);
            }

            expect(text).not.toContain('Passwort');
            expect(text).not.toContain('passwort');
            expect(text).not.toContain('Profil ');
            expect(text).not.toContain('profil ');
        }

    });

});

