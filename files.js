const fs = require("fs")
module.exports = {
    readFile(path) {
        console.log(path)
        return new Promise((resolve, reject) => {
            fs.readFile(path, "utf8", function (err, content) {
                if (err) return reject(err)
                resolve(content)
            })

        })
    },
    writeFile(path, content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, content, function (err) {
                if (err) return reject(err)
                resolve(true)

            })

        })
    }
}