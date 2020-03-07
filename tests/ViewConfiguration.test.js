import ViewConfiguration from "../src/components/Basic/Types/ViewConfiguration";

describe("ViewConfiguration tests", () => {

    const VIEW_CFG = new ViewConfiguration({
        showUserName: false,
        showPassword : false,
        showPasswordScore : false,
        showLastChange : false
    });

    test('create', () => {

        const cfg1 = new ViewConfiguration({
            showUserName: true,
            showPassword : true,
            showPasswordScore : true,
            showLastChange : true
        });

        expect(cfg1.showUserName).toBe(true);
        expect(cfg1.showPassword).toBe(true);
        expect(cfg1.showPasswordScore).toBe(true);
        expect(cfg1.showLastChange).toBe(true);

        const cfg2 = new ViewConfiguration({
            showUserName: false,
            showPassword : false,
            showPasswordScore : false,
            showLastChange : false
        });

        expect(cfg2.showUserName).toBe(false);
        expect(cfg2.showPassword).toBe(false);
        expect(cfg2.showPasswordScore).toBe(false);
        expect(cfg2.showLastChange).toBe(false);

    });

    test('apply', () => {

        const cloned = VIEW_CFG.clone();

        cloned.apply({
            showUserName: true,
            showPassword : true,
            showPasswordScore : true
        });

        expect(cloned.showUserName).toBe(true);
        expect(cloned.showPassword).toBe(true);
        expect(cloned.showPasswordScore).toBe(true);
        expect(cloned.showLastChange).toBe(false);

    });

});

