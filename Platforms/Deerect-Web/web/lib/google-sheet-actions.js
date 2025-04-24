'use server';

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import os from 'os';


export async function addToWaitlist(email) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { 
      success: false, 
      message: 'Valid email is required' 
    };
  }

  try {
    // Path to your credentials file
    const keyFilePath = path.join(process.cwd(), 'public', 'assets', 'secrets', 'google-credentials.json');
    
    // Check if the file exists
    if (!fs.existsSync(keyFilePath)) {
      console.error('Credentials file not found at:', keyFilePath);
      return { 
        success: false, 
        message: 'Authentication configuration error: Credentials file not found' 
      };
    }
    
    console.log('Credentials file found, attempting to authenticate...');

      
      
      const client = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

    try {
      // Get an auth client
      const authClient = await client.getClient();
      
      // Create sheets API instance
      const sheets = google.sheets({ 
        version: 'v4', 
        auth: authClient 
      });
      
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      
      if (!spreadsheetId) {
        return { 
          success: false, 
          message: 'Configuration error: Missing spreadsheet ID' 
        };
      }
      
      // Use the sheet name 'Waitlist' - make sure this exists in your Google Sheet
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
    } catch (authError) {
      console.error('Google Sheets API error:', authError);
      
      // Check for specific error conditions
      if (authError.message?.includes('no such sheet')) {
        return { 
          success: false, 
          message: 'Sheet "Waitlist" not found. Please create a sheet named "Waitlist" in your Google Sheet.'
        };
      }
      
      return { 
        success: false, 
        message: `Google API error: ${authError.message}` 
      };
    }
  } catch (error) {
    console.error('Error in waitlist function:', error);
    return { 
      success: false, 
      message: `Failed to add email to waitlist: ${error.message}`
    };
  }
}