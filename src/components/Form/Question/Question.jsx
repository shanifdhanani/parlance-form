import "./Question.css"
import {forwardRef, useEffect, useState} from "react";
import InterstitialScreen from "../InterstitialScreen/InterstitialScreen";
import TextAnswer from "../Answers/TextAnswer/TextAnswer";
import {AnswerType} from "../../../utility/Forms/AnswerType";
import {SlideDirection} from "../../../utility/Forms/SlideDirection";
import ListAnswer from "../Answers/ListAnswer/ListAnswer";
import ContinueButton from "../ContinueButton/ContinueButton";
import {ValidationFormat} from "../../../utility/Forms/ValidationFormat";
import SelectAnswer from "../Answers/SelectAnswer/SelectAnswer";
import DateAnswer from "../Answers/DateAnswer/DateAnswer";
import FormulaParser from "../../../utility/Forms/FormulaParser";

const Question = forwardRef((props, forwardedRef) => {

    const [answers, setAnswers] = useState(props.answers);
    const [invalidAnswerSubmitted, setInvalidAnswerSubmitted] = useState(props.invalidAnswerSubmitted);
    const [slideDirection, setSlideDirection] = useState(props.slideDirection);

    const interpolationRegex = /[^{\}]+(?=})/g;

    useEffect(() => {
        setAnswers(props.answers);
        setSlideDirection(props.slideDirection);
        if (invalidAnswerSubmitted !== props.invalidAnswerSubmitted) {
            setInvalidAnswerSubmitted(props.invalidAnswerSubmitted);
        }
    }, [props.answers, props.slideDirection, props.invalidAnswerSubmitted])

    function renderAnswer() {
        switch(props.data.answerType) {
            case AnswerType.Text: return <TextAnswer {...props} interpolate={interpolate} />;
            case AnswerType.List: return <ListAnswer {...props} />;
            case AnswerType.Select: return <SelectAnswer {...props} />;
            case AnswerType.Date: return <DateAnswer {...props} />;
            default: return null;
        }
    }

    function replaceWithValue(variableName, entireString) {
        let keyToReplace = "{" + variableName + "}";
        let valueToReplace = answers[variableName];
        if (!valueToReplace) {
            return entireString;
        }
        return entireString.replaceAll(keyToReplace, valueToReplace)
    }

    function interpolate(text) {
        if (!text) {
            return text;
        }

        let interpolatedText = text;
        let matches = text.match(interpolationRegex);

        if (!matches) {
            return text;
        }

        for (const match of matches) {
            interpolatedText = replaceWithValue(match, interpolatedText);
        }
        return interpolatedText;
    }

    function getValidationMessage() {
        if (props.data.validationFormat === ValidationFormat.Email) {
            return "Hmm... that doesn't look like an email address";
        }
        else if (props.data.validationFormat === ValidationFormat.PhoneNumber) {
            return "Hmm... that doesn't look like a phone number"
        }
        else if (props.data.validationFormat === ValidationFormat.ZipCode) {
            return "Hmm... that doesn't look like a zip code"
        }
        else if (props.data.validationFormat === ValidationFormat.Currency) {
            return "Hmm, that doesn't look like a real amount"
        }
        else {
            return "Please provide a valid answer";
        }
    }

    function renderValidationError() {
        return <div className="validation-warning" role="alert">
            {getValidationMessage()}
        </div>
    }

    function getPrompt() {
        if (props.data.prompt.startsWith("=")) {
            return FormulaParser.executeFormula(props.data.prompt, answers);
        }
        else {
            return interpolate(props.data.prompt);
        }
    }

    function renderQuestion() {
        return <div ref={forwardedRef} data-testid={props.data.name} className={`full-screen-question ${slideDirection === SlideDirection.Up ? "slide-up-from-bottom" : "slide-down-from-top"}`}>
            <div className={"question-content"}>
                <p className={"question-number-and-prompt"}>
                    {<span className={"question-number"}>{props.questionDisplayNumber}.</span>}
                    <span className={"question-prompt"}>{getPrompt()} {props.data.required ? "*" : null}</span>
                </p>
                {renderAnswer()}
                <div className={"flex-row continue-button-wrapper"}>
                    {invalidAnswerSubmitted
                        ? renderValidationError()
                        : <ContinueButton {...props} showPressEnterMessage={props.data.answerType === AnswerType.Text ? true : false} />}
                </div>
            </div>
        </div>
    }

    if (props.data.heading) {
        return <InterstitialScreen ref={forwardedRef} {...props} />
    }
    else {
        return renderQuestion()
    }
});

export default Question;