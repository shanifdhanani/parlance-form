import './HomePage.css';
import ParlanceForm from "../../../src/components/ParlanceForm/ParlanceForm";
import {EarthyTheme} from "../../../src/components/ParlanceForm/Themes/Earthy/EarthyTheme";
import {Steps} from "../../../src/data/steps";

const HomePage = (props) => {
    async function submitAnswers(answersByName, callback) {
        console.log(answersByName)
    }

    return <div className={"home-page"}>
            <ParlanceForm
                steps={Steps}
                theme={EarthyTheme}
                submitAnswers={submitAnswers}
                endScreenPrompt={"Thanks for the answers! Once you submit your answers a member of our team will be in touch"}
                returnAnswersByName={true}
                logoDestinationUrl={"https://google.com"}
                logoUrl={"https://i.ibb.co/mFPZqkj/kisspng-domain-name-registrar-name-generic-top-level-doma-name-5acdcf40e3f482-2025584015234373769337.png"}
                filterOutCalculatedVariables={true}
                hideProgress={true}
            />
        </div>
}

export default HomePage;