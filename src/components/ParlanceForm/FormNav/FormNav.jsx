import "./FormNav.css"
import HomeIcon from '@mui/icons-material/Home';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import {useEffect, useState} from "react";
import FlatButton from "../FlatButton/FlatButton";

const FormNav = (props) => {

    const [currentStepIndex, setCurrentStepIndex] = useState(props.currentStepIndex);
    const [currentStep, setCurrentStep] = useState(props.currentStep);
    const [totalSteps, setTotalSteps] = useState(props.totalSteps);
    const buttonFontSize = "15px";

    useEffect(() => {
        setCurrentStepIndex(props.currentStepIndex);
        setCurrentStep(props.currentStep);
        setTotalSteps(props.totalSteps);
    }, [props.currentStepIndex, props.currentStep, props.totalSteps])

    if (props.steps.length == 0) {
        return null;
    }

    return <div className={"form-nav"} style={props.theme?.formNav}>
        <div className={"form-nav-button"}>
            <FlatButton startIcon={<HomeIcon />} variant="contained" disableElevation onClick={() => {props.navigateToScreen(0)}} sx={{padding: "5px 17px", fontSize: buttonFontSize, fontWeight: 400, borderRadius: "3px", color: props.theme?.formNav?.color || "black"}}>
                Home
            </FlatButton>
        </div>
        <div className={"form-nav-button"}>
            {
                currentStepIndex === 0
                    ? <FlatButton startIcon={<WestIcon />} variant="contained" disableElevation disabled className={"disabled"} sx={{padding: "5px 17px", fontSize: buttonFontSize, fontWeight: 400, borderRadius: "3px 0 0 3px", marginRight: 0, color: props.theme?.formNav?.color || "black"}}>
                        Prev
                    </FlatButton>
                    : <FlatButton startIcon={<WestIcon />} variant="contained" disableElevation sx={{padding: "5px 15px", fontSize: buttonFontSize, fontWeight: 400, borderRadius: "3px 0 0 3px", marginRight: 0, color: props.theme?.formNav?.color || "black"}} onClick={() => {props.navigateToScreen(currentStepIndex - 1)}}>
                        Prev
                    </FlatButton>
            }
        </div>
        <div className={"form-nav-button"}>
            {
                currentStepIndex >= props.steps.length
                    ? <FlatButton endIcon={<EastIcon />} variant="contained" disableElevation disabled className={"disabled"} sx={{padding: "5px 17px", fontSize: buttonFontSize, fontWeight: 400, marginLeft: -1, borderLeft: "1px solid #7E7E7E", borderRadius: "0 3px 3px 0", color: props.theme?.formNav?.color || "black"}}>
                        Next
                    </FlatButton>
                    : <FlatButton endIcon={<EastIcon />} variant="contained" disableElevation sx={{padding: "5px 17px", fontSize: buttonFontSize, fontWeight: 400, borderRadius: "0 3px 3px 0", marginLeft: -1, borderLeft: "1px solid #7E7E7E", color: props.theme?.formNav?.color || "black"}} onClick={() => {props.navigateToScreen(currentStepIndex + 1)}}>
                        Next
                    </FlatButton>
            }
        </div>
        {!props.hideProgress
            ? <div id={"progress-indicator"}>
                <div className={"form-nav-progress-bar"} style={{width: ((currentStep) / totalSteps * 100) + "%"}}></div>
                <div className={"form-nav-progress-count"}>
                    {currentStep} / {totalSteps}
                </div>
            </div>
            : null
        }
    </div>
}

export default FormNav;