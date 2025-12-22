files = []
var numFiles = files.length

const createNewFile = (name, content) => {
    const newFile = {id : ++numFiles, name, content}
    files.push(newFile)
    return newFile
}

module.exports = {
    createNewFile
}