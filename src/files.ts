import fs from "fs"

export default {
    readFile(path: string): Promise<string> {
        console.log(path)
        return new Promise((resolve, reject) => {
            fs.readFile(path, "utf8", function (err: any, content: string) {
                if (err) return reject(err)
                resolve(content)
            })

        })
    },
    writeFile(path: string, content: string) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, content, function (err: any) {
                if (err) return reject(err)
                resolve(true)

            })

        })
    }
}