function parseDateString(dateString) {
    if( dateString.length == 5 && !isNaN(dateString) )
        dateString = "0" + dateString;

    var stateMachine = initStateMachine();
    var results = runStateMachine(stateMachine, dateString);

    var endState = results.endState;
    if( endState == null || !endState.isEndState )
        return null;

    return endState.endFunction(results.savedTokens, results.endToken);
}

const ERROR_STATE = -1;

function initStateMachine() {
    const number0 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const number1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    var stateMachine = [
        {
            state: 0,
            rules: [
                {input: ['d'], newState: 1},
                {input: ['0'], newState: 3},
                {input: number1, newState: 2, addToken: true},
                {input: null, newState: ERROR_STATE}
            ],
            isEndState: false
        },
        {
            state: 1,
            rules: [
                {input: ['+','-'], newState: 4, addToken: true, saveTokenAfter: "dayOp"},
                {input: null, newState: ERROR_STATE}
            ],
            isEndState: true,
            endFunction: (tokenValues, token) => { return new Date(); }
        },
        {
            state: 2,
            rules: [
                {input: number0, newState: 5, addToken: true, saveTokenAfter: "day"},
                {input: null, newState: 6, saveTokenFirst: "day"}
            ],
            isEndState: true,
            endFunction: (tokenValues, token) => {
                let today = new Date();
                let year  = today.getFullYear();
                let month = today.getMonth();
                let day   = parseInt(token);
                let eom   = endOfMonth(month, year);
                if( day > eom )
                    day = eom;
                return new Date(year, month, day);
            }
        },
        {
            state: 3,
            rules: [
                {input: number1, newState: 5, addToken: true, saveTokenAfter: "day"},
                {input: null, newState: ERROR_STATE}
            ],
            isEndState: false,
        },
        {
            state: 4,
            rules: [
                {input: number1, newState: 7, clearToken: true, addToken: true},
                {input: null, newState: ERROR_STATE}
            ],
            isEndState: false,
        },
        {
            state: 5,
            rules: [
                {input: ['0'], newState: 8},
                {input: number1, newState: 9, clearToken: true, addToken: true},
                {input: null, newState: 6}
            ],
            isEndState: true,
            endFunction: (tokenValues, token) => {
                let today = new Date();
                let year  = today.getFullYear();
                let month = today.getMonth();
                let day   = parseInt(tokenValues["day"]);
                let eom   = endOfMonth(month, year);
                if( day > eom )
                    day = eom;
                return new Date(year, month, day);
            }
        },
        {
            state: 6,
            rules: [
                {input: ['0'], newState: 8},
                {input: number1, newState: 9, clearToken: true, addToken: true},
            ],
            isEndState: false,
        },
        {
            state: 7,
            rules: [
                {input: number0, newState: 7, addToken: true},
                {input: null, newState: ERROR_STATE}
            ],
            isEndState: true,
            endFunction: (tokenValues, token) => {
                let dayOp = tokenValues["dayOp"];
                let day = parseInt(token);
                let today = new Date();
                return dayOp == "+" ? addDays(today, day) : subDays(today, day);
            }
        },
        {
            state: 8,
            rules: [
                {input: number1, newState: 10, clearToken: true, addToken: true, saveTokenAfter: "month"},
                {input: null, newState: ERROR_STATE}
            ],
            isEndState: false,
        },
        {
            state: 9,
            rules: [
                {input: number0, newState: 10, addToken: true, saveTokenAfter: "month"},
                {input: null, newState: 11, saveTokenFirst: "month"}
            ],
            isEndState: true,
            endFunction: (tokenValues, token) => {
                let today = new Date();
                let year  = today.getFullYear();
                let month = parseInt(token) - 1;
                let day   = parseInt(tokenValues["day"]);
                let eom   = endOfMonth(month, year);;
                if( day > eom )
                    day = eom;
                return new Date(year, month, day);
            }
        },
        {
            state: 10,
            rules: [
                {input: ['0'], newState: 12, clearToken: true},
                {input: number1, newState: 12, clearToken: true, addToken: true},
                {input: null, newState: 11}
            ],
            isEndState: true,
            endFunction: (tokenValues, token) => {
                let today = new Date();
                let year  = today.getFullYear();
                let month = parseInt(token) - 1;
                let day   = parseInt(tokenValues["day"]);
                let eom   = endOfMonth(month, year);;
                if( day > eom )
                    day = eom;
                return new Date(year, month, day);
            }
        },
        {
            state: 11,
            rules: [
                {input: ['0'], newState: 12, clearToken: true},
                {input: number1, newState: 12, clearToken: true, addToken: true},
            ],
            isEndState: false
        },
        {
            state: 12,
            rules: [
                {input: number0, newState: 13, addToken: true},
                {input: null, newState: ERROR_STATE}
            ],
            isEndState: false
        },
        {
            state: 13,
            rules: [
                {input: number0, newState: 14, addToken: true},
                {input: null, newState: ERROR_STATE}
            ],
            isEndState: true,
            endFunction: (tokenValues, token) => {
                let year = parseInt(token);
                year += year > 79 ? 1900 : 2000; // 2 digit years are between 1980 and 2079 - because we have to account for the eighties :)

                let month = parseInt(tokenValues["month"]) - 1;
                let day   = parseInt(tokenValues["day"]);
                return new Date(year, month, day);
            }
        },
        {
            state: 14,
            rules: [
                {input: number0, newState: 15, addToken: true},
                {input: null, newState: ERROR_STATE}
            ],
            isEndState: false,
        },
        {
            state: 15,
            rules: [
                {input: null, newState: ERROR_STATE}
            ],
            isEndState: true,
            endFunction: (tokenValues, token) => {
                let year  = parseInt(token);
                let month = parseInt(tokenValues["month"]) - 1;
                let day   = parseInt(tokenValues["day"]);
                return new Date(year, month, day);
            }
        }
    ];

    return stateMachine;
}

function runStateMachine(stateMachine, dateString) {
    var stateIdx = 0;
    var token = "";

    var tokenValues = {};

    for( let i = 0; i < dateString.length; i++ ) {
        let c = dateString[i];

        let state = stateMachine[stateIdx];
        for( let j = 0; j < state.rules.length; j++ ) {
            let rule = state.rules[j];

            if( rule.input == null || rule.input.includes(c) ) {
                if( rule.saveTokenFirst != undefined )
                    tokenValues[rule.saveTokenFirst] = token;

                if( rule.clearToken )
                    token = "";
                if( rule.addToken )
                    token += c;

                if( rule.saveTokenAfter != undefined )
                    tokenValues[rule.saveTokenAfter] = token;

                stateIdx = rule.newState;
                break;
            }
        }
        if( stateIdx == ERROR_STATE )
            break;
    }

    var stateResults = {
        endState: stateIdx == ERROR_STATE ? null : stateMachine[stateIdx],
        endToken: token,
        savedTokens: tokenValues
    };
    return stateResults;
}
