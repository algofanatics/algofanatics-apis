import { google, sheets_v4 } from 'googleapis';
import { ApiError, StatusCode } from '../utils';

const spreadsheetTitle = 'Core User Metrics';

class SpreadsheetService {
  private sheets: sheets_v4.Sheets;
  private userService: any;

  constructor(authClient: any, userService: any) {
    this.sheets = google.sheets({ version: 'v4', auth: authClient });
    this.userService = userService;
  }

  public async createAndPopulateSpreadsheet(): Promise<void> {
    try {
      const data = await this.userService.getUsersWithActiveReports();

      console.log(data);

      // Create a new Google Sheets spreadsheet
      const spreadsheetRequestBody = {
        properties: {
          title: spreadsheetTitle,
        },
      };
      const spreadsheet = await this.sheets.spreadsheets.create({
        requestBody: spreadsheetRequestBody,
      });
      const spreadsheetId = spreadsheet.data.spreadsheetId as string;

      // Prepare the data to be inserted into the spreadsheet
      const sheetData = data.map((item: any) => [
        item.firstName,
        item.lastName,
        item.email,
        item.phoneNumber,
        item.dob,
        item.bvn
      ]);

      // Populate the Google Sheets spreadsheet with data
      const sheetRange = 'Sheet1!A1:G';
      const valueInputOption = 'RAW';
      const valueRangeBody = {
        values: sheetData,
      };

      const params: sheets_v4.Params$Resource$Spreadsheets$Values$Update = {
        spreadsheetId,
        range: sheetRange,
        valueInputOption,
        requestBody: valueRangeBody,
      };
      await this.sheets.spreadsheets.values.update(params);
    } catch (error) {
      throw new ApiError(
        'core mobile api',
        error as string,
        'getActiveReports',
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default SpreadsheetService;
