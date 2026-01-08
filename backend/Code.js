function doGet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

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

    const result = {
        stocks: stocks,
        history: history
    };

    return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
}
