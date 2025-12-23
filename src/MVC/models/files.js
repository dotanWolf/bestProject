var entries = []

const createNewEntry = (id, name, content, location, userid, type) => {
    const newEntry = {id, name, content, location, userid, type}
    entries.push(newEntry)
    return newEntry
}

const getDirectoryContent = (directory) => {
    return entries.filter((entry) => entry.location == directory)
}


const getEntry = (id) => {
    return entries.filter((entry) => entry.id == id)[0]
}

const updateEntry = (id, name, content, location, userid, type) => {
    const entry = getEntry(id)
    if (!entry) {
        return null
    }
    return {id, name, content, location, userid, type}
}

const deleteEntry = (id) => {
    const index = entries.findIndex((entry) => entry.id == id)
    if (!index) {
        // an entry doesnt exist with this id
        return null
    }
    const entry = entries[index]
    entries.splice(index, 1)
    return entry
}

const getPermissions = (id) => {
    const entry = getEntry(id)
    if (!entry)
        return null
    return entry.permissions
}

const createPermissions = (id, permissions) => {
    const entry = getEntry(id)
    if (!entry)
        return null
    entry.permissions = permissions
    return permissions
}

module.exports = {
    createNewEntry,
    getDirectoryContent,
    getEntry,
    updateEntry,
    deleteEntry,
    getPermissions,
    createPermissions
}