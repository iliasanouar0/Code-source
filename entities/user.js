const base = require('./base').Base

class User extends base {
    _f_name
    _l_name
    _login
    _type
    _password

    get f_name() {
        return this._f_name
    }
    set f_name(value) {
        this._f_name = value
    }
    get l_name() {
        return this._l_name
    }
    set l_name(value) {
        this._l_name = value
    }
    get login() {
        return this._login
    }
    set login(value) {
        this._login = value
    }
    get type() {
        return this._type
    }
    set type(value) {
        this._type = value
    }
    get password() {
        return this._password
    }
    set password(value) {
        this._password = value
    }


}

module.exports = {
    User
}
