import AnswerValidator from "../../AnswerValidator";
import {Steps} from "../../../../data/steps";

describe("Answer Validator", () => {
    it("should let the welcome screen pass", () => {
        let question = Steps[0];
        let answer = null;
        expect(AnswerValidator.isAnswerValid(question, answer)).toBeTruthy();
    })

    it("should allow valid text answers to pass", () => {
        let question = Steps[1];
        let answer = "John";
        expect(AnswerValidator.isAnswerValid(question, answer)).toBeTruthy();
    })

    it("should invalidate empty strings for required text answers", () => {
        let question = Steps[1];
        let answer = "";
        expect(AnswerValidator.isAnswerValid(question, answer)).toBeFalsy();
    })

    it("should invalidate bad emails", () => {
        let question = Steps[3];
        let answer = "asdf";
        expect(AnswerValidator.isAnswerValid(question, answer)).toBeFalsy();
    })

    it("should validate good emails", () => {
        let question = Steps[3];
        let answer = "john.doe@gmail.com";
        expect(AnswerValidator.isAnswerValid(question, answer)).toBeTruthy();
    })

    it("should invalidate bad phone numbers", () => {
        let question = Steps[4];
        let answer = "asdf";
        expect(AnswerValidator.isAnswerValid(question, answer)).toBeFalsy();
    })

    it("should validate good phone numbers", () => {
        let question = Steps[4];
        let answer = "+1-145-472-8602";
        expect(AnswerValidator.isAnswerValid(question, answer)).toBeTruthy();

        answer = "862-104-1855";
        expect(AnswerValidator.isAnswerValid(question, answer)).toBeTruthy();
    })

    it("should invalidate bad zip codes", () => {
        let question = Steps[6];
        let answer = "asdf";
        expect(AnswerValidator.isAnswerValid(question, answer)).toBeFalsy();
    })

    it("should validate good zip codes", () => {
        let question = Steps[6];
        let answer = "27392";
        expect(AnswerValidator.isAnswerValid(question, answer)).toBeTruthy();
    })
})