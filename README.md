<p align="center">
    <a href="https://parlanceform.com">
        <img src="https://user-images.githubusercontent.com/3450292/213283532-5eb80fdc-ea52-466c-90ea-a5c355758e63.svg" />
    </a>
    <br />
    <a href="https://parlanceform.com">parlanceform.com</a>
</p>

---

ParlanceForm is an open source React form builder that lets you create dynamic forms for more personalized and conversational experiences with your users. 
It provides a declarative interface for building out-of-the-box, smooth, custom forms with minimal additional coding.

**Key Features**:

- A declarative interface that requires minimal coding (just specify details of your questions and the form will automatically adapt to display them)
- Excel-style formulas to produce dynamic prompts, control whether a question is shown, and set variables
- Placeholders that let you easily display the answer to a previous question in a prompt
- Calculate and set variables that you can use in downstream formulas
- Basic support for theming
- One question per screen
- Conditionally display questions based on calculated variables and a user's previous answers
- Create dynamic and personalized prompts based on a user's previous answers
- Built-in validation and formatting for specific data types (currencies, dates, numbers, etc)
- Multiple different types of answers (basic text, select one among many, dates, etc)
- Support for gathering freeform text input if a user selects an "Other" option
- Required and optional questions

## Demo

See [this leadgen form](https://parco-welcome-form.web.app/) for an example of how a financial services
company used ParlanceForm to gather information from prospective customers.

## Examples

Question Type | Example Screen                                                                                                               | Example Config                                                                                                 
--- |------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
Section header | ![Section header](https://user-images.githubusercontent.com/3450292/213289001-8a1c8864-6f41-4aed-a7ce-fe6bbbe1fdb8.png)      | `{id: 1, type: StepType.InterstitialScreen, name: "Welcome Screen", heading: "Welcome to Parco", prompt: "We'll start by getting some basic information from you, which we'll use to create your personalized retirement report.", buttonPrompt: "Let's get started"}` 
Basic text question | ![Basic text question](https://user-images.githubusercontent.com/3450292/213285928-9563e7d4-d941-472b-abf4-3ffe11cea63a.png) | `{id: 2, type: StepType.Question, name: "First Name", prompt: "Let's get to know each other! What's your name?", answerType: "Text", required: true}` 
Conditional selection list | ![Selection list](https://user-images.githubusercontent.com/3450292/213287577-90bcf88c-e4ca-4634-ba77-454848cf5032.png)      | `{id: 9, type: StepType.Question, name: "Agency", prompt: '=IF({Employment Status}="Employed", "Which agency do you work for?", "Which agency did you work for?")', defaultOption: "Department of Veterans Affairs (VA)", acceptableValues: GovernmentAgencies, answerType: AnswerType.Select, required: true, placeholder: "Select an agency..."}`                                                                                                                        
Date selection | ![Date selection](https://user-images.githubusercontent.com/3450292/213288369-332f651f-8464-4371-9956-67d5a7d510d2.png)      | `{id: 11, type: StepType.Question, name: "Service Computation Date", prompt: "What is your service computation date? If you don't know, just enter the first day of the month and year that you started working for the government.", answerType: "Date", required: true}`                                                                                                                        
Set variable | N/A (these calculations happen behind the scenes)                                                                            | `{id: 15, type: StepType.SetVariable, name: "MRA Date: 57+30", formula: "=EDATE({Date Of Birth}, {FERS Minimum Retirement Age} * 12)"}`                                                                                                                        

# Getting started

Install the form builder from [npm](https://www.npmjs.com/package/parlance-form):

`npm install parlance-form`

Once installed, you can create an instance of a `ParlanceForm` component, pass in an array of `steps`
that you'd like to use to create your form, along with a few additional configuration objects, and you'll
be off and running. 

Here's a quick example, and you can find a more complete example in the `examples`
directory in this repository:

```js
import ParlanceForm from "parlance-form";
import Steps from "src/data/steps";
import EarthyTheme from "src/components/ParlanceForm/Themes/Earthy/EarthyTheme";

const HomePage = (props) => {
    function submitAnswers(answersByName, callback) {
        console.log(answersByName);
        // At this point, you can submit these answers to a backend API, save them to a database, stream them to Google Sheets, etc.
    }
    
    return <ParlanceForm
        steps={Steps}                           // See below for a description of how to specify your form's steps
        theme={EarthyTheme}                     // See below for additional information on theming
        submitAnswers={submitAnswers}
        endScreenPrompt={"Thanks for the answers! Once you submit your answers a member of our team will be in touch"}
        returnAnswersByName={true}              // Leave blank or set to false if you want answers returned by id instead of name
        logoUrl={"https://yoururl.com/logo"}
        logoDestinationUrl={"https://google.com"}
        filterOutCalculatedVariables={true}     // Set to false if you'd like to get a record of any intermediary variables that were calculated
    />
}
```

# Use cases

While ParlanceForm is ideal for collecting information from leads, users, and customers, there's no shortage of use cases. Some ways to use it include:

- Leadgen
- Surveys
- User research
- In-app questionnaires
- User onboarding

# How to use it in your own app

## Defining your steps

ParlanceForm assumes it will be provided with an array of objects (a.k.a. hashmaps or dictionaries) that each define a step in your form.
Currently, there are three different _types_ of steps supported:

1. Interstitial screens (useful for section headers and providing information)
2. Questions (the main interface for your form)
3. Set variable (useful for calculating something that will be used in a later step)

Depending on the type of step, you'll need to provide sufficient additional configuration options for ParlanceForm to be able to create the proper
interface for your users. The configuration options for each step are provided below, and you can also see the file named [steps.js](https://github.com/shanifdhanani/parlance-form/blob/main/src/data/steps.js)
in this repo to see an example of how to specify these options.

- _id_ (string or int): A unique identifier for the question, must be unique across all other IDs in the form
- _name_ (string): A short name for the question, useful for adding placeholders in question prompts, must be unique across all other names in the form
- _heading_ (string): Used as the main heading in interstitial screens
- _prompt_ (string): This is a flexible field that can contain a static prompt for a question, or a formula that will display a prompt to the user
 - _answerType_ (string): The data type for the answer, this determines how the answer UX will be displayed. See [AnswerType.js](https://github.com/shanifdhanani/parlance-form/blob/main/src/utility/Forms/AnswerType.js) for a list of acceptable values 
 - _acceptableValues_ (array of strings): A list of acceptable values for answers that can be selected for answer types that require multiple values
 - _buttonPrompt_ (text): The text to display on a button
 - _required_ (bool): Whether or not an answer to a question is required. If missing, the default will be false.
 - _validationFormat_ (string): For text answers, the format that must be adhered to. See [ValidationFormat.js](https://github.com/shanifdhanani/parlance-form/blob/main/src/utility/Forms/ValidationFormat.js) for a list of acceptable values
 - _defaultOption_ (string): The name of the option that should be selected by default for List and Selection answer types
 - _optionForAdditionalDetails_ (string): Available for List answers, if the user selects this option then they will be prompted to enter more details
 - _defaultValue_ (string): The default value to show for a text input, which will be used if present and no answer has already been provided
 - _displayConditions_ (string): A formula that evaluates to true or false, and if false, will not display the current question
 - _placeholder_ (string): The placeholder to use for a selection answer
 - _formula_ (string): The formula to use when setting a variable

## Formulas

## Theming

# License

# Consulting and Custom Implementations

# Developing

## Testing

## Starting
`npm run start`

# Theming and Customization

# Publish to npm

```
npm login
npm publish
```

## Install instructions:
1. Install Node Version Manager (easy node install)
2. Login to firebase
3. npm run build
4. firebase deploy

Follow steps at https://blog.logrocket.com/8-ways-deploy-react-app-free/

# How to develop

1. Run with tests on to make sure your changes don't break anything: `npm run test`

### `$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`

### `$ source ~/.bash_profile`

### `$ source ~/.nvm/nvm.sh`

### `$ nvm install v16.4.0`

## Gotchas

1. This will break with React Scripts 5, you must downgrade to 4

2. Run this command to use the correct Node version:

 ```
$ [[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh
$ nvm use v16.4.0
```

3. In the root of this directory (apteo/website) run:

### `$ npm install`

All the node packages will be installed. To start the app type:

### `$ npm start`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!