import fs from 'fs'
import readline from 'readline'
import { google } from 'googleapis'

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'

const LEADERBOARD_TOKEN = process.env['LEADERBOARD_TOKEN'] || 0
const LEADERBOARD_SHEET =
  process.env['LEADERBOARD_SHEET'] || '1d3pZNof8p3z8M9O3MH5FZG5dA3e-L52XiJ4qA5o7X0Y'

async function updateDB(lst: any[][]) {
  console.log('Found stuff', lst)
}

function getCredentials() {
  let credentials = process.env['LEADERBOARD_CREDENTIALS']
  if (!credentials) {
    return fs.readFileSync('credentials.json')
  }
  return credentials
}

function readSheet() {
  const content = getCredentials()
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content.toString()), getInfo)
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials: any, callback: any) {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

  if (LEADERBOARD_TOKEN) {
    oAuth2Client.setCredentials(JSON.parse(LEADERBOARD_TOKEN.toString()))
    callback(oAuth2Client)
  }
  // Check if we have previously stored a token.
  else
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback)
      oAuth2Client.setCredentials(JSON.parse(token.toString()))
      callback(oAuth2Client)
    })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client: any, callback: any) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close()
    oAuth2Client.getToken(code, (err: any, token: any) => {
      if (err) return console.error('Error while trying to retrieve access token', err)
      oAuth2Client.setCredentials(token)
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err)
        console.log('Token stored to', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

function getInfo(auth: any) {
  const sheets = google.sheets({ version: 'v4', auth })
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: LEADERBOARD_SHEET,
      range: 'Sheet1!A2:B',
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err)
      if (res == null) return
      const rows = res.data.values
      if (rows && rows.length) {
        console.log(rows)
        updateDB(rows)
      } else {
        console.log('No data found.')
      }
    }
  )
  let req = {
    spreadsheetId: LEADERBOARD_SHEET,
    range: 'Sheet1!D2',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      range: 'Sheet1!D2',
      majorDimension: 'ROWS',
      values: [['blaahs']],
    },
  }
  sheets.spreadsheets.values.update(req, (err: any, res: any) => {
    console.log(res, err)
  })
}

readSheet()
