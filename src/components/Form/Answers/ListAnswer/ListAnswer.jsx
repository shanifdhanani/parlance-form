import "./ListAnswer.css"
import {useEffect, useState, useRef, createRef} from "react";
import {Checkbox, FormControlLabel, FormGroup, TextField} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import TextAnswer from "../TextAnswer/TextAnswer";

const ListAnswer = (props) => {
    const [answerValue, setAnswerValue] = useState(props.existingAnswerValue ? props.existingAnswerValue : (props.data.defaultOption ? props.data.defaultOption : null));
    const [existingAnswerValue, setExistingAnswerValue] = useState(props.existingAnswerValue);
    const [didSubmitAnswer, setDidSubmitAnswer] = useState(props.didSubmitAnswer);
    const flashAnimationDurationInMs = 800;

    useEffect(() => {
        if (existingAnswerValue !== props.existingAnswerValue) {
            setExistingAnswerValue(props.existingAnswerValue);
        }

        if (didSubmitAnswer !== props.didSubmitAnswer) {
            setDidSubmitAnswer(props.didSubmitAnswer);
        }
    }, [props.existingAnswerValue, props.didSubmitAnswer]);

    useEffect(() => {
        props.setAnswer(props.data.id, answerValue, didSubmitAnswer);
    }, [answerValue, didSubmitAnswer])

    function selectAnswer(event, index) {
        if (answerValue === event.target.name) {
            setAnswerValue(null);
            return;
        }

        if (props.data.optionForAdditionalDetails && event.target.name == props.data.optionForAdditionalDetails) {
            setAnswerValue("Enter details"); // Wait for them to type details into the textbox
            return;
        }

        setAnswerValue(event.target.name);
        setTimeout(() => setDidSubmitAnswer(true), flashAnimationDurationInMs);
    }

    function isOtherOptionChecked() {
        if (!props.data.optionForAdditionalDetails || !answerValue) {
            return false;
        }

        for (const option of props.data.acceptableValues) {
            if (answerValue == option && option !== props.data.optionForAdditionalDetails) {
                return false;
            }
        }

        return true;
    }

    function getIsChecked(value) {
        if (props.data.optionForAdditionalDetails && answerValue) {
            if (value !== props.data.optionForAdditionalDetails) {
                return value === answerValue;
            }

            // See if any of the other values are set
            let isAnotherValueSelected = false;
            for (const option of props.data.acceptableValues) {
                if (answerValue == option && option !== props.data.optionForAdditionalDetails) {
                    isAnotherValueSelected = true;
                }
            }

            return !isAnotherValueSelected;
        }

        return value === answerValue;
    }

    function setAnswerFromOtherDetails(id, answer, didSubmitAnswer) {
        setAnswerValue(answer);
        setDidSubmitAnswer(didSubmitAnswer)
    }

    if (!props.data.acceptableValues || props.data.acceptableValues.length == 0) {
        return;
    }

    return <div className={"list-answer"}>
        <FormGroup>
            {props.data.acceptableValues.map((option, index) => {
                return <FormControlLabel
                    className={`list-choice ${option === answerValue ? "option-selected flash" : ""}`}
                    key={option}
                    control={<Checkbox
                        icon={<CheckBoxOutlineBlankIcon />}
                        checkedIcon={<CheckIcon style={{fill: "#FFF", color: "#FFF"}} />}
                        checked={getIsChecked(option)}
                        onChange={(event) => selectAnswer(event, index)}
                        name={option}
                        size={"medium"} />}
                    label={option}
                />
            })}
        </FormGroup>
        {props.data.optionForAdditionalDetails && isOtherOptionChecked()
            ? <div className={"enter-other-details"}> <TextAnswer
                {...props}
                setAnswer={setAnswerFromOtherDetails}
                placeholder={"Enter details"}
                width={"300px"}
                variant={"outlined"} />
            </div>
            : null
        }
    </div>
}

export default ListAnswer;