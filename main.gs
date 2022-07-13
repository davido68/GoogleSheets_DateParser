// Change this to match the Locale settings in the sheet.
const paramSeparator = ";";

const sheetsOfInterest = [
    {
        SheetName:"Útlagður kostnaður félaga",
        StartingRow:8,
        EndingRow:-1,
        Columns:[
            {
                Index:1,
                Format:"dd.mm.yy",
                Align:"right"
            },
            {
                Index:10,
                Format:"d. mmm",
                Align:"left"
            }
        ]
    },
    {
        SheetName:"Reikningar til greiðslu",
        StartingRow:7,
        EndingRow:-1,
        Columns:[
            {
                Index:4,
                Format:"dd.mm.yy",
                Align:"right"
            },
            {
                Index:5,
                Format:"dd.mm.yy",
                Align:"right"
            }
        ]
    },
    {
        SheetName:"Reikningar til greiðslu",
        StartingRow:1,
        EndingRow:1,
        Columns:[
            {
                Index:12,
                Format:"\"Síðast uppfært: \"d.m.yyyy",
                Align:"left"
            }
        ]
    },
    {
        SheetName:"Niðurfellingar",
        StartingRow:2,
        EndingRow:-1,
        Columns:[
            {
                Index:2,
                Format:"dd.mm.yy",
                Align:"left"
            },
                        {
                Index:3,
                Format:"dd.mm.yy",
                Align:"left"
            },
            {
                Index:4,
                Format:"dd.mm.yy",
                Align:"left"
            }
        ]
    }
];

function onEdit(e) {
    handleCellsOfInterest(e.range);
}
