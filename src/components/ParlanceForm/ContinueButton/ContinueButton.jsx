import {useEffect, useState, useRef} from "react";
import CheckIcon from "@mui/icons-material/Check";
import FlatButton from "../FlatButton/FlatButton";

const ContinueButton = (props) => {
    return <div className={"continue-button flex-row"}>
        <FlatButton
            variant="contained"
            disableElevation
            onClick={() => props.onSubmit(true)}
            sx={{margin: "1em 0", color: props.theme?.button?.color || "black"}}
            data-testid={props.data.name + " Button"}
            endIcon={<CheckIcon fontWeight={"700"} style={{fontSize: 25}} />}>
            {props.data.buttonPrompt || "OK"}
        </FlatButton>
        {props.showPressEnterMessage
            ? <span className={"press-enter"}>
                press Enter ↵
            </span>
            : null
        }
    </div>
}

export default ContinueButton;