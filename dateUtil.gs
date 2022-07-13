const MS_IN_A_DAY = 24 * 3600 * 1000;
const DAYS_IN_MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];  

function isLeapYear(year) {
    if( year % 4 != 0 )
        return false;

    if( year % 100 == 0 )
        return year % 400 == 0;

    return true;
}

function startOfMonth(theDate) {
    return new Date(theDate.getFullYear(), theDate.getMonth(), 1);
}

function endOfMonthDate(theDate) {
    var dd = endOfMonth(theDate.getMonth(), theDate.getFullYear());
    return new Date(theDate.getFullYear(), theDate.getMonth(), dd);
}

function endOfMonth(month, year) {
    var dd = DAYS_IN_MONTHS[month];
    if( month == 2 && isLeapYear(year) )
        dd++;

    return dd;
}

function addDays(theDate, days) {
    var newDate = new Date(theDate);
    newDate.setTime(theDate.getTime() + days * MS_IN_A_DAY);
    return newDate;
}

function subDays(theDate, days) {
    return addDays(theDate, -days);
}

function addMonths(aDate, months) {
    if( months < 0 )
        return subMonths(aDate, -months);

    var yy = aDate.getFullYear();
    var mm = aDate.getMonth();
    var dd = aDate.getDate();

    var isEndOfMonth = endOfMonth(mm, yy) == dd;

    yy = yy + Math.floor((mm + months)/12);
    mm = (mm + months) % 12;

    var newDateEOM = endOfMonthDate(new Date(yy, mm, 1));
    if( isEndOfMonth || dd > newDateEOM.getDate() )
        return newDateEOM;

    return new Date(yy, mm, dd);
}

function subMonths(aDate, months) {
    if( months < 0 )
        return addMonths(aDate, -months);
    
    var year = aDate.getFullYear();
    var month = aDate.getMonth();
    var day = aDate.getDate();

    year -= Math.floor(months / 12);
    month -= months % 12;

    if( month < 0 ) {
        year--;
        month += 12;
    }

    var dd = endOfMonth(month, year);
    if( day > dd )
        day = dd;

    return new Date(year, month, day);
}
