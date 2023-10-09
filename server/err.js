function system_error_description(err_code) {
    if (typeof err_code != "string"
        || err_code.length < 2
        || err_code[0] != "E") {
        return "Invalid system error code '" + err_code.toString() + "'";
    }
    switch (err_code) {
        case "EACCES":
            return "Permission denied";
        case "EADDRINUSE":
            return "Address already in use";
        case "ECONNREFUSED":
            return "Connection refused";
        case "ECONNRESET":
            return "Connection reset by peer";
        case "EEXIST":
            return "File exists";
        case "EISDIR":
            return "Is a directory";
        case "EMFILE":
            return "Too many open files in system";
        case "ENOENT":
            return "No such file or directory";
        case "ENOTDIR":
            return "Not a directory";
        case "EPERM":
            return "Operation not permitted";
        case "EPIPE":
            return "Broken pipe";
        case "ETIMEDOUT":
            return "Operation timed out";
        default:
            return "System error code '" + err_code + "' not recognized";
    }
}
module.exports = {
    system_error_description
}