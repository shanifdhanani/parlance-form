import {InputAdornment, TextField} from "@mui/material";
import "./TextAnswer.css"
import {useEffect, useState} from "react";
import {ValidationFormat} from "../../../../utility/Forms/ValidationFormat";
import { NumericFormat } from "react-number-format";

const TextAnswer = (props) => {
    const [existingAnswerValue, setExistingAnswerValue] = useState(props.existingAnswerValue);
    const [invalidAnswerSubmitted, setInvalidAnswerSubmitted] = useState(props.invalidAnswerSubmitted);
    const [answer, setAnswer] = useState(props.existingAnswerValue);
    const [didSubmitAnswer, setDidSubmitAnswer] = useState(props.didSubmitAnswer);
    const [previouslySubmittedAnswer, setPreviouslySubmittedAnswer] = useState(props.existingAnswerValue);

    // Set the default value as the answer if no other answer has been provided
    useEffect(() => {
        if (props.data.defaultValue && !answer) {
            let defaultAnswer = props.interpolate(props.data.defaultValue);
            if (props.data.validationFormat === ValidationFormat.Currency || props.data.validationFormat === ValidationFormat.Number) {
                defaultAnswer = defaultAnswer.replaceAll(",", "");
                defaultAnswer = defaultAnswer.replaceAll("$", "");
                defaultAnswer = Number(defaultAnswer)
            }
            setAnswer(defaultAnswer);
        }
    }, [])

    useEffect(() => {
        if (invalidAnswerSubmitted !== props.invalidAnswerSubmitted) {
            setInvalidAnswerSubmitted(props.invalidAnswerSubmitted);
            setDidSubmitAnswer(false);
        }

        if (existingAnswerValue !== props.existingAnswerValue) {
            setExistingAnswerValue(props.existingAnswerValue);
        }

        if (didSubmitAnswer !== props.didSubmitAnswer) {
            setDidSubmitAnswer(props.didSubmitAnswer);
        }
    }, [props.invalidAnswerSubmitted, props.existingAnswerValue, props.didSubmitAnswer])

    useEffect(() => {
        if (previouslySubmittedAnswer !== answer || didSubmitAnswer) {
            props.setAnswer(props.data.id, answer, didSubmitAnswer);
            setPreviouslySubmittedAnswer(answer)
        }
    }, [answer, didSubmitAnswer])

    function checkForSubmittedAnswerOrNewAnswerBeingTyped(event) {
        if (event.target.value !== answer) {
            let answer = event.target.value;
            if (props.data.validationFormat === ValidationFormat.Currency || props.data.validationFormat === ValidationFormat.Number) {
                answer = answer.replaceAll(",", "");
                answer = Number(answer)
            }
            setAnswer(answer);
        }
        if (event.key.toLowerCase() === "enter") {
            setDidSubmitAnswer(true);
        }
    }

    function getPlaceholder() {
        if (props.placeholder) {
            return props.placeholder;
        }

        if (props.data.placeholder) {
            return props.data.placeholder;
        }

        switch (props.data.validationFormat) {
            case ValidationFormat.Email: return "name@company.com";
            case ValidationFormat.PhoneNumber: return "555-555-5555";
            case ValidationFormat.ZipCode: return "12345";
            case ValidationFormat.Currency: return "123,456";
            case ValidationFormat.Number: return "100";
            default: return "Type your answer here...";
        }
    }

    function getInputType() {
        switch (props.data.validationFormat) {
            case ValidationFormat.Email: return "email";
            case ValidationFormat.PhoneNumber: return "tel";
            case ValidationFormat.ZipCode: return "text";
            // Because we are using NumericFormat, we do not want to use the built-in "number" type here
            case ValidationFormat.Currency: return "text";
            case ValidationFormat.Number: return "text";
            default: return "text";
        }
    }

    return <div className={"text-answer"}>
        {props.data.validationFormat === ValidationFormat.Currency || props.data.validationFormat === ValidationFormat.Number
            ? <NumericFormat
                value={answer}
                customInput={TextField}
                thousandSeparator=","
                decimalSeparator="."
                autoFocus
                className={`text-input-answer`}
                placeholder={getPlaceholder()}
                variant={props.variant || "standard"}
                onKeyUp={checkForSubmittedAnswerOrNewAnswerBeingTyped}
                defaultValue={existingAnswerValue || props.interpolate(props.data.defaultValue)}
                name={props.data.name}
                type={getInputType()}
                error={invalidAnswerSubmitted}
                InputProps={props.data.validationFormat === ValidationFormat.Currency
                    ? {startAdornment: (<InputAdornment position="start">{props.currencySymbol || "$"}</InputAdornment>)}
                    : null}
            />
            : <TextField
                autoFocus
                className={`text-input-answer ${props.data.validationFormat === ValidationFormat.Currency ? "align-right" : ""}`}
                placeholder={getPlaceholder()}
                variant={props.variant || "standard"}
                onKeyUp={checkForSubmittedAnswerOrNewAnswerBeingTyped}
                defaultValue={existingAnswerValue}
                name={props.data.name}
                type={getInputType()}
                error={invalidAnswerSubmitted}
            />
        }
    </div>
}

export default TextAnswer;