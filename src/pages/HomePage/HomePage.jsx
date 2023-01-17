import './HomePage.css';
import Form from "../../components/Form/Form";
import GoogleSheetsService from "../../services/GoogleSheetsService";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import {EarthyTheme} from "../../components/Form/Themes/Earthy/EarthyTheme";
import {Steps} from "../../data/steps";

const HomePage = (props) => {
    async function submitAnswers(answersByName, callback) {
        console.log(answersByName)
    }

    return <div className={"home-page"}>
            <Form
                steps={Steps}
                theme={EarthyTheme}
                submitAnswers={submitAnswers}
                endScreenPrompt={"Thanks for the answers! Once you submit your answers a member of our team will be in touch"}
                returnAnswersByName={true}
                logoUrl={"https://i.ibb.co/mFPZqkj/kisspng-domain-name-registrar-name-generic-top-level-doma-name-5acdcf40e3f482-2025584015234373769337.png"}
                filterOutCalculatedVariables={true}
            />
        </div>
}

export default HomePage;