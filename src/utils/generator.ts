import { StringBuilder } from "./services";

// let Req =  new InvoiceGenerationRequest
// {
//     NumItems = lineItems.length,
//     transactiondate = DateTime.Now,
//     transactionCount = lastSequentialNumber + 1,
//     InvoiceTotal = total,
//     VATAmount = totalVAT,
//     businessId = getTerminalDetails.taxpayerId,
//     terminalPosition = getTerminalDetails.position
// };

function dateToJulianDayNumber(date:any) {
    const time = date.getTime();
    const tzoffset = date.getTimezoneOffset() * 60000;
    const dateUTC = new Date(time - tzoffset);
    
    const year = dateUTC.getFullYear();
    const month = dateUTC.getMonth() + 1;
    const day = dateUTC.getDate();
    
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export const generateInvoiceNumber=(taxpayerId:number, position:number, jDate:Date, transactionCount:number)=>{
    let date = dateToJulianDayNumber(jDate) 
    return `${base10ToBase64(taxpayerId)}-${base10ToBase64(position)}-${base10ToBase64(date)}-${base10ToBase64(transactionCount)}`;
}

function base10ToBase64(numb:number) {
    if (numb === 0) return "A";  // 'A' represents 0 in standard Base64

    const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let result = [];
    // Handle negative numbers
    const isNegative = numb < 0;
    numb = Math.abs(numb);
    while (numb > 0) {
        const remainder = numb % 64;
        result.unshift(base64Chars[remainder]);  // Add to beginning of array
        numb = Math.floor(numb / 64);
    }
    // Add negative sign if needed
    if (isNegative) result.unshift('-');
    
    return result.join('');
}
