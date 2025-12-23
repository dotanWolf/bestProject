var filesAndDirs = []

 var num = filesAndDirs.length

const createNewFile = (name, content, location, userid, type) => {
    if (type == "file" ) {
        const newFile = {id : ++num, name, content, location, type, userid}
        files.push(newFile)
        return newFile
    } else if (type == "directory") {
        const newDir = {id : ++num, name, location, type, userid}
        files.push(newDir)
        return newDir
    }

}

const getDirectoryContent = (directory) => {
    const filesAtDirectory = files.filter((file) => file.location == directory)
    const subDirectories = directories.filter((dir) => dir.location == directory)
    return filesAtDirectory.concat(subDirectories)
}


const getFileOrDirectory = (id) => {
    return filesAndDirs.filter((file) => file.id == id)[0]
}

const updateFileContent = (id, name, content, location, userid, type) => {
    const file = getFileOrDirectory(id)
    if (!file) {
        return null
    }
    if (file.type == "file") {
        const newFile = {id, name, content, location, type, userid}
    } else if (file.type == "directory") {
        const newFile = {id, name, location, type, userid}
    }
}

const deleteFile = (id) => {
    const index = filesAndDirs.findIndex((file) => file.id == id)
    if (!index) {
        return false
    }
    filesAndDirs.splice(index, 1)
    return true
}

module.exports = {
    createNewFile,
    getDirectoryContent,
    getFileOrDirectory,
    updateFileContent,
    deleteFile
}