function overlappingRows(range, setting) {
    if( range.sheet != setting.SheetName )
        return false;

    if( range.bottom < setting.StartingRow )
        return false;

    if( setting.EndingRow != -1 && range.top > setting.EndingRow )
        return false;

    return true;
}

function handleCellsOfInterest(range) {
    var sheetName = range.getSheet().getName();
    var cell = range.getCell(1,1);

    var rangeInfo = {
        sheet: sheetName,
        top : cell.getRow(),
        left : cell.getColumn()
    }
    rangeInfo.bottom = rangeInfo.top + range.getNumRows() - 1;
    rangeInfo.right = rangeInfo.left + range.getNumColumns() - 1;

    var activeSettings = sheetsOfInterest.filter(setting => {
        return overlappingRows(rangeInfo, setting);;
    });

    if( activeSettings.length == 0 )
      return;

    var activeSheet = range.getSheet();

    for( let i = 0; i < activeSettings.length; i++ ) {
        let rowSetting = activeSettings[i];
        let rowStart = Math.max(rowSetting.StartingRow, rangeInfo.top);
        let rowEnd = Math.min(rowSetting.EndingRow, rangeInfo.bottom);
        if( rowEnd == -1 )
            rowEnd = rangeInfo.bottom;

        let boxOfInterest = {
            top: rowStart,
            left: rangeInfo.left,
            bottom: rowEnd,
            right: rangeInfo.right
        };
        handleColumnsOfInterest(activeSheet, rowSetting, boxOfInterest);
    }
}

function handleColumnsOfInterest(activeSheet, rowSetting, boxOfInterest) {
    var textFormats = [];
    for( let i = 0; i < boxOfInterest.bottom - boxOfInterest.top + 1; i++ )
        textFormats[i] = ["@"];

    for( let i = 0; i < rowSetting.Columns.length; i++ ) {
        let colSetting = rowSetting.Columns[i];
        let index = colSetting.Index;

        if( index >= boxOfInterest.left && index <= boxOfInterest.right ) {
            let rowStart = boxOfInterest.top;
            let numRows = boxOfInterest.bottom - boxOfInterest.top + 1;
            let activeRange = activeSheet.getRange(rowStart, colSetting.Index, numRows);
            handleColumn(activeRange, colSetting, textFormats);
        }
    }
}

function handleColumn(activeRange, colSetting, textFormats) {
    var rformats = activeRange.getNumberFormats();
    activeRange.setNumberFormats(textFormats);

    var rvalues = activeRange.getDisplayValues();
    var raligns = activeRange.getHorizontalAlignments();

    var changed = false;
    for( let i = 0; i < rvalues.length; i++ ) {
        let tmpDate = parseDateString(rvalues[i][0].toString());
        if( tmpDate != null ) {
            rvalues[i][0]  = `=date(${tmpDate.getFullYear()}${paramSeparator} ${tmpDate.getMonth()+1}${paramSeparator} ${tmpDate.getDate()})`;
            rformats[i][0] = colSetting.Format;
            raligns[i][0]  = colSetting.Align;
            
            changed = true;
        }
    }

    activeRange.setValues(rvalues);
    activeRange.setNumberFormats(rformats);
    activeRange.setHorizontalAlignments(raligns);
}
