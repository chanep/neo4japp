'use strict'
let config = {
    session_secret: process.env.SESSION_SECRET,
    apiBaseUrl: 'http://localhost:5005/api/',
    ldap: {
        url: "ldap://aang.ny.rga.com",
        bindDn: "CN=LDAP SkillsCloud,OU=Utility Accounts,DC=ny,DC=rga,DC=com",
        bindPassword: "v2egArkU",
        searchBase: "DC=ny,DC=rga,DC=com",
        searchFilter: "sAMAccountName={{username}}"
    },
    db: {
        server: process.env.DB_SERVER,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        logCommands: process.env.DB_LOG_COMMANDS  === 'true',
        partitionSuffix: process.env.DB_PARTITION_SUFFIX || ''
    },
    cw: {
        apiBase: process.env.CW_API_BASE,
        user: process.env.CW_USER,
        pass: process.env.CW_PASS
    },
    googlespreadsheet: {
        skills_spreadsheet_key: process.env.GOOGLE_SPREADSHEET_KEY
    },
    isProduction : (process.env.NODE_ENV == 'prod')
};

module.exports = config;