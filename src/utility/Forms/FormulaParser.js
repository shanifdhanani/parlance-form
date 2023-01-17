import HyperFormula from "hyperformula";
import {customParseDate} from "./MomentAdapter";
import {ToCurrency, ToCurrencyTranslations} from "../Hyperformula/ToCurrency";

const hfConfig = {licenseKey: "gpl-v3", dateFormats: ['MM/DD/YYYY', 'MM/DD/YY', "YYYY-MM-DD"], parseDateTime: customParseDate}
HyperFormula.registerFunctionPlugin(ToCurrency, ToCurrencyTranslations);

class FormulaParser {
    static interpolationRegex = /[^{\}]+(?=})/g;

    static getVariablesAndValues = (formula, previousAnswers) => {
        try {
            if (!formula) {
                return null;
            }

            // Get a list of all of the variables used
            let variableNames = formula.match(this.interpolationRegex);
            if (!variableNames) {
                return null;
            }

            let interpolatedVariables = {};
            for (let iterator = 0; iterator < variableNames.length; iterator++) {
                let variableName = variableNames[iterator];
                if (variableName in interpolatedVariables) {
                    continue;
                }

                let value = this.replaceWithValue(variableName, "{" + variableName + "}", previousAnswers);
                if (!value) {
                    value = "";
                }
                interpolatedVariables[variableName] = value;
            }

            return interpolatedVariables;
        }
        catch (ex) {
            console.log("Error getting variables and values for forula " + formula);
            return null;
        }
    }

    static executeFormula = (formula, previousAnswers) => {
        try {
            if (!formula) {
                return null;
            }

            let variablesRecorded = [];

            // Get a list of all of the variables used
            let variableNames = formula.match(this.interpolationRegex);
            if (!variableNames) {
                throw "No variables need to be interpreted"
            }

            // Create a column of data and take the user's formula and replace the variable names with cell references
            let interpolatedVariables = [];
            let formulaWithCellReferences = formula;

            for (let iterator = 0; iterator < variableNames.length; iterator++) {
                let variableName = variableNames[iterator];
                let value = this.replaceWithValue(variableName, "{" + variableName + "}", previousAnswers);
                if (!value) {
                    value = "";
                }
                variablesRecorded.push(variableName);
                interpolatedVariables.push([value]);
                formulaWithCellReferences = formulaWithCellReferences.replaceAll("{" + variableName + "}", "A" + (iterator + 1));
            }
            interpolatedVariables.push([formulaWithCellReferences.trim()])

            // Run the calculations and get the cell content
            const hfInstance = HyperFormula.buildFromArray(interpolatedVariables, hfConfig);
            return hfInstance.getCellValue({sheet: 0, row: interpolatedVariables.length - 1, col: 0});
        }
        catch (ex) {
            console.log("Error calculating formula " + formula);
            console.log(ex);
            return null;
        }
    }

    static replaceWithValue = (variableName, entireString, answers) => {
        let keyToReplace = "{" + variableName + "}";
        let valueToReplace = answers[variableName];

        if (/\d{4}-\d{2}-\d{2}/.test(valueToReplace)) {
            let array = valueToReplace.split("-");
            valueToReplace = array[1] + "/" + array[2] + "/" + array[0];
        }

        if (!valueToReplace) {
            return entireString;
        }
        return entireString.replaceAll(keyToReplace, valueToReplace)
    }
}

export default FormulaParser;