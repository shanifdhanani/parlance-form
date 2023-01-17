import "./SelectAnswer.css"
import {useEffect, useState, useRef, createRef} from "react";
import {Autocomplete, TextField} from "@mui/material";

const SelectAnswer = (props) => {
    const [answerValue, setAnswerValue] = useState(props.existingAnswerValue ? props.existingAnswerValue : (props.data.defaultOption ? props.data.defaultOption : null));
    const [existingAnswerValue, setExistingAnswerValue] = useState(props.existingAnswerValue);
    const [didSubmitAnswer, setDidSubmitAnswer] = useState(props.didSubmitAnswer);

    const flashAnimationDurationInMs = 800;
    const selectList = createRef();

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

    function selectAnswer(event, newValue) {
        if (answerValue === event.target.name) {
            setAnswerValue(null);
            return;
        }
        setAnswerValue(newValue);
        selectList.current.classList.add("flash");
        setTimeout(() => setDidSubmitAnswer(true), flashAnimationDurationInMs);
    }

    if (!props.data.acceptableValues || props.data.acceptableValues.length == 0) {
        return;
    }

    return <div className={`select-answer`}>
        <Autocomplete
            value={answerValue}
            ref={selectList}
            onChange={(event, newValue) => {selectAnswer(event, newValue)}}
            options={props.data.acceptableValues}
            autoHighlight
            renderInput={(params) => <TextField {...params} label={props.data.placeholder || "Start typing an answer..."} />}
            />
    </div>
}

export default SelectAnswer;