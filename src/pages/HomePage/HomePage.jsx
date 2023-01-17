import './HomePage.css';
import Form from "../../components/Form/Form";
import GoogleSheetsService from "../../services/GoogleSheetsService";
import {ParcoTheme} from "../../ParcoTheme";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";

const HomePage = (props) => {
    const [googleSteps, setGoogleSteps] = useState(null);

    useEffect(() => {
        GoogleSheetsService.getQuestions((steps) => {
            setGoogleSteps(steps)
        });
    }, [])

    async function submitAnswers(answersByName, callback) {
        await GoogleSheetsService.submitAnswers(answersByName, (successFlag) => {
            callback(successFlag);
        });
    }

    return <div className={"home-page"}>
            {
                googleSteps
                    ? <Form
                        steps={googleSteps}
                        theme={ParcoTheme}
                        submitAnswers={submitAnswers}
                        endScreenPrompt={"Thanks for the answers! Once you submit your answers a member of our team will be in touch"}
                        returnAnswersByName={true}
                        logoUrl={"https://static.wixstatic.com/media/283853_48e82cd1b68b4e24bea453a5d01cf02a~mv2.png"}
                        filterOutCalculatedVariables={true}
                    />
                    : <CircularProgress size={50} style={{position: "absolute", top: "45%", left: "47%"}} />
            }
        </div>
}

export default HomePage;