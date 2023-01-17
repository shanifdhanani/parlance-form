import CryptoJS from "crypto-js";
const { GoogleSpreadsheet } = require('google-spreadsheet');

const k = "9[nU>eXM/Pue7UR3!bMt!bf8]]^r6,erzX(";
const decrypt = (text) => {
    const bytes = CryptoJS.AES.decrypt(text, k);
    const data = bytes.toString(CryptoJS.enc.Utf8);
    return data;
};

// Normally, sensitive data like this would be sent from the backend to the frontend, however because we aren't using a backend, we have to keep them in the JS files themselves. For now, we've simply encrypted them. It's okay if they're discovered by others though, because they simply provide access to the Google sheets form.
const encryptedSheetId = "U2FsdGVkX1+4vc2dThx1UNsAekJCi3AIPZOCPBstlyPeGQibUkwBw++y2GdYVl3Sp3WgtUE5k4TIAux/+gWT5w=="
const encryptedServiceAccountEmail = "U2FsdGVkX1/XbX/+xIzP92xBdI20ifxqgQCkDORLZN6fT8KIwqMbGVhokpaYs/3O/oDhJWeKYzwTCZHcSQQrT+Zie9MnWeAN1O6fGuQXv9o=";
const encryptedPrivateKey = "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"
const document = new GoogleSpreadsheet(decrypt(encryptedSheetId));
const TitleForAnswersSheet = "Responses";
const TitleForStepsSheet = "Steps";

class GoogleSheetsService {
    static getQuestions = async (callback) => {
        try {
            await this.loadSheet();
            const sheet = document.sheetsByTitle[TitleForStepsSheet];
            const questionRows = await sheet.getRows();

            for (const row of questionRows) {
                if (row.heading === "") {
                    row.heading = null;
                }

                if (row.prompt === "") {
                    row.prompt = null;
                }

                if (row.prompt && row.prompt.startsWith("'")) {
                    row.prompt = row.prompt.substring(1);
                }

                if (row.answerType === "") {
                    row.answerType = null;
                }

                if (row.acceptableValues === "") {
                    row.acceptableValues = null;
                }

                if (row.acceptableValues) {
                    row.acceptableValues = row.acceptableValues.split(",");
                    for (let index = 0; index < row.acceptableValues.length; index++) {
                        row.acceptableValues[index] = row.acceptableValues[index].trim();
                    }
                }

                if (row.formula === "") {
                    row.formula = "";
                }

                if (row.formula && row.formula.startsWith("'")) {
                    row.formula = row.formula.substring(1)
                }
            }

            callback(questionRows);
        }
        catch(ex) {
            console.log("Error getting questions");
            console.log(ex);
            return null;
        }
    }

    static submitAnswers = async (answers, callback) => {
        try {
            await this.#initializeResponsesSheetIfNeeded(answers);
            await this.loadSheet();
            const sheet = document.sheetsByTitle[TitleForAnswersSheet];
            const newRow = await sheet.addRows([Object.fromEntries(answers)]);
            callback(true);
        }
        catch(ex) {
            console.log("Error saving to Google");
            console.log(ex);
            callback(false);
        }
    }

    static #initializeResponsesSheetIfNeeded = async (answers) => {
        await this.loadSheet();
        const sheet = document.sheetsByTitle[TitleForAnswersSheet];
        await this.#setUpHeadersIfNeeded(answers, sheet);
        await this.#addNewHeadersIfNeeded(answers, sheet);
    }

    static #setUpHeadersIfNeeded = async (answers, sheet) => {
        try {
            const rows = await sheet.getRows();
        }
        catch(ex) {
            if (ex.message.indexOf("No values in the header row") >= 0) {
                let columnHeaders = Array.from(answers.keys());
                await sheet.resize({rowCount: 1000, columnCount: columnHeaders.length});
                await sheet.setHeaderRow(columnHeaders);
            }
        }
    }

    static #addNewHeadersIfNeeded = async (answers, sheet) => {
        let respondedValues = Array.from(answers.keys());
        let newValues = respondedValues.filter(value => !sheet.headerValues.includes(value));
        if (!newValues || newValues.length == 0) {
            return;
        }

        await sheet.resize({rowCount: sheet.rowCount, columnCount: sheet.columnCount + newValues.length});
        await sheet.setHeaderRow(sheet.headerValues.concat(newValues));
    }

    static loadSheet = async () => {
        await document.useServiceAccountAuth({
          client_email: decrypt(encryptedServiceAccountEmail), // Alternative: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: decrypt(encryptedPrivateKey) // Alternative: process.env.GOOGLE_PRIVATE_KEY,
        });

        await document.loadInfo();
    }
}

export default GoogleSheetsService;