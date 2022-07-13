// Change this to match the Locale settings in the sheet.
const paramSeparator = ";";

// List of sheets (as objects) in which to activate the script
// EndingRow = -1 means "'til end of sheet"
// For disjoined rows you have to  make new entry for each group of rows (as in Sheet 2).
const sheetsOfInterest = [
    {
        SheetName:"Sheet 1",
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
        SheetName:"Sheet 2",
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
        SheetName:"Sheet 2",
        StartingRow:1,
        EndingRow:1,
        Columns:[
            {
                Index:12,
                Format:"\"Last updated: \"d.m.yyyy",
                Align:"left"
            }
        ]
    },
    {
        SheetName:"Sheet 3",
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
