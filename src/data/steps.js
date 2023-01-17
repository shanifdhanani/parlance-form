/*
 * This class is an example of a list of questions that can be displayed in this form. In a production web application,
 * questions would likely come in from a backend API. The attributes that can be part of a question include the following:
 *
 *  - id (string or int): A unique identifier for the question
 *  - name (string): A short name for the question, useful for adding placeholders in question prompts
 *  - heading (string): Only used for section headers, the content for the section heading
 *  - prompt (string or array): This is a flexible field that can contain a static prompt for a question, or a list of conditions where the first one that matches will provide the prompt presented to the user
 *  - answerType (AnswerType): the data type for the answer, this determines how the answer UX will be displayed
 *  - acceptableValues (array): A list of acceptable values for answers that can be selected from a list of choices
 *  - buttonPrompt (text): The text to display on the button that submits the answer
 *  - required (bool): Whether or not an answer to this question is required. If missing, the default will be false.
 *  - validationFormat (ValidationFormat): For text answers, the format that must be adhered to
 *  - defaultOption (string): The name of the option that should be selected by default for List and Selection answer types
 *  - optionForAdditionalDetails (string): Available for List answers, if the user selects the provided option then they will be prompted to enter more details
 *  - defaultValue (string): The default value to show for a text input, which will be used if present and no answer has already been provided
 *  - displayConditions (string): A formula that evaluates to true or false, and if false, will not display the current question
 *  - buttonPrompt (string): The label to show on the continue button for interstitial screens
 *  - placeholder (string): The placeholder to use for a selection answer
 *  - formula (string): The formula to use when setting a variable
 *
 */


import {EmploymentStatuses} from "./EmploymentStatuses";
import {ValidationFormat} from "../utility/Forms/ValidationFormat";
import {AnswerType} from "../utility/Forms/AnswerType";
import {GovernmentAgencies} from "./GovernmentAgencies";
import {RetirementSystems} from "./RetirementSystems";
import {StepType} from "../utility/Forms/StepType";
import {RetirementCalculationFormula} from "./RetirementCalculationFormula";
import {FehbCodes} from "./FehbCodes";
import {Deductions} from "./Deductions";
import {Unions} from "./Unions";
import {UnionLocals} from "./UnionLocals";
import {TaxRates} from "./TaxRates";

export const Steps = [
    {id: 1, type: StepType.InterstitialScreen, name: "Welcome Screen", heading: "Welcome to Parco", prompt: "We'll start by getting some basic information from you, which we'll use to create your personalized retirement report.", buttonPrompt: "Let's get started"},
    {id: 2, type: StepType.Question, name: "First Name", prompt: "Let's get to know each other! What's your name?", answerType: AnswerType.Text, required: true},
    {id: 3, type: StepType.Question, name: "Last Name", prompt: "Great! Nice to meet you {First Name}! What's your last name?", answerType: AnswerType.Text, required: true},
    {id: 4, type: StepType.Question, name: "Email", prompt: "What's the best email address for us to reach you?", answerType: AnswerType.Text, validationFormat: ValidationFormat.Email, required: true},
    {id: 5, type: StepType.Question, name: "Phone Number", prompt: "OK and what's the best phone number for us to reach you?", answerType: AnswerType.Text, validationFormat: ValidationFormat.PhoneNumber, required: true},
    {id: 6, type: StepType.InterstitialScreen, name: "Interstitial - Get Personal Info", heading: "Thanks! Let's Keep Going", prompt: "To get started let's get a little bit more information about you.", buttonPrompt: "Let's Go"},
    {id: 7, type: StepType.Question, name: "Zip Code", prompt: "What's your home zip code?", answerType: AnswerType.Text, validationFormat: ValidationFormat.ZipCode, required: true},
    {id: 8, type: StepType.Question, name: "Employment Status", prompt: "What's your current employment status?", defaultOption: "Employed", acceptableValues: EmploymentStatuses, answerType: AnswerType.List, required: true},
    {id: 9, type: StepType.Question, name: "Agency", prompt: '=IF({Employment Status}="Employed", "Which agency do you work for?", "Which agency did you work for?")', defaultOption: "Department of Veterans Affairs (VA)", acceptableValues: GovernmentAgencies, answerType: AnswerType.Select, required: true, placeholder: "Select an agency..."},
    {id: 10, type: StepType.Question, name: "Position Title", prompt: '=IF({Employment Status}="Employed", "And what\'s your position title?", "And what was your position title?")', answerType: AnswerType.Text, required: true},
    {id: 11, type: StepType.Question, name: "Service Computation Date", prompt: "What is your service computation date? If you don't know, just enter the first day of the month and year that you started working for the government.", answerType: AnswerType.Date, required: true},
    {id: 12, type: StepType.Question, name: "Date Of Birth", prompt: "What's your date of birth?", answerType: AnswerType.Date, required: true},
    {id: 13, type: StepType.Question, name: "Retirement System", prompt: "It looks like you're a FERS employee. Is this accurate? If not which retirement system are you?", defaultOption: "FERS", acceptableValues: RetirementSystems, answerType: AnswerType.List, required: true},

    /* Begin retirement calculation section */
    // Calculations for FERS
    {id: 14, type: StepType.SetVariable, name: "FERS Minimum Retirement Age", formula: "=IF(YEAR({Date Of Birth}) <= 1964, 56, IF(YEAR({Date Of Birth}) <= 1965, 56.167, IF(YEAR({Date Of Birth}) <= 1966, 56.333, IF(YEAR({Date Of Birth}) <= 1967, 56.5, IF(YEAR({Date Of Birth}) <= 1968, 56.667, IF(YEAR({Date Of Birth}) <= 1969, 56.833, 57))))))"},
    {id: 15, type: StepType.SetVariable, name: "MRA Date: 57+30", formula: "=EDATE({Date Of Birth}, {FERS Minimum Retirement Age} * 12)"},
    {id: 16, type: StepType.SetVariable, name: "YOS Date: 57+30", formula: "=EDATE({Service Computation Date}, 360)"},
    {id: 17, type: StepType.SetVariable, name: "Fully Eligible Date: 57+30", formula: "=MAX({MRA Date: 57+30}, {YOS Date: 57+30})"},
    {id: 18, type: StepType.SetVariable, name: "MRA Date: 60+20", formula: "=EDATE({Date Of Birth}, 720)"},
    {id: 19, type: StepType.SetVariable, name: "YOS Date: 60+20", formula: "=EDATE({Service Computation Date}, 240)"},
    {id: 20, type: StepType.SetVariable, name: "Fully Eligible Date: 60+20", formula: "=MAX({MRA Date: 60+20}, {YOS Date: 60+20})"},
    {id: 21, type: StepType.SetVariable, name: "MRA Date: 62+5", formula: "=EDATE({Date Of Birth}, 744)"},
    {id: 22, type: StepType.SetVariable, name: "YOS Date: 62+5", formula: "=EDATE({Service Computation Date}, 60)"},
    {id: 23, type: StepType.SetVariable, name: "Fully Eligible Date: 62+5", formula: "=MAX({MRA Date: 62+5}, {YOS Date: 62+5})"},
    {id: 24, type: StepType.SetVariable, name: "FERS: First Full Eligibility Date", formula: "=MIN({Fully Eligible Date: 57+30}, {Fully Eligible Date: 60+20}, {Fully Eligible Date: 62+5})"},

    // Calculations for FSOP
    {id: 25, type: StepType.SetVariable, name: "FSOP Age 50 Date", formula: "=EDATE({Date Of Birth}, 600)"},
    {id: 26, type: StepType.SetVariable, name: "FSOP YOS Date: 50+20", formula: "=EDATE({Service Computation Date}, 240)"},
    {id: 27, type: StepType.SetVariable, name: "FSOP Fully Eligible Date: 50+20", formula: "=MAX({FSOP Age 50 Date}, {FSOP YOS Date: 50+20})"},
    {id: 28, type: StepType.SetVariable, name: "FSOP Age 57 Date", formula: "=EDATE({Date Of Birth}, 684)"},
    {id: 29, type: StepType.SetVariable, name: "FSOP YOS Date: 57+10", formula: "=EDATE({Service Computation Date}, 120)"},
    {id: 30, type: StepType.SetVariable, name: "FSOP Fully Eligible Date: 57+10", formula: "=MAX({FSOP Age 57 Date}, {FSOP YOS Date: 57+10})"},
    {id: 31, type: StepType.SetVariable, name: "FSOP First Full Eligibility Date", formula: "=MIN({FSOP Fully Eligible Date: 50+20}, {FSOP Fully Eligible Date: 57+10})"},

    // Calculations for CSRS
    {id: 32, type: StepType.SetVariable, name: "CSRS Full Eligibility Date", formula: "=EDATE({Date Of Birth}, 660)"},

    // Calculations for Special FERS
    {id: 33, type: StepType.SetVariable, name: "Special FERS YOS: 25 Years", formula: "=EDATE({Service Computation Date}, 300)"},
    {id: 34, type: StepType.SetVariable, name: "Special FERS Age 50 Date", formula: "=EDATE({Date Of Birth}, 600)"},
    {id: 35, type: StepType.SetVariable, name: "Special FERS YOS: 20 Years", formula: "=EDATE({Service Computation Date}, 240)"},
    {id: 36, type: StepType.SetVariable, name: "Special FERS Fully Eligible Date: 50+20", formula: "=MAX({Special FERS Age 50 Date}, {Special FERS YOS: 20 Years})"},
    {id: 37, type: StepType.SetVariable, name: "Special FERS First Full Eligibility Date", formula: "=MIN({Special FERS YOS: 25 Years}, {Special FERS Fully Eligible Date: 50+20})"},
    /* End retirement calculation section */

    {id: 38, type: StepType.InterstitialScreen, buttonPrompt: "Got It", name: "Interstitial - Retirement Date Result", heading: "Great!", prompt: RetirementCalculationFormula},
    {id: 39, type: StepType.Question, name: "Retirement Estimation Period", prompt: "When were you planning on retiring?", defaultOption: "ASAP!", acceptableValues: ["ASAP!", "End of the current year", "Other (enter details below)"], answerType: AnswerType.List, required: true, optionForAdditionalDetails: "Other (enter details below)"},
    {id: 40, type: StepType.InterstitialScreen, buttonPrompt: "Almost There!", name: "Interstitial - Almost There", heading: "Ok Great!", prompt: "Let's go through some other basic questions"},
    {id: 41, type: StepType.Question, name: "Base Salary", prompt: "What's your current base salary including any locality pay you receive, annually?", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true},
    {id: 42, type: StepType.SetVariable, name: "High 3 Estimate", formula: '=TO_CURRENCY({Base Salary} * 0.96)'},
    {id: 43, type: StepType.Question, name: "High Three", prompt: "Your pension is based on your High Three (H3), or your highest three consecutive years of service. Based on your position and current salary our system estimates your H3 of {High 3 Estimate}. Does that sound close? If not what should we use as an estimated High Three?", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true, defaultValue: "{High 3 Estimate}"},
    {id: 44, type: StepType.Question, name: "Current Annual Leave Balance", prompt: "How many hours of earned annual leave do you currently have?", answerType: AnswerType.Text, validationFormat: ValidationFormat.Number, required: true},
    {id: 45, type: StepType.SetVariable, name: "Estimated Retirement Pay", formula: '=TO_CURRENCY({Base Salary} / 2087 * {Current Annual Leave Balance} * 0.6855)'},
    {id: 46, type: StepType.InterstitialScreen, buttonPrompt: "Cool!", name: "Interstitial - Accrued Retirement Pay", prompt: "Great! At retirement the government will actually pay you for this time. If you retired with {Current Annual Leave Balance} hours of annual leave, we estimate you'd receive a check for {Estimated Retirement Pay} (after a mandatory 31.45% tax withholding)"},
    {id: 47, type: StepType.Question, name: "Current Sick Leave Balance", prompt: "How many hours of earned sick leave do you have?", answerType: AnswerType.Text, validationFormat: ValidationFormat.Number, required: true},
    {id: 48, type: StepType.SetVariable, name: "Optimal Sick Leave", formula: '=ROUNDUP((DAY({Service Computation Date})-1) * 5.797 + 1)'},
    {id: 49, type: StepType.InterstitialScreen, buttonPrompt: "Good To Know!", name: "Interstitial - Optimal Sick Leave", prompt: "OK great, sick leave in retirement works a little bit differently, with a certain portion of your leave counting toward your time in service and the remainder as use or lose. In your case, we'd recommend the minimum sick leave you retire with, aside from zero is {Optimal Sick Leave} hours. For a more detailed breakdown on sick leave strategy, one of our teammates will walk you through it!"},
    {id: 50, type: StepType.InterstitialScreen, buttonPrompt: "Let's Go!", name: "Interstitial - Start With TSP", prompt: "Let's move toward deductions coming out of your paycheck, starting with the TSP"},
    {id: 51, type: StepType.Question, name: "Contributing To TSP", prompt: "Are you contributing to the TSP?", defaultOption: "Yes", acceptableValues: ["Yes", "No"], answerType: AnswerType.List, required: true},
    {id: 52, type: StepType.Question, name: "TSP Percent", prompt: "What percentage or how much per pay period?", answerType: AnswerType.Text, required: true, displayConditions: '=({Contributing To TSP} = "Yes")'},
    {id: 53, type: StepType.InterstitialScreen, buttonPrompt: "Thanks!", name: "Interstitial - TSP Info", prompt: "OK, we always recommend FERS employees contribute at least 5% to their TSP, since the government matches up to that amount. You can read more about how the match works on our website."},
    {id: 54, type: StepType.Question, name: "TSP Loans", prompt: "Do you have any TSP loans outstanding?", defaultOption: "Yes", acceptableValues: ["Yes", "No"], answerType: AnswerType.List, required: true, displayConditions: '=({Contributing To TSP} = "Yes")'},
    {id: 55, type: StepType.InterstitialScreen, buttonPrompt: "OK", name: "Interstitial - Health Info", prompt: "OK, now let's talk about your healthcare."},
    {id: 56, type: StepType.Question, name: "Health Insurance", prompt: "What health insurance are you enrolled in?", defaultOption: "Tricare", acceptableValues: ["Tricare", "FEHB", "Other (enter details below)"], answerType: AnswerType.List, required: true, optionForAdditionalDetails: "Other (enter details below)"},
    {id: 57, type: StepType.Question, name: "FEHB Code", prompt: "What's your FEHB enrollment code?", acceptableValues: FehbCodes, answerType: AnswerType.Select, required: true, displayConditions: '=({Health Insurance} = "FEHB")', placeholder: "Select a code..."},
    {id: 58, type: StepType.Question, name: "Health Insurance Premium", prompt: "How much do you pay for your health insurance per pay period?", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true, displayConditions: '=({Health Insurance} <> "Tricare")'},

    // Deduction questions

    // Deduction 1
    {id: 59, type: StepType.Question, name: "Has Deductions 1", prompt: "Do you have any other deductions, not including FICA, taxes, and pension deductions, coming out of your pay stub?", acceptableValues: ["Yes", "No"], answerType: AnswerType.List, required: true},
    {id: 60, type: StepType.Question, name: "Deduction 1 Name", prompt: 'How would you describe your deduction?', acceptableValues: Deductions, answerType: AnswerType.Select, required: true, placeholder: "Select a deduction...", displayConditions: '=({Has Deductions 1} = "Yes")'},
    {id: 61, type: StepType.Question, name: "Deduction 1 Amount", prompt: "Amount", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true, displayConditions: '=({Has Deductions 1} = "Yes")'},
    {id: 62, type: StepType.Question, name: "Keep In Retirement 1", prompt: "Do you expect to keep this in retirement?", acceptableValues: ["Yes", "No", "Uncertain"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 1} = "Yes")'},
    {id: 63, type: StepType.Question, name: "Has Deductions 2", prompt: "Do you have any other deductions?", acceptableValues: ["Yes", "No"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 1} = "Yes")'},

    // Deduction 2
    {id: 64, type: StepType.Question, name: "Deduction 2 Name", prompt: 'How would you describe your deduction?', acceptableValues: Deductions, answerType: AnswerType.Select, required: true, placeholder: "Select a deduction...", displayConditions: '=({Has Deductions 2} = "Yes")'},
    {id: 65, type: StepType.Question, name: "Deduction 2 Amount", prompt: "Amount", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true, displayConditions: '=({Has Deductions 2} = "Yes")'},
    {id: 66, type: StepType.Question, name: "Keep In Retirement 2", prompt: "Do you expect to keep this in retirement?", acceptableValues: ["Yes", "No", "Uncertain"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 2} = "Yes")'},
    {id: 67, type: StepType.Question, name: "Has Deductions 3", prompt: "Do you have any other deductions?", acceptableValues: ["Yes", "No"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 2} = "Yes")'},

    // Deduction 3
    {id: 68, type: StepType.Question, name: "Deduction 3 Name", prompt: 'How would you describe your deduction?', acceptableValues: Deductions, answerType: AnswerType.Select, required: true, placeholder: "Select a deduction...", displayConditions: '=({Has Deductions 3} = "Yes")'},
    {id: 69, type: StepType.Question, name: "Deduction 3 Amount", prompt: "Amount", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true, displayConditions: '=({Has Deductions 3} = "Yes")'},
    {id: 70, type: StepType.Question, name: "Keep In Retirement 3", prompt: "Do you expect to keep this in retirement?", acceptableValues: ["Yes", "No", "Uncertain"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 3} = "Yes")'},
    {id: 71, type: StepType.Question, name: "Has Deductions 4", prompt: "Do you have any other deductions?", acceptableValues: ["Yes", "No"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 3} = "Yes")'},

    // Deduction 4
    {id: 72, type: StepType.Question, name: "Deduction 4 Name", prompt: 'How would you describe your deduction?', acceptableValues: Deductions, answerType: AnswerType.Select, required: true, placeholder: "Select a deduction...", displayConditions: '=({Has Deductions 4} = "Yes")'},
    {id: 73, type: StepType.Question, name: "Deduction 4 Amount", prompt: "Amount", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true, displayConditions: '=({Has Deductions 4} = "Yes")'},
    {id: 74, type: StepType.Question, name: "Keep In Retirement 4", prompt: "Do you expect to keep this in retirement?", acceptableValues: ["Yes", "No", "Uncertain"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 4} = "Yes")'},
    {id: 75, type: StepType.Question, name: "Has Deductions 5", prompt: "Do you have any other deductions?", acceptableValues: ["Yes", "No"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 4} = "Yes")'},

    // Deduction 5
    {id: 76, type: StepType.Question, name: "Deduction 5 Name", prompt: 'How would you describe your deduction?', acceptableValues: Deductions, answerType: AnswerType.Select, required: true, placeholder: "Select a deduction...", displayConditions: '=({Has Deductions 5} = "Yes")'},
    {id: 77, type: StepType.Question, name: "Deduction 5 Amount", prompt: "Amount", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true, displayConditions: '=({Has Deductions 5} = "Yes")'},
    {id: 78, type: StepType.Question, name: "Keep In Retirement 5", prompt: "Do you expect to keep this in retirement?", acceptableValues: ["Yes", "No", "Uncertain"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 5} = "Yes")'},
    {id: 79, type: StepType.Question, name: "Has Deductions 6", prompt: "Do you have any other deductions?", acceptableValues: ["Yes", "No"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 5} = "Yes")'},

    // Deduction 6
    {id: 80, type: StepType.Question, name: "Deduction 6 Name", prompt: 'How would you describe your deduction?', acceptableValues: Deductions, answerType: AnswerType.Select, required: true, placeholder: "Select a deduction...", displayConditions: '=({Has Deductions 6} = "Yes")'},
    {id: 81, type: StepType.Question, name: "Deduction 6 Amount", prompt: "Amount", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true, displayConditions: '=({Has Deductions 6} = "Yes")'},
    {id: 82, type: StepType.Question, name: "Keep In Retirement 6", prompt: "Do you expect to keep this in retirement?", acceptableValues: ["Yes", "No", "Uncertain"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 6} = "Yes")'},
    {id: 83, type: StepType.Question, name: "Has Deductions 7", prompt: "Do you have any other deductions?", acceptableValues: ["Yes", "No"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 6} = "Yes")'},

    // Deduction 7
    {id: 84, type: StepType.Question, name: "Deduction 7 Name", prompt: 'How would you describe your deduction?', acceptableValues: Deductions, answerType: AnswerType.Select, required: true, placeholder: "Select a deduction...", displayConditions: '=({Has Deductions 7} = "Yes")'},
    {id: 85, type: StepType.Question, name: "Deduction 7 Amount", prompt: "Amount", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true, displayConditions: '=({Has Deductions 7} = "Yes")'},
    {id: 86, type: StepType.Question, name: "Keep In Retirement 7", prompt: "Do you expect to keep this in retirement?", acceptableValues: ["Yes", "No", "Uncertain"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 7} = "Yes")'},
    {id: 87, type: StepType.Question, name: "Has Deductions 8", prompt: "Do you have any other deductions?", acceptableValues: ["Yes", "No"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 7} = "Yes")'},

    // Deduction 8
    {id: 88, type: StepType.Question, name: "Deduction 8 Name", prompt: 'How would you describe your deduction?', acceptableValues: Deductions, answerType: AnswerType.Select, required: true, placeholder: "Select a deduction...", displayConditions: '=({Has Deductions 8} = "Yes")'},
    {id: 89, type: StepType.Question, name: "Deduction 8 Amount", prompt: "Amount", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true, displayConditions: '=({Has Deductions 8} = "Yes")'},
    {id: 90, type: StepType.Question, name: "Keep In Retirement 8", prompt: "Do you expect to keep this in retirement?", acceptableValues: ["Yes", "No", "Uncertain"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 8} = "Yes")'},
    {id: 91, type: StepType.Question, name: "Has Deductions 9", prompt: "Do you have any other deductions?", acceptableValues: ["Yes", "No"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 8} = "Yes")'},

    // Deduction 9
    {id: 92, type: StepType.Question, name: "Deduction 9 Name", prompt: 'How would you describe your deduction?', acceptableValues: Deductions, answerType: AnswerType.Select, required: true, placeholder: "Select a deduction...", displayConditions: '=({Has Deductions 9} = "Yes")'},
    {id: 93, type: StepType.Question, name: "Deduction 9 Amount", prompt: "Amount", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true, displayConditions: '=({Has Deductions 9} = "Yes")'},
    {id: 94, type: StepType.Question, name: "Keep In Retirement 9", prompt: "Do you expect to keep this in retirement?", acceptableValues: ["Yes", "No", "Uncertain"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 9} = "Yes")'},
    {id: 95, type: StepType.Question, name: "Has Deductions 10", prompt: "Do you have any other deductions?", acceptableValues: ["Yes", "No"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 9} = "Yes")'},

    // Deduction 10
    {id: 96, type: StepType.Question, name: "Deduction 10 Name", prompt: 'How would you describe your deduction?', acceptableValues: Deductions, answerType: AnswerType.Select, required: true, placeholder: "Select a deduction...", displayConditions: '=({Has Deductions 10} = "Yes")'},
    {id: 97, type: StepType.Question, name: "Deduction 10 Amount", prompt: "Amount", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true, displayConditions: '=({Has Deductions 10} = "Yes")'},
    {id: 98, type: StepType.Question, name: "Keep In Retirement 10", prompt: "Do you expect to keep this in retirement?", acceptableValues: ["Yes", "No", "Uncertain"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 10} = "Yes")'},
    {id: 99, type: StepType.Question, name: "Has Deductions 11", prompt: "Do you have any other deductions?", acceptableValues: ["Yes", "No"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 10} = "Yes")'},

    // Deduction 11
    {id: 100, type: StepType.Question, name: "Deduction 11 Name", prompt: 'How would you describe your deduction?', acceptableValues: Deductions, answerType: AnswerType.Select, required: true, placeholder: "Select a deduction...", displayConditions: '=({Has Deductions 11} = "Yes")'},
    {id: 101, type: StepType.Question, name: "Deduction 11 Amount", prompt: "Amount", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true, displayConditions: '=({Has Deductions 11} = "Yes")'},
    {id: 102, type: StepType.Question, name: "Keep In Retirement 11", prompt: "Do you expect to keep this in retirement?", acceptableValues: ["Yes", "No", "Uncertain"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 11} = "Yes")'},
    {id: 103, type: StepType.Question, name: "Has Deductions 12", prompt: "Do you have any other deductions?", acceptableValues: ["Yes", "No"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 11} = "Yes")'},

    // Deduction 12
    {id: 104, type: StepType.Question, name: "Deduction 12 Name", prompt: 'How would you describe your deduction?', acceptableValues: Deductions, answerType: AnswerType.Select, required: true, placeholder: "Select a deduction...", displayConditions: '=({Has Deductions 12} = "Yes")'},
    {id: 105, type: StepType.Question, name: "Deduction 12 Amount", prompt: "Amount", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true, displayConditions: '=({Has Deductions 12} = "Yes")'},
    {id: 106, type: StepType.Question, name: "Keep In Retirement 12", prompt: "Do you expect to keep this in retirement?", acceptableValues: ["Yes", "No", "Uncertain"], answerType: AnswerType.List, required: true, displayConditions: '=({Has Deductions 12} = "Yes")'},

    {id: 107, type: StepType.InterstitialScreen, buttonPrompt: "OK", name: "Interstitial - Pay Stub", heading: "Almost Done!", prompt: "Just a few more questions on your pay stub."},
    {id: 108, type: StepType.Question, name: "Net Take-Home Pay", prompt: "After all deductions, what's a normal take home pay for you per pay period?", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true},
    {id: 109, type: StepType.Question, name: "Union Affiliation", prompt: "We noticed you're paying union dues, which union are you a member of?", acceptableValues: Unions, answerType: AnswerType.Select, required: true, placeholder: "Select a union...", displayConditions: '=OR({Deduction 1 Name} = "Union Dues", {Deduction 2 Name} = "Union Dues", {Deduction 3 Name} = "Union Dues", {Deduction 4 Name} = "Union Dues", {Deduction 5 Name} = "Union Dues", {Deduction 6 Name} = "Union Dues", {Deduction 7 Name} = "Union Dues", {Deduction 8 Name} = "Union Dues", {Deduction 9 Name} = "Union Dues", {Deduction 10 Name} = "Union Dues", {Deduction 11 Name} = "Union Dues", {Deduction 12 Name} = "Union Dues")'},
    {id: 110, type: StepType.Question, name: "Union Local", prompt: "What's your local number or the city you're a member of?", acceptableValues: UnionLocals, answerType: AnswerType.Select, required: true, placeholder: "Select an option...", displayConditions: '=OR({Deduction 1 Name} = "Union Dues", {Deduction 2 Name} = "Union Dues", {Deduction 3 Name} = "Union Dues", {Deduction 4 Name} = "Union Dues", {Deduction 5 Name} = "Union Dues", {Deduction 6 Name} = "Union Dues", {Deduction 7 Name} = "Union Dues", {Deduction 8 Name} = "Union Dues", {Deduction 9 Name} = "Union Dues", {Deduction 10 Name} = "Union Dues", {Deduction 11 Name} = "Union Dues", {Deduction 12 Name} = "Union Dues")'},
    {id: 111, type: StepType.InterstitialScreen, buttonPrompt: "OK", name: "Interstitial - TSP", prompt: "Let's talk about your TSP"},
    {id: 112, type: StepType.Question, name: "Traditional Balance", prompt: "What's your current TSP Balance?", answerType: AnswerType.Text, validationFormat: ValidationFormat.Currency, required: true},
    {id: 113, type: StepType.Question, name: "Risk Tolerance", prompt: "How would you describe yourself as an investor? Are you conservative? Aggressive?", defaultOption: "Conservative", acceptableValues: ["Very Conservative", "Conservative", "Moderate", "Aggressive", "Very Aggressive"], answerType: AnswerType.List, required: true},
    {id: 114, type: StepType.InterstitialScreen, buttonPrompt: "OK", name: "Interstitial - Just A Few More Questions", prompt: "Just a few more questions"},
    {id: 115, type: StepType.SetVariable, name: "Estimated Social Security", formula: '=MAX(MIN({Base Salary} / 30, 3627), 1033)'},
    {id: 116, type: StepType.Question, name: "Tax Rate", prompt: "We estimated your all-in tax rate to be about 20%. If you think it's going to be something else, please select the right amount below.", acceptableValues: TaxRates, answerType: AnswerType.Select, required: true, placeholder: "Select a tax rate...", defaultOption: "20%"},
]