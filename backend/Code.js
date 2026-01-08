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

    // More efficient fetching for history and latest stats
    const getPerformanceData = () => {
        const sheet = ss.getSheetByName("歷史現值");
        if (!sheet) return { history: [], stats: null };

        const range = sheet.getDataRange();
        if (range.isBlank()) return { history: [], stats: null };

        const values = range.getValues();
        const headers = values[0];
        const lastRow = values[values.length - 1];

        // 1. History (slimmed for chart)
        const dateIdx = headers.indexOf("日期");
        const valueIdx = headers.indexOf("總值");
        const growIdx = headers.indexOf("累積成長");

        const history = values.slice(1).map(row => ({
            date: row[dateIdx],
            value: row[valueIdx],
            totalGrow: row[growIdx]
        }));

        // 2. Latest Stats (all metrics from the very last row)
        const stats = {};
        headers.forEach((header, idx) => {
            stats[header] = lastRow[idx];
        });

        return { history, stats };
    };

    const stocks = getSheetData("現值");
    const { history, stats } = getPerformanceData();

    const result = {
        stocks: stocks,
        history: history,
        stats: stats
    };

    return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
}
