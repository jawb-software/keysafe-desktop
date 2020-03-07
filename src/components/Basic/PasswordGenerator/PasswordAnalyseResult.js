import PropTypes from "prop-types";
import Crypt from "../../DataBase/Security/Crypt";

const propTypes = {
    countAllChars: PropTypes.number,
    countIgnoredChars: PropTypes.number,
    countRepeatChars: PropTypes.number,
    countUC: PropTypes.number,
    countLC: PropTypes.number,
    countNr: PropTypes.number,
    countSym: PropTypes.number,
    countConsecutiveLC: PropTypes.number,
    countConsecutiveUC: PropTypes.number,
    countConsecutiveNr: PropTypes.number,
    countNrOrSymInTheMiddle: PropTypes.number,
    countFulfilledRequirements: PropTypes.number,
    blackListedStrings: PropTypes.array,

    bonusCharsCount: PropTypes.number,
    bonusUC: PropTypes.number,
    bonusLC: PropTypes.number,
    bonusNr: PropTypes.number,
    bonusSymbols: PropTypes.number,
    bonusSymbolsOrNrInTheMiddle: PropTypes.number,
    bonusMinRequirements: PropTypes.number,

    penaltyLettersOnly: PropTypes.number,
    penaltyNumbersOnly: PropTypes.number,
    penaltyConsecutiveLC: PropTypes.number,
    penaltyConsecutiveUC: PropTypes.number,
    penaltyConsecutiveNr: PropTypes.number,
    penaltyRepeatChars: PropTypes.number,
};

class PasswordAnalyseResult {

    constructor() {
        this.countAllChars = 0;
        this.countIgnoredChars = 0;
        this.countRepeatChars = 0;
        this.countUC = 0;
        this.countLC = 0;
        this.countNr = 0;
        this.countSym = 0;
        this.countConsecutiveLC = 0;
        this.countConsecutiveUC = 0;
        this.countConsecutiveNr = 0;
        this.coucountNrOrSymInTheMiddle = 0;
        this.countFulfilledRequirements = 0;
        this.blackListedStrings = [];

        this.bonusCharsCount = 0;
        this.bonusUC = 0;
        this.bonusLC = 0;
        this.bonusNr = 0;
        this.bonusSymbols = 0;
        this.bonusSymbolsOrNrInTheMiddle = 0;
        this.bonusMinRequirements = 0;

        this.penaltyLettersOnly = 0;
        this.penaltyNumbersOnly = 0;
        this.penaltyConsecutiveLC = 0;
        this.penaltyConsecutiveUC = 0;
        this.penaltyConsecutiveNr = 0;
        this.penaltyRepeatChars = 0;
    }

    penalty(){
        return this.penaltyLettersOnly + this.penaltyNumbersOnly + this.penaltyConsecutiveLC + this.penaltyConsecutiveUC + this.penaltyConsecutiveNr + this.penaltyRepeatChars;
    }

    score(){

        let sumBonus   = this.bonusCharsCount + this.bonusUC + this.bonusLC + this.bonusNr + this.bonusSymbols + this.bonusSymbolsOrNrInTheMiddle + this.bonusMinRequirements;
        let sumPenalty = this.penalty();

        let score = sumBonus - sumPenalty;
        return score < 0 ? 0 : score > 100 ? 100 : score;
    }


}

PasswordAnalyseResult.propTypes = propTypes;

export default PasswordAnalyseResult;
