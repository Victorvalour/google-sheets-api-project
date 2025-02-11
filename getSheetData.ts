import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';


const SHEET_ID = '1V07ce87n7_dpb_zfFT_Tee5MfizLXdDPHoojzCDuKIs';
const RANGE = 'Sheet1!A2:F'; 


const credentials = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'bold-mantis-450511-d2-c8b500ea4997.json'), 'utf8')
);


const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Code to fetch data from Google Sheets
const getSheetData = async () => {
  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }

  //Code block to format the data
  const formattedData = rows.map((row) => {
    return {
      name: row[0],
      column_values: 
       {
      due_date: row[1],
      budget: {
        value: parseFloat(row[2].replace('$', '')),
        type: "currency"
      },
      progress: parseInt(row[3].replace('%', '')),
      timeline: {
        start_date: row[4].split(' - ')[0],
        end_date: row[4].split(' - ')[1],
      },
      description: row[5], 
         },
  
        
    }
  })

  // Convert to JSON format
  const jsonOutput = JSON.stringify(formattedData, null, 2);
  console.log(jsonOutput);

   // This saves the JSON to a file
  fs.writeFileSync('output.json', jsonOutput);
};


getSheetData().catch(console.error);
