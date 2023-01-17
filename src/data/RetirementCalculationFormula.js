export const RetirementCalculationFormula = `
    =IF({Retirement System} = "FERS", 
        IF({FERS: First Full Eligibility Date} < NOW(), 
            "You're fully eligible to retire right now!", 
            "Your first fully eligible retirement date is " & TEXT({FERS: First Full Eligibility Date}, "MM/DD/YYYY") & ". This is the first date you can retire with a full unreduced pension with access to all the benefits you've earned as a " & {Agency} & " employee."
        ),
        IF({Retirement System} = "FSOP",
            IF({FSOP First Full Eligibility Date} < NOW(),
                "You're fully eligible to retire right now!",  
                "Your first fully eligible retirement date is " & TEXT({FSOP First Full Eligibility Date}, "MM/DD/YYYY") & ". This is the first date you can retire with a full unreduced pension with access to all the benefits you've earned as a " & {Agency} & " employee."
            ),
            IF(OR({Retirement System} = "CSRS", {Retirement System} = "CSRS Offset"),
                IF({CSRS Full Eligibility Date} < NOW(),
                    "You're fully eligible to retire right now!",
                    "Your first fully eligible retirement date is " & TEXT({CSRS Full Eligibility Date}, "MM/DD/YYYY") & ". This is the first date you can retire with a full unreduced pension with access to all the benefits you've earned as a " & {Agency} & " employee."
                ),
                IF({Retirement System} = "Special FERS",
                    IF({Special FERS First Full Eligibility Date} < NOW(),
                        "You're fully eligible to retire right now!",
                        "Your first fully eligible retirement date is " & TEXT({Special FERS First Full Eligibility Date}, "MM/DD/YYYY") & ". This is the first date you can retire with a full unreduced pension with access to all the benefits you've earned as a " & {Agency} & " employee."
                    ),
                    "Please get in touch and we'll let you know when you're eligible to retire."
                )
            )
        )
    )`