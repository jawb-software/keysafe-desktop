import {calculateScore} from "./pwanalyse";
import {CHARS_SPECIAL} from "../consts";
import PasswordGeneratorConfiguration from "../Types/PasswordGeneratorConfiguration";
import Crypt from "../../DataBase/Security/Crypt";

//
// @options {
//      upperCase : true,
//      lowerCase : true,
//      digits : true,
//      symbols : true,
//      length: 8,
//      minScore: 60
// }
/**
 *
 * @param cfg {PasswordGeneratorConfiguration}
 * @returns {string}
 */
export function generatePassword(cfg) {
    // console.log('generatePassword', cfg);

    if(!cfg){
        cfg = new PasswordGeneratorConfiguration();
    }

    const requiredMinScore = cfg.requiredMinScore();
    const requiredLength   = cfg.requiredLength();

    // console.log(cfg);

    const MIN_SCORE = requiredMinScore > 0 ? requiredMinScore : calculateDefaultMinScoreForPasswordLength(requiredLength);
    const MAX_TRIES = 41; // nicht unendlich lange ausprobieren...

    let password;
    let analyseResult;
    let tryNr = 0;
    let bestPasswordSoFar = {
        password: '',
        score: -1
    };

    do {

        // erzeuge random passwort
        password = createPassword(cfg);
        // console.log(password);

        // kalkuliere Stärke
        analyseResult = calculateScore(password);

        const score = analyseResult.score();

        const lcOK    = !cfg.isLCEnabled() || analyseResult.countLC > 0;
        const ucOK    = !cfg.isUCEnabled() || analyseResult.countUC > 0;
        const nrOK    = !cfg.isNrEnabled() || analyseResult.countNr > 0;
        const syOK    = !cfg.isSymEnabled() || analyseResult.countSym > 0;
        const scoreOK = score >= MIN_SCORE;

        if(lcOK && ucOK && nrOK && syOK && scoreOK){
            // console.log("try Nr: " + tryNr + ". Password found with score: " + score + " vs MIN_SCORE: " + MIN_SCORE);
            return password;
        }

        if(bestPasswordSoFar.score < score){
            bestPasswordSoFar.score = score;
            bestPasswordSoFar.password = password;
        }

    } while(tryNr++ < MAX_TRIES);

    // console.log('too much tries (' + tryNr + '). using best solution...');
    return bestPasswordSoFar.password;
}

/**
 *
 * @param cfg {PasswordGeneratorConfiguration}
 * @returns {string}
 */
function createPassword(cfg) {

    let password = '';

    const chars = cfg.chars();
    const requiredLength = cfg.requiredLength();

    let i = 0;
    let prevIsSymbol = false;

    if(chars.length === 0){
        throw new Error('No chars available');
    }

    do {

        const j  = Crypt.random_number(0, chars.length);
        const ch = chars.charAt(j);

        if(CHARS_SPECIAL.includes(ch)){ // Symbol?
            if(prevIsSymbol || i === 0 || i === requiredLength - 1){
                // ignoriere symbole am Anfang, am Ende und vermeide aufeinander folgende Symbole
                continue;
            }
            prevIsSymbol = true;
        } else {
            prevIsSymbol = false;
        }

        password += ch;
        i++;


    } while (password.length < requiredLength);

    return password;
}


function calculateDefaultMinScoreForPasswordLength(passwordLength) {

    if(passwordLength < 4){ // 1,2,3
        return 20;
    } else if (passwordLength <= 6){ // 4,5,6
        return 50;
    } else if (passwordLength <= 8 ) {
        return 60;
    }

    return 70;
}
