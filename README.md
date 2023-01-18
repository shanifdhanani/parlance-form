<p align="center">
    <a href="https://parlanceform.com">
        <img src="https://user-images.githubusercontent.com/3450292/213294669-4a65988f-5adf-4fa7-96cb-ef059542deb8.svg" />
    </a>
</p>
<p align="center">
    <a href="https://parlanceform.com">
        <img src="https://user-images.githubusercontent.com/3450292/213295084-b6a52336-ada8-4d98-bafc-ba68b9696501.gif" />
    </a>
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

## Formulas

ParlanceForm allows you to use Excel-style formulas to control whether a question shows up, the prompt for a question or interstitial screen, calculation of variables, and default values for text answers. Under the
hood, it uses [Hyperformula](https://hyperformula.handsontable.com/) to process formulas. [Here](https://hyperformula.handsontable.com/guide/built-in-functions.html) is a list of the built in formulas they support. Because
HyperFormula is extendable, you can also create your own custom functions using their [guide](https://hyperformula.handsontable.com/guide/built-in-functions.html#custom-functions).

To date, ParlanceFormula provides one custom function, named `TO_CURRENCY`, to help you format numbers as US-denominated dollar amounts.

## Theming

ParlanceForm heavily relies on [MUI](https://mui.com/) for its UX and UI. It supports basic theming options so you can provide your own backgrounds, images, colors, fonts, and styles. To set a theme for your form,
you'll need to create a Theme object, similar to how the [Earthy Theme](https://github.com/shanifdhanani/parlance-form/blob/main/src/components/ParlanceForm/Themes/Earthy/EarthyTheme.js) is specified in this repository.
Patches and code updates to expand ParlanceForm's theming capabilities are welcome.

# License

ParlanceForm is dual-licenced under the [GPLv3](https://github.com/shanifdhanani/parlance-form/blob/main/LICENSE.gplv3.txt) license for other
open source projects, and a [commercial license](https://github.com/shanifdhanani/parlance-form/blob/main/LICENSE.commercial.txt) for organizations
that wish to use it in commercial projects or who do not wish to release their code as open source.

# Consulting and custom implementations

The [developer of ParlanceForm](https://linkedin.com/in/shanifdhanani) is available for consulting and freelance work. If you'd like to expand ParlanceForm, create a custom implementation,
or have any work related to software, machine learning, A.I., and tech startups, please feel free to [reach out](https://www.datagrown.com/contact).

# Developing

## Getting started with development

Contributions to ParlanceForm's codebase are welcome and appreciated! If you'd like to help grow ParlanceForm, feel free to make a pull request to this repo. To get started with developing
ParlanceForm locally, you can pull this codebase and follow the steps below

1. Install nvm (if you don't already have it) and use a known version of node

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
source ~/.bash_profile
source ~/.nvm/nvm.sh
nvm install v16.4.0
[[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh
$ nvm use v16.4.0
```
2. Install dependencies: `npm install`
3. ParlanceForm heavily relies on tests using the Jest framework to ensure proper functionality. It's strongly recommended to have tests running in a watch window using the command `npm test`
4. Start the example app: `npm run start`
5. Visit `localhost:3001` to ensure the app has started properly

## Deploying and publishing to npm

```
npm login
npm publish
```

---

Thanks for checking out ParlanceForm. If you like it, please feel free to star it on [npm](https://www.npmjs.com/package/parlance-form).