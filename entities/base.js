class Base {

    /**
     * The base class properties :
     */

    id
    status
    date_add
    date_update

    /**
     * 
     * Getters ans Setters
     * 
     */

    setId(id) {
        this.id = id
    }
    getId() {
        return this.id
    }

    setStatus(status) {
        this.status = status
    }
    getStatus() {
        return this.status
    }

    setDate_add(date_add) {
        this.date_add = date_add
    }
    getDate_add() {
        return this.date_add
    }

    setDate_update(date_update) {
        this.date_update = date_update
    }
    getdate_update() {
        return this.date_update
    }

}

module.exports = {
    Base
}