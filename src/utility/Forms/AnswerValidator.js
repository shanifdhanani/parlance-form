import {ValidationFormat} from "./ValidationFormat";

class AnswerValidator {
    static isAnswerValid = (question, answer) => {
        if (!question) {
            return false;
        }

        if (question.required && (!answer || answer === "")) {
            return false;
        }

        if (question.validationFormat === ValidationFormat.Email && answer && answer !== "") {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(answer)
        }

        if (question.validationFormat === ValidationFormat.PhoneNumber && answer && answer !== "") {
            let re = /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g;
            return re.test(answer);
        }

        if ((question.validationFormat === ValidationFormat.ZipCode) && answer && answer !== "") {
            let re = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
            return re.test(answer);
        }

        if ((question.validationFormat === ValidationFormat.Currency || question.validationFormat === ValidationFormat.Number) && answer && answer !== "") {
            if (typeof answer === "number") {
                return true;
            }

            let reg = /^\d+$/;
            return reg.test(answer);
        }

        return true;
    }
}

export default AnswerValidator;