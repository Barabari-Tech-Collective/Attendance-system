import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

export const markAttendanceInSheet = async (
  sheetId,
  studentName,
  studentId,
  className,
  classDateFormatted
) => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // -----------------------------------------------
    // STEP 1: Read whole sheet
    // -----------------------------------------------
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1!A:Z",
    });

    let rows = readRes.data.values || [];

    // If sheet is empty → create header
    if (rows.length === 0) {
      rows = [];
      rows.push(["Name", classDateFormatted + " – " + className]); // header
      rows.push([studentName, "1"]); // first entry
    } else {
      // -----------------------------------------------
      // STEP 2: Ensure column exists
      // -----------------------------------------------
      let header = rows[0];
      let columnName = classDateFormatted + " – " + className;
      let columnIndex = header.indexOf(columnName);

      if (columnIndex === -1) {
        header.push(columnName);
        columnIndex = header.length - 1;

        rows = rows.map((r, i) => {
          if (i === 0) return header;
          return [...r, "0"];
        });
      }

      // -----------------------------------------------
      // STEP 3: Find student row
      // -----------------------------------------------
      let studentRow = rows.findIndex((r) => r[0] === studentName);

      if (studentRow === -1) {
        // New student
        const newRow = new Array(header.length).fill("0");
        newRow[0] = studentName;
        newRow[columnIndex] = "1";

        rows.push(newRow);
      } else {
        rows[studentRow][columnIndex] = "1";
      }
    }

    // -----------------------------------------------
    // STEP 4: Update whole sheet
    // -----------------------------------------------
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: rows },
    });

    console.log("✔️ Attendance updated sheet");

  } catch (err) {
    console.log("❌ Google Sheet error");
    console.log(err);
  }
};
