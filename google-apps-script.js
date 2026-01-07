function doGet() {
    const sheetName = "現值"; // Your specific sheet name
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({ error: "Sheet not found" }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    const [headers, ...rows] = sheet.getDataRange().getValues();

    // Convert rows to array of objects
    const data = rows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index];
        });
        return obj;
    });

    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}
