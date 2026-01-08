function doGet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Helper to get or create market data tab with formulas
    const getMarketIndexData = () => {
        let sheet = ss.getSheetByName("大盤");

        // If sheet doesn't exist, create it and add formulas
        if (!sheet) {
            sheet = ss.insertSheet("大盤");
            sheet.getRange("A1:D1").setValues([["名稱", "指數", "漲跌", "漲跌幅"]]);
            sheet.getRange("A2").setValue("台股加權");
            sheet.getRange("B2").setFormula('=GOOGLEFINANCE("TPE:TAIEX")');
            sheet.getRange("C2").setFormula('=GOOGLEFINANCE("TPE:TAIEX", "change")');
            sheet.getRange("D2").setFormula('=GOOGLEFINANCE("TPE:TAIEX", "changepct") / 100');
            sheet.getRange("D2").setNumberFormat("0.00%");
            SpreadsheetApp.flush(); // Ensure formulas calculate
        }

        const range = sheet.getDataRange();
        const [headers, ...rows] = range.getValues();

        return rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        });
    };

    const getSheetData = (sheetName) => {
        const sheet = ss.getSheetByName(sheetName);
        if (!sheet) return [];

        const range = sheet.getDataRange();
        if (range.isBlank()) return [];

        const [headers, ...rows] = range.getValues();

        return rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        });
    };

    const stocks = getSheetData("現值");
    const history = getSheetData("歷史現值");
    const market = getMarketIndexData();

    const result = {
        stocks: stocks,
        history: history,
        market: market
    };

    return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
}
