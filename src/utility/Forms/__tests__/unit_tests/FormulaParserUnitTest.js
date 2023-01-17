import FormulaParser from "../../FormulaParser";
import HyperFormula from "hyperformula";
import {customDatePrinter, customParseDate} from "../../MomentAdapter";

describe("Formula Parser", () => {
    it("should calculate the year of a date properly", () => {
        let formula = "=YEAR({D})";
        let data = {"D": "2009-01-01"};
        expect(FormulaParser.executeFormula(formula, data)).toBe(2009);
    });

    it("should calculate IF statements properly", () => {
        let previousAnswer = {"Date Of Birth": "1965-03-01"};
        let formula = "=IF(YEAR({Date Of Birth}) = 1965, \"Yes\", \"No\")"
        expect(FormulaParser.executeFormula(formula, previousAnswer)).toBe("Yes");
    });

    it("should set variables properly", () => {
        let previousAnswer = {"Date Of Birth": "1965-03-01"};
        let formula = "=IF(YEAR({Date Of Birth}) <= 1964, 56, IF(YEAR({Date Of Birth}) <= 1965, 56.167, IF(YEAR({Date Of Birth}) <= 1966, 56.333, IF(YEAR({Date Of Birth}) <= 1967, 56.5, IF(YEAR({Date Of Birth}) <= 1968, 56.667, IF(YEAR({Date Of Birth}) <= 1969, 56.833, 57))))))"
        let minimumRetirementAge = FormulaParser.executeFormula(formula, previousAnswer);
        expect(minimumRetirementAge).toBe(56.167)
    });

    it("should display dates with a proper format", () => {
        let data = [
            ["02/10/2010"],
            ["01/04/1999"],
            ["01/03/1999"],
            ["05/11/2000"],
            ['=TEXT(MIN(A1, A2, A3, A4), "MM/DD/YYYY")']
        ]

        let hfInstance = HyperFormula.buildFromArray(data, {licenseKey: "gpl-v3", dateFormats: ['MM/DD/YYYY', "YYYY-MM-DD"]});
        let returnedValue = hfInstance.getCellValue({sheet: 0, row: 4, col: 0});
        expect(returnedValue).toBe("01/03/1999")
    });
});