


class FileManager {
    static files = localStorage.getItem("files") ? JSON.parse(localStorage.getItem("files")) : {Main: "public class Main {\n    \n}"}

    static getFile(fileName) {
        this.lastFile = fileName
        return this.files[fileName]
    }

    static getFiles() {
        return this.files
    }

    static setFile(fileName, data) {
        this.files[fileName] = data
        this.saveFiles()
    }

    static addFile(fileName) {
        if (this.files[fileName]) return
        this.files[fileName] = `public class ${fileName} {\n    \n}`
        this.saveFiles()
    }

    static deleteFile(fileName) {
        delete this.files[fileName]
        this.saveFiles()
    }

    static saveFiles() {
        localStorage.setItem("files", JSON.stringify(this.files))
    }

}

export default FileManager