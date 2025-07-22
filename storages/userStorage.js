const storage = {}
let currentId = 0

function addUser({ firstName, lastName, email, age, bio }) {
    const id = currentId;
    storage[id] = { id, firstName, lastName, email, age, bio }
    currentId++;
}

function getUsers() {
    return Object.values(storage)
}

function getUser(id) {
    return storage[id]
}

function updateUser(id, { firstName, lastName, email, age, bio }) {
    if (storage[id]) {
        storage[id] = { id, firstName, lastName, email, age, bio }
    }
}

function deleteUser(id) {
    delete storage[id]
}

function searchUser(name) {
    const nameLower = name.toLowerCase()

    return Object.values(storage).filter(user =>
        user.firstName.includes(nameLower) || user.lastName.includes(nameLower)
    )
}

function searchUserByEmail(email) {
    return Object.values(storage).filter(user =>
        user.email.includes(email)
    )
}

module.exports = {
    addUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    searchUser,
    searchUserByEmail
}