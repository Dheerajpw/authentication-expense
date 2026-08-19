const fs = require("fs");
const path = require("path");

const logsFolder = path.join(__dirname, "logs");
const logFile = path.join(logsFolder, "app.log");


// Create logs folder if it does not exist

if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder, {
        recursive: true
    });
}


// Write log function

function writeLog(message) {

    const timestamp =
        new Date().toISOString();

    const logMessage =
        `[${timestamp}] ${message}\n`;

    fs.appendFileSync(
        logFile,
        logMessage,
        "utf8"
    );
}


module.exports = {
    writeLog
};