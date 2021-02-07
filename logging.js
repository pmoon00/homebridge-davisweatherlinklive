class Logging {
    static LOG_LEVEL = {
        "Debug": 0,
        "Info": 1,
        "Warning": 2,
        "Error": 3,
        "InitOnly": 4
    }
    constructor(hbLog, logLevel) {
        this.hbLog = hbLog;
        this.logLevel = logLevel;
    }
    log(msg) {

    }
}