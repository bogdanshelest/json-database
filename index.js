const { randomUUID } = require("crypto")
const fs = require("fs")

class Database {
  /**
   * Create a database.
   * @param {string} name - The name of the database
   */
  constructor(name) {
    if (typeof name !== typeof "") {
      throw new TypeError("Name of database is not string")
    }
    this.dbPath = `${name}.json`
  }

  #read() {
    return fs.readFileSync(this.dbPath, "utf8")
  }

  #write(data) {
    fs.writeFile(this.dbPath, JSON.stringify(data), (err) => {
      if (err) throw new Error(err)
    })
  }

  /**
   * @param {object} value
   * @returns {object} with id, that was added
   */
  add(value) {
    if (typeof value === typeof {}) {
      const DB = JSON.parse(this.#read())
      value.id = randomUUID()
      DB.push(value)
      this.#write(DB)
      return value
    } else {
      throw new TypeError("Value to add is not a type of object.")
    }
  }

  /**
   * Method, that removes document with specific id
   * @param {string} id
   * @returns {Array} changed database
   */
  removeById(id) {
    const DB = JSON.parse(this.#read())
    let newDB = []
    for (let i = 0; i < DB.length; i++) {
      if (DB[i].id !== id) {
        newDB.push(DB[i])
      }
    }
    this.#write(newDB)
    return this.#read()
  }

  /**
   * Method, that gets entire database
   * @returns {array}
   */
  get() {
    try {
      const data = this.#read()
      return data
    } catch {
      try {
        const data = fs.writeFileSync(this.dbPath, "[]")
        return data
      } catch {
        throw new Error(
          "Something went wrong. Please, if you are still getting error, open new issue on github."
        )
      }
    }
  }

  /**
   * Method, that searches for specified object
   * @param {string} id Search for an object with this id
   * @returns {object}
   */
  findById(id) {
    if (typeof id !== typeof "") {
      throw new TypeError("ID is not a type of string.")
    }
    const data = this.get()
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        return data[i]
      }
    }
    return {}
  }

  /**
   * Method, that clears database (danger)
   * @returns {array} cleared database
   */
  clear() {
    this.#write([])
    return this.#read()
  }
}

module.exports = Database
