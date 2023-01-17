import {createRef, useRef, useState, useEffect} from "react";
import "./ParlanceForm.css";
import Question from "./Question/Question";
import FormNav from "./FormNav/FormNav";
import AnswerValidator from "../../utility/Forms/AnswerValidator";
import {SlideDirection} from "../../utility/Forms/SlideDirection";
import InterstitialScreen from "./InterstitialScreen/InterstitialScreen";
import {StepType} from "../../utility/Forms/StepType";
import FormulaParser from "../../utility/Forms/FormulaParser";

const ParlanceForm = (props) => {

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [previousStepNumber, setPreviousStepNumber] = useState(null);
    const [answersByName, setAnswersByName] = useState({});
    const [invalidAnswerSubmitted, setInvalidAnswerSubmitted] = useState(null);
    const [didSubmitAnswer, setDidSubmitAnswer] = useState(false);
    const [currentDisplayStep, setCurrentDisplayStep] = useState(1);
    const [totalDisplaySteps, setTotalDisplaySteps] = useState(() => getStepCount(false));
    const [currentQuestionDisplayNumber, setCurrentQuestionDisplayNumber] = useState(1);
    const [wasFormSubmitted, setWasFormSubmitted] = useState(false);
    const [showLoadingIndicatorForSubmitButton, setShowLoadingIndicatorForSubmitButton] = useState(false);

    const stepRefs = useRef(props.steps.map(() => createRef()));
    const answersById = useRef({});
    const conditionalDisplayDependencies = useRef(new Array(props.steps.length));  // This method stores a list of the dependencies, their previously calculated values, and the function result for conditional display questions. We need to keep track of these so that we do not call the Hyperformula module repeatedly (a compute-heavy method that slows down the browser) every time a question changes.

    useEffect(() => {
        // Check to see if the current step is a variable setting step
        if (currentStepIndex >= props.steps.length) {
            return;
        }

        if (props.steps[currentStepIndex].type == StepType.SetVariable) {
            setVariableAndNavigateToNextStep();
        }
        else {
            setCurrentDisplayStep(getStepCount(true) + 1);
            setTotalDisplaySteps(getStepCount(false));
            setCurrentQuestionDisplayNumber(getQuestionDisplayNumber(currentStepIndex));
        }
    }, [currentStepIndex])

    function setAnswer(id, answer, navigateToNextStep = true) {
        answersById.current[id] = answer;
        let stepName = getStepNameFromId(id);
        if (stepName) {
            answersByName[stepName] = answer;
            setAnswersByName(answersByName);
        }

        let currentStep = props.steps[currentStepIndex];
        let currentAnswer = answersById.current[currentStep.id];

        if (invalidAnswerSubmitted) {
            if (currentAnswer && currentAnswer !== "" && currentAnswer.length > 0) {
                setInvalidAnswerSubmitted(false);
                setDidSubmitAnswer(false);
            }
        }

        if (navigateToNextStep) {
            navigateToScreen(currentStepIndex + 1);
        }
    }

    function getStepNameFromId(id) {
        for (const stepData of props.steps) {
            if (stepData.id && stepData.id === id) {
                return stepData.name;
            }
        }

        return null;
    }

    function getIndexOfNextVisibleScreenMovingForwards(nextStepIndex) {
         for (let index = nextStepIndex; index < props.steps.length; index++) {
             let currentStep = props.steps[index];
             if (!currentStep.displayConditions || shouldQuestionBeDisplayed(index)) {
                 return index; // In this case, we can set the next screen to be the next step. If that step is a variable, then the variable will be calculated and will then instruct the form to move forward. Our bigger concern is moving backwards.
             }
         }
         return props.steps.length;
    }

    function getIndexOfNextVisibleScreenMovingBackwards(nextStepIndex) {
        for (let index = nextStepIndex; index >= 0; index--) {
            let currentStep = props.steps[index];
            if (currentStep.type !== StepType.SetVariable && (!currentStep.displayConditions || shouldQuestionBeDisplayed(index))) {
                return index;
            }
        }
    }

    function getIndexOfNextVisibleScreen(nextStepIndex) {
        let direction = "forwards";
        if (currentStepIndex > nextStepIndex) {
            direction = "backwards";
        }

        if (direction == "forwards") {
           return getIndexOfNextVisibleScreenMovingForwards(nextStepIndex);
        }

        return getIndexOfNextVisibleScreenMovingBackwards(nextStepIndex);
    }

    function haveVariablesForConditionalDisplayChanged(questionIndex, newVariableCalculations, shouldOverwriteExistingVariablesIfDifferent = true) {
        // This method checks to see if any values that govern whether a question is displayed have changed. If they have, then we will re-run calculations, but if not, we will return the previously calculated results
        if (!conditionalDisplayDependencies.current) {
            throw "Conditional display dependencies not set";
        }

        if (newVariableCalculations && Object.keys(newVariableCalculations).length > 0) {
            if (!conditionalDisplayDependencies.current[questionIndex]) {
                conditionalDisplayDependencies.current[questionIndex] = {variables: {}};
            }

            let existingCalculatedVariables = conditionalDisplayDependencies.current[questionIndex].variables;
            let newValuesFound = false;
            if (!existingCalculatedVariables) {
                newValuesFound = true;
                conditionalDisplayDependencies.current[questionIndex].variables = {};
            }

            for (const [key, value] of Object.entries(newVariableCalculations)) {
                let existingValue = conditionalDisplayDependencies.current[questionIndex].variables[key];
                if (existingValue !== value) {
                    newValuesFound = true;

                    if (shouldOverwriteExistingVariablesIfDifferent) {
                        conditionalDisplayDependencies.current[questionIndex].variables[key] = value;
                    }
                }
            }

            return newValuesFound;
        }

        return false;
    }

    function shouldQuestionBeDisplayed(questionIndex) {
        try {
            let question = props.steps[questionIndex];
            if (!question) {
                return false;
            }

            if (!question.displayConditions) {
                return true;
            }

            try {
                let variables = FormulaParser.getVariablesAndValues(question.displayConditions, answersByName);
                if (haveVariablesForConditionalDisplayChanged(questionIndex, variables, true)) {
                    let result = FormulaParser.executeFormula(question.displayConditions, answersByName);
                    conditionalDisplayDependencies.current[questionIndex].result = result
                    return result;
                }
                else {
                    return conditionalDisplayDependencies.current[questionIndex].result;
                }
            }
            catch(message) {
                if (message.indexOf("variables") >= 0) {
                    return false;
                }
            }
        }
        catch(ex) {
            return true;
        }
    }

    function getQuestionDisplayNumber(stepIndex) {
        // This method calculates the current question number that should be displayed to the user

        let questionDisplayNumber = 0;
        for (let index = 0; index <= stepIndex; index++) {
            let currentStep = props.steps[index];
            if (currentStep.type == StepType.SetVariable || currentStep.type == StepType.InterstitialScreen || !shouldQuestionBeDisplayed(index)) {
                continue;
            }
            questionDisplayNumber++;
        }
        return questionDisplayNumber;
    }

    function getStepCount(getCurrentIndex = true) {
        let stepsToSubtract = 0;
        let max = currentStepIndex;
        if (!getCurrentIndex) {
            max = props.steps.length;
        }

        for (let index = 0; index < max; index++) {
            if (props.steps[index].type == StepType.SetVariable || !shouldQuestionBeDisplayed(index)) {
                stepsToSubtract++;
            }
        }
        return max - stepsToSubtract;
    }

    function shouldNextScreenShowFinalPage(nextStepIndex) {
        // First check to see if we're on the last page
        if (nextStepIndex > props.steps.length - 1) {
            return true;
        }

        // Now check to see if we're not on the last page but all subsequent pages cannot be shown
        for (let index = nextStepIndex; index <= props.steps.length - 1; index++) {
            let step = props.steps[index];
            if (step.type === StepType.InterstitialScreen || (step.type === StepType.Question && shouldQuestionBeDisplayed(index))) {
                return false;
            }
        }

        return true;
    }

    function navigateToScreen(nextStepIndex) {
        if (currentStepIndex >= props.steps.length - 1 && nextStepIndex == props.steps.length - 1) {
            setInvalidAnswerSubmitted(false);
            setDidSubmitAnswer(false);
            setPreviousStepNumber(currentStepIndex);
            setCurrentStepIndex(props.steps.length - 1);
            return;
        }

        let currentStep = props.steps[currentStepIndex];
        let currentAnswer = answersById.current[currentStep.id];

        // Don't let people move forward if they have an invalid answer
        if (nextStepIndex > currentStepIndex && !AnswerValidator.isAnswerValid(currentStep, currentAnswer)) {
            setInvalidAnswerSubmitted(true);
            return;
        }

        setInvalidAnswerSubmitted(false);
        setDidSubmitAnswer(false);
        setPreviousStepNumber(currentStepIndex);

        // If they're on the last question, send them to the submission page
        if (shouldNextScreenShowFinalPage(nextStepIndex)) {
            setPreviousStepNumber(currentStepIndex);
            setCurrentStepIndex(props.steps.length);
        }
        else {
            // We need to set the step to the index of the previous/next visible screen
            let indexOfNextScreen = getIndexOfNextVisibleScreen(nextStepIndex);
            setCurrentStepIndex(indexOfNextScreen);
        }
    }

    function getSlideDirectionForStep(step) {
        if (previousStepNumber !== null && previousStepNumber > step) {
            return SlideDirection.Down;
        }
        return SlideDirection.Up;
    }

    function getExistingAnswerValue(index) {
        let step = props.steps[index];
        if (step) {
            return answersById.current[step.id];
        }
        return null;
    }

    function setVariableAndNavigateToNextStep() {
        let value = FormulaParser.executeFormula(props.steps[currentStepIndex].formula, answersByName);
        setAnswer(props.steps[currentStepIndex].id, value, true);
    }

    function getAnswersForSubmission() {
        let validAnswerValues = new Map();
        for (const step of props.steps) {
            if (step.type === StepType.InterstitialScreen || (step.type === StepType.SetVariable && props.filterOutCalculatedVariables)) {
                continue;
            }

            let key = (props.returnAnswersByName ? step.name : step.id).toString();
            let stepId = step.id;
            validAnswerValues.set(key, answersById.current[stepId]);
        }
        return validAnswerValues;
    }

    function submitForm() {
        setShowLoadingIndicatorForSubmitButton(true);
        let returnValue = getAnswersForSubmission();
        props.submitAnswers(returnValue, (successFlag) => {
            setShowLoadingIndicatorForSubmitButton(false);
            if (successFlag) {
                setWasFormSubmitted(true);
            }
        })
    }

    function renderTitleBar() {
        return <div className={"title-bar"}>
            {props.logoUrl
                ? <a href={props.logoDestinationUrl || "#"} className={"logo"}><img src={props.logoUrl}/></a>
                : <div></div>
            }
            {
                wasFormSubmitted
                    ? null
                    : <FormNav
                        currentStepIndex={currentStepIndex}
                        steps={props.steps}
                        navigateToScreen={navigateToScreen}
                        currentStep={currentDisplayStep}
                        totalSteps={totalDisplaySteps}
                        steps={props.steps}
                        answers={answersByName}
                        {...props} />
            }
        </div>
    }

    function renderEndScreenIfNeeded() {
        if (currentStepIndex >= props.steps.length) {
            return <InterstitialScreen
                setAnswer={setAnswer}
                slideDirection={SlideDirection.Up}
                submitForm={submitForm}
                isEndScreen={true}
                endScreenPrompt={props.endScreenPrompt}
                wasFormSubmitted={wasFormSubmitted}
                loading={showLoadingIndicatorForSubmitButton}
                answers={answersByName}
                {...props} />
        }

        return null;
    }

    function renderFormStep(step, index) {
        let Component = null;

        switch (step.type) {
            case StepType.Question:
                Component = Question;
                break;
            case StepType.InterstitialScreen:
                Component = InterstitialScreen;
                break;
            default:
                break;
        }

        return !Component || !shouldQuestionBeDisplayed(index) || currentStepIndex !== index
            ? null
            : <Component
                data={step}
                ref={stepRefs.current[index]}
                key={step.id}
                setAnswer={setAnswer}
                slideDirection={getSlideDirectionForStep(index)}
                invalidAnswerSubmitted={invalidAnswerSubmitted}
                existingAnswerValue={getExistingAnswerValue(index)}
                didSubmitAnswer={didSubmitAnswer}
                onSubmit={() => {setDidSubmitAnswer(true)}}
                questionDisplayNumber={currentQuestionDisplayNumber}
                isEndScreen={currentStepIndex >= props.steps.length}
                endScreenPrompt={props.endScreenPrompt}
                answers={answersByName}
                {...props} />
    }

    return <div className={"form"} role={"document"} style={props.theme?.global || null}>
        {renderTitleBar()}
        <div className={"form-content-wrapper"}>
            {renderEndScreenIfNeeded()}
            { props.steps.map((step, index) => { return renderFormStep(step, index); })}
        </div>
    </div>
}

export default ParlanceForm;