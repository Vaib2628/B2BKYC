const http = require("http");

module.exports = class ApiResponse {
    constructor(data, status, paginate, message = "Success !") {
        this.data = data;
        this.message = message;
        this.status = status;
        this.statusText = http.STATUS_CODES[status];
        if (paginate) this.paginate = paginate;
    }
};
