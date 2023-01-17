import {forwardRef, useEffect, useState} from "react";
import FlatButton from "../../FlatButton/FlatButton";
import "./InterstitialScreen.css";
import {SlideDirection} from "../../../utility/Forms/SlideDirection";
import FormulaParser from "../../../utility/Forms/FormulaParser";
import {CircularProgress} from "@mui/material";

const InterstitialScreen = forwardRef((props, forwardedRef) => {
    const [slideDirection, setSlideDirection] = useState(props.slideDirection);
    const [answers, setAnswers] = useState(props.answers);
    const [wasFormSubmitted, setWasFormSubmitted] = useState(false);
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(props.loading);

    const interpolationRegex = /[^{\}]+(?=})/g;

    useEffect(() => {
        setSlideDirection(props.slideDirection);
        setAnswers(props.answers);
        setWasFormSubmitted(props.wasFormSubmitted)
        setShowLoadingIndicator(props.loading)
    }, [props.answers, props.slideDirection, props.wasFormSubmitted, props.loading])

    function getHeading() {
        if (props.isEndScreen) {
            if (!wasFormSubmitted) {
                return "All Done!";
            }
            else {
                return "👍";
            }
        }

        return props.data.heading
    }

    function getPrompt() {
        if (props.isEndScreen) {
            if (!wasFormSubmitted) {
                return props.endScreenPrompt;
            }
            else {
                return <>
                    Thanks for filling out the form. Create your own or learn more about how to grow with data at <b><a href="https://datagrown.com" style={{fontVariant: "small-caps"}}>DataGrown</a></b>.
                </>
            }
        }
        else if (props.data.prompt.trim().startsWith("=")) {
            return FormulaParser.executeFormula(props.data.prompt, props.answers);
        }
        return interpolate(props.data.prompt);
    }

    function replaceWithValue(variableName, entireString) {
        let keyToReplace = "{" + variableName + "}";
        let valueToReplace = props.answers[variableName];
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

    function handleSubmitClick() {
        if (props.isEndScreen) {
            if (!wasFormSubmitted) {
                props.submitForm()
            }
            else {
                window.location = "https://datagrown.com";
            }
        }
        else {
            props.setAnswer(props.data.id, null, true);
        }
    }

    function getButtonLabel() {
        if (props.isEndScreen) {
            if (!wasFormSubmitted) {
                return "Submit";
            }
            else {
                return "Become data driven";
            }
        }
        else {
            return props.data.buttonPrompt || "Let's go";
        }
    }

    return <div ref={forwardedRef} className={`full-screen-question section-intro-screen ${slideDirection === SlideDirection.Up ? "slide-up-from-bottom" : "slide-down-from-top"} ${props.isEndScreen ? "appear" : ""}`}>
        <div className={"question-content"}>
            <h1 style={props.theme?.h1 || null}>{getHeading()}</h1>
            <p>{getPrompt()}</p>
            <FlatButton
                variant="contained"
                disableElevation
                disabled={showLoadingIndicator}
                sx={props.theme?.button}
                onClick={() => handleSubmitClick()} >
                {showLoadingIndicator ? <CircularProgress size={18} /> : null}
                {getButtonLabel()}
            </FlatButton>
        </div>
    </div>
});

export default InterstitialScreen;