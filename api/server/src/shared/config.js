'use strict'
let config = {
    db: {
        server: process.env.DB_SERVER,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        logCommands: process.env.DB_LOG_COMMANDS  === 'true'
    },
    cw: {
        apiBase: process.env.CW_API_BASE,
        user: process.env.CW_USER,
        pass: process.env.CW_PASS
    },
    googlespreadsheet: {
        skills_spreadsheet_key: process.env.SKILLS_SPREADSHEET_KEY,
        skills_client_email: process.env.SKILLS_CLIENT_EMAIL,
        skills_private_key: process.env.SKILLS_PRIVATE_KEY
    }
};

module.exports = config;