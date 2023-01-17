import "./DateAnswer.css"
import {useEffect, useState, useRef, createRef} from "react";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {TextField} from "@mui/material";

const DateAnswer = (props) => {
    const [answerValue, setAnswerValue] = useState(props.existingAnswerValue ? props.existingAnswerValue : (props.data.defaultOption ? props.data.defaultOption : null));
    const [existingAnswerValue, setExistingAnswerValue] = useState(props.existingAnswerValue);
    const [didSubmitAnswer, setDidSubmitAnswer] = useState(props.didSubmitAnswer);

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

    return <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className={`date-answer`}>
            <DatePicker
                onChange={date => setAnswerValue(date ? date.format("YYYY-MM-DD") : null)}
                value={answerValue}
                renderInput={(params) => <TextField {...params} label="Select a date" />}
                data-testid={props.data.name + " Date Picker"}
            />
        </div>
    </LocalizationProvider>
}

export default DateAnswer;