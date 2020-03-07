import PasswordAnalyseResult from "./PasswordAnalyseResult";

/**
 *
 * @param password
 * @returns {PasswordAnalyseResult}
 */
export function calculateScore(password) {

    const result = new PasswordAnalyseResult();

    const blackListCleaned = removeBlackListed(password);
    const cleaned = blackListCleaned.password;

    let ignoredChars = password.length - cleaned.length;
    let countUC = 0, countLC = 0, countNr = 0;
    let countRepeatChars;
    let countSymbols            = 0;
    let countNrOrSymInTheMiddle = 0;
    let countRequirements       = 0;
    let countConsecutiveLC      = 0;
    let countConsecutiveUC      = 0;
    let countConsecutiveNr      = 0;

    const length          = cleaned.length;
    const minPwLength     = 8; // req1
    const minRequirements = 4;
    const uniqueChars     = new Set();

    for (let i = 0; i < length; i++) {
        let ch = cleaned.charAt(i);

        uniqueChars.add(ch);

        let lastChar = i === length - 1;

        if (isUpperCase(ch)) { // req2
            countUC++;
            if (!lastChar && isUpperCase(cleaned.charAt(i + 1))) {
                countConsecutiveUC++;
            }
        } else if (isLowerCase(ch)) { // req3
            countLC++;
            if (!lastChar && isLowerCase(cleaned.charAt(i + 1))) {
                countConsecutiveLC++;
            }
        } else if (isDigit(ch)) { // req4
            countNr++;
            if (i > 0 && i < length - 1) {
                countNrOrSymInTheMiddle++;
            }
            if (!lastChar && isDigit(cleaned.charAt(i + 1))) {
                countConsecutiveNr++;
            }
        } else if (!isLetterOrDigit(ch) && !isWhitespace(ch)) { // req5
            countSymbols++;
            if (i > 0 && i < length - 1) {
                countNrOrSymInTheMiddle++;
            }
        }
    }

    countRepeatChars = length - uniqueChars.size;

    result.countAllChars = password.length;
    result.countIgnoredChars = ignoredChars;
    result.countRepeatChars = countRepeatChars;
    result.countUC = countUC;
    result.countLC = countLC;
    result.countNr = countNr;
    result.countSym = countSymbols;
    result.countConsecutiveLC = countConsecutiveLC;
    result.countConsecutiveUC = countConsecutiveUC;
    result.countConsecutiveNr = countConsecutiveNr;
    result.countNrOrSymInTheMiddle = countNrOrSymInTheMiddle;
    result.blackListedStrings = blackListCleaned.blackListed;

    // Gesamtanzahl
    if (length >= minPwLength) {
        countRequirements++;
    }

    // 10 -> 4 ...
    //  9 -> 4
    //  8 -> 3
    //  7 -> 2
    //  6 -> 1
    //  5 -> 0
    //  4 -> 0 ...

    const bonusCharsCountMultiplicator = Math.min(Math.abs(5 - length), 4);
    result.bonusCharsCount = length * bonusCharsCountMultiplicator;

    // GrossBuchstaben
    if (countUC > 0) {
        countRequirements++;
        result.bonusUC = (length - countUC) * 2;
    }

    // Kleinbuchstaben
    if (countLC > 0) {
        countRequirements++;
        result.bonusLC = (length - countLC) * 2;
    }

    // Sonderzeichen
    if (countSymbols > 0) {
        countRequirements++;
        if (countUC > 0 || countLC > 0) {
            result.bonusSymbols = countSymbols * 6;
        }
    }

    // Nummern
    if (countNr > 0) {
        countRequirements++;
        if (countUC > 0 || countLC > 0) {
            result.bonusNr = countNr * 4;
        }
    }

    // Nummer oder Sonderzeichen in der Mitte des Passwortes
    if (countNrOrSymInTheMiddle > 0) {
        result.bonusSymbolsOrNrInTheMiddle = countNrOrSymInTheMiddle * 2;
    }

    // Anforderungen
    if (countRequirements >= minRequirements) {
        result.bonusMinRequirements = countRequirements * 2;
    }

    //
    // ABZUEGE
    //

    // Nur Klein- oder Grossbuchstaben
    if ((countLC > 0 || countUC > 0) && countNr === 0 && countSymbols === 0) {
        result.penaltyLettersOnly = length;
    }

    // Nur Zahlen
    if (countNr > 0 && countLC === 0 && countUC === 0 && countSymbols === 0) {
        result.penaltyNumbersOnly = length * 2;
    }

    // Mehrere Kleinbuchstaben hintereinander
    if (countConsecutiveLC > 0) {
        result.penaltyConsecutiveLC = countConsecutiveLC * 2;
    }

    // Mehrere Grossbuchstaben hintereinander
    if (countConsecutiveUC > 0) {
        result.penaltyConsecutiveUC = countConsecutiveUC * 2;
    }
    // Mehrere Zahlen hintereinander
    if (countConsecutiveNr > 0) {
        result.penaltyConsecutiveNr = countConsecutiveNr * 2;
    }
    // Zeichen die mehrmals vorkommen
    if (countRepeatChars > 0) {
        result.penaltyRepeatChars =  Math.round(Math.abs(length / (countRepeatChars)));
    }

    result.countFulfilledRequirements = countRequirements;

    return result; //
}

//


function removeBlackListed(pw) {

    // https://en.wikipedia.org/wiki/List_of_the_most_common_passwords
    const BLACK_LISTED = [
        "zxcvbnm",      "zaq1zaq1",     "yamaha",       "whatever",     "welcome",      "trustno1",
        "suzuki",       "superman",     "sunshine",     "starwars",     "solo",         "shadow",
        "qwertyuiop",   "qwerty123",    "qwerty",       "qazwsx",       "princess",     "photoshop",
        "password1",    "password",     "passw0rd",     "ninja",        "mynoob",       "mustang",
        "monkey",       "michael",      "master",       "loveme",       "login",        "letmein",
        "jesus",        "iloveyou",     "ilovekimora",  "hottie",       "honda",        "hello",
        "google",       "freedom",      "football",     "flower",       "dragon",       "donald",
        "charlie",      "batman",       "baseball",     "bailey",       "azerty",       "ashley",
        "adobe123",     "admin",        "access",       "abc123",       "aa123456",     "Tafuna123",
        "Superman2231", "Qwertyuiop",   "POGI",         "Monkey",       "Iloveyou",     "Football",
        "Dragon",       "BEBE",         "987654321",    "7777777",      "696969",       "666666",
        "654321",       "555555",       "3rjs1la7qe",   "1qaz2wsx",     "1q2w3e4r5t",   "1q2w3e4r",
        "1q2w3e",       "18atcskd2w",   "123qwe",       "123456790",    "1234567890",   "123456789",
        "12345678",     "1234567",      "123456",       "12345",        "1234",         "123321",
        "123123",       "123",          "121212",       "1111111",      "111111",       "000000",
        "!@#$%^&*",     "Test",         "test",         "qwert"
    ];

    let removed = [];

    for(let i = 0; i < BLACK_LISTED.length; i++){
        let temp = pw.replace(new RegExp(BLACK_LISTED[i], 'g'), '');

        if(pw.length !== temp.length){
            removed.push(BLACK_LISTED[i]);
        }

        pw = temp;

        if(pw.length === 0){
            break;
        }
    }

    return {
        password: pw,
        blackListed: removed
    };
}

function isUpperCase( ch ){
    return ch !== ch.toLowerCase();
}

function isLowerCase( ch ){
    return ch !== ch.toUpperCase();
}

function isDigit( ch ){
    return !isNaN(ch);
}

function isWhitespace(ch) {
    return ch === ' ';
}

function isLetterOrDigit(ch) {
    const CHARS_UP_LC_NR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return CHARS_UP_LC_NR.indexOf(ch) >= 0;
}
