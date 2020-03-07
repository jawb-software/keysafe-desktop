import React from 'react';

import '../UIBaseDialog.css';
import './UIPasswordScoreView.css';
import I18n from "../../../Basic/I18n/i18n";

class UIPasswordScoreView extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     //
    // }

    handleCancelClick() {
    }

    render() {

        const textBonusSection              = I18n.passwordScore_SectionBonus();
        const textPwLength                  = I18n.passwordScore_PwLength();
        const textUpperCaseChars            = I18n.passwordScore_UpperCases();
        const textLowerCaseChars            = I18n.passwordScore_LowerCases();
        const textDigits                    = I18n.passwordScore_Digits();
        const textSymbols                   = I18n.passwordScore_Symbols();
        const textDigitsSymbolsInTheMiddle  = I18n.passwordScore_DigitsOrSymbolsInTheMiddle();
        const textMinRequirements           = I18n.passwordScore_MinRequirements();

        const textPenaltySection             = I18n.passwordScore_SectionPenalty();
        const textPenaltyLettersOrDigitsOnly = I18n.passwordScore_DigitsOrLettersOnly();
        const textPenaltyConsecutiveLC       = I18n.passwordScore_consecutiveLC();
        const textPenaltyConsecutiveUC       = I18n.passwordScore_consecutiveUP();
        const textPenaltyConsecutiveNr       = I18n.passwordScore_consecutiveDigits();
        const textPenaltyRepeatChars         = I18n.passwordScore_RepeatChars();

        const textScore  = I18n.passwordScore_PwScoreSum();

        const result = this.props.score;
        const score  = result.score();

        const lettersOrDigitsOnlySum = result.penaltyLettersOnly + result.penaltyNumbersOnly;

        return (
            <div className="UIPasswordScoreView">
                <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                    <thead>
                    <tr>
                        <th className="mdl-data-table__cell--non-numeric">{textBonusSection}</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="mdl-data-table__cell--non-numeric">{textPwLength}</td>
                        <td> <span className="stats">{result.countAllChars - result.countIgnoredChars} </span> </td>
                        <td>{result.bonusCharsCount > 0 ? <span className="green">+ {result.bonusCharsCount}</span> : <span className="warn">0</span>}</td>
                    </tr>
                    <tr>
                        <td className="mdl-data-table__cell--non-numeric">{textUpperCaseChars}</td>
                        <td> <span className="stats">{result.countUC}</span></td>
                        <td>{result.bonusUC > 0 ? <span className="green">+ {result.bonusUC}</span> : <span className="warn">0</span>}</td>
                    </tr>
                    <tr>
                        <td className="mdl-data-table__cell--non-numeric">{textLowerCaseChars}</td>
                        <td> <span className="stats">{result.countLC}</span></td>
                        <td>{result.bonusLC > 0 ? <span className="green">+ {result.bonusLC}</span> : <span className="warn">0</span>}</td>
                    </tr>
                    <tr>
                        <td className="mdl-data-table__cell--non-numeric">{textDigits}</td>
                        <td> <span className="stats">{result.countNr}</span></td>
                        <td>{result.bonusNr > 0 ? <span className="green">+ {result.bonusNr}</span> : <span className="warn">0</span>}</td>
                    </tr>
                    <tr>
                        <td className="mdl-data-table__cell--non-numeric">{textSymbols}</td>
                        <td> <span className="stats">{result.countSym}</span></td>
                        <td>{result.bonusSymbols > 0 ? <span className="green">+ {result.bonusSymbols}</span> : <span className="warn">0</span>}</td>
                    </tr>
                    <tr>
                        <td className="mdl-data-table__cell--non-numeric">{textDigitsSymbolsInTheMiddle}</td>
                        <td> <span className="stats">{result.countNrOrSymInTheMiddle}</span></td>
                        <td>{result.bonusSymbolsOrNrInTheMiddle > 0 ? <span className="green">+ {result.bonusSymbolsOrNrInTheMiddle}</span> : <span className="warn">0</span>}</td>
                    </tr>
                    <tr>
                        <td className="mdl-data-table__cell--non-numeric">{textMinRequirements}</td>
                        <td> <span className="stats">{result.countFulfilledRequirements} </span></td>
                        <td>{result.bonusMinRequirements > 0 ? <span className="green">+ {result.bonusMinRequirements}</span> : <span className="warn">0</span>}</td>
                    </tr>
                    <tr>
                        <th className="mdl-data-table__cell--non-numeric">{textPenaltySection}</th>
                        <th></th>
                        <th></th>
                    </tr>
                    <tr>
                        <td className="mdl-data-table__cell--non-numeric">{textPenaltyConsecutiveUC}</td>
                        <td> <span className="stats">{result.countConsecutiveUC}</span></td>
                        <td>{result.penaltyConsecutiveUC > 0 ? <span className="red">- {result.penaltyConsecutiveUC}</span> : <span className="green">0</span>}</td>
                    </tr>

                        <tr>
                            <td className="mdl-data-table__cell--non-numeric">{textPenaltyConsecutiveLC}</td>
                            <td> <span className="stats">{result.countConsecutiveLC}</span></td>
                            <td>{result.penaltyConsecutiveLC > 0 ? <span className="red">- {result.penaltyConsecutiveLC}</span> : <span className="green">0</span>}</td>
                        </tr>
                        <tr>
                            <td className="mdl-data-table__cell--non-numeric">{textPenaltyConsecutiveNr}</td>
                            <td> <span className="stats">{result.countConsecutiveNr}</span></td>
                            <td>{result.penaltyConsecutiveNr > 0 ? <span className="red">- {result.penaltyConsecutiveNr}</span> : <span className="green">0</span>}</td>
                        </tr>

                        <tr>
                            <td className="mdl-data-table__cell--non-numeric">{textPenaltyLettersOrDigitsOnly}</td>
                            <td></td>
                            <td>{lettersOrDigitsOnlySum > 0 ? <span className="red">- {lettersOrDigitsOnlySum}</span> : <span className="green">0</span>}</td>
                        </tr>

                        <tr>
                            <td className="mdl-data-table__cell--non-numeric">{textPenaltyRepeatChars}</td>
                            <td> <span className="stats">{result.countRepeatChars}</span></td>
                            <td>{result.penaltyRepeatChars > 0 ? <span className="red">- {result.penaltyRepeatChars}</span> : <span className="green">0</span>}</td>
                        </tr>
                    <tr>
                        <td className="mdl-data-table__cell--non-numeric sum">{textScore}</td>
                        <td className="sum"></td>
                        <td className="sum">{score < 30
                            ? <span className="red">{score}</span>
                            : score < 60
                                ? <span className="warn">{score}</span>
                                : <span className="green">{score}</span>
                            }
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default UIPasswordScoreView;
