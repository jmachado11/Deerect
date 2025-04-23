'use server';

import { google } from 'googleapis';

export async function addToWaitlist(email) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { 
      success: false, 
      message: 'Valid email is required' 
    };
  }

  try {
    // Properly format the private key
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"$/g, '').replace(/^"/g, '')
      : '';

    // Create OAuth2 client with proper error handling
    const client = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    try {
      // Authorize the client
      await client.authorize();
    } catch (authError) {
      console.error('Authentication error:', authError);
      return { 
        success: false, 
        message: 'Authentication failed with Google Services' 
      };
    }

    // Create sheets API instance with the authorized client
    const sheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    // First, verify the sheet exists
    try {
      const sheetMetadata = await sheets.spreadsheets.get({
        spreadsheetId,
        ranges: ['Waitlist!A1:B1'],
        includeGridData: false,
      });

      // If we get here, the sheet exists
      const range = 'Waitlist!A:B';

      // Check if email already exists
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values || [];
      const emailExists = rows.some(row => row[0] === email);

      if (emailExists) {
        return { 
          success: true, 
          alreadyExists: true,
          message: 'Email already exists in waitlist'
        };
      }

      // Add the new email
      const timestamp = new Date().toISOString();
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[email, timestamp]],
        },
      });

      return { 
        success: true, 
        message: 'Email added successfully to waitlist'
      };
    } catch (error) {
      console.error('Google Sheets error:', error);
      if (error.code === 400) {
        return { 
          success: false, 
          message: 'Sheet "Waitlist" not found. Please create a sheet named "Waitlist" in your Google Sheet.'
        };
      }
      return { 
        success: false, 
        message: 'Failed to add email to waitlist'
      };
    }
  } catch (error) {
    console.error('Error adding email to Google Sheet:', error);
    return { 
      success: false, 
      message: 'Failed to add email to waitlist'
    };
  }
}