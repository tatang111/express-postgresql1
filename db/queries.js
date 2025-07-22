const pool = require('./pool')

const addUser = async ({ firstname, lastname, bio, email, age }) => {
    await pool.query(`INSERT INTO users (firstname, lastname, bio, email, age) VALUES ($1, $2, $3, $4, $5)`, [firstname, lastname, bio, email, age])
}

const getUser = async () => {
    const results = await pool.query(`SELECT * FROM users`)
    return results.rows
}

const getUserById = async (id) => {
    const results = await pool.query(`SELECT * FROM users WHERE id = $1`, [id])
    return results.rows[0]
}

const updateUser = async (id, { firstname, lastname, email, age, bio }) => {
    await pool.query(`UPDATE users SET firstname = $1, lastname = $2, email = $3, age = $4, bio = $5 WHERE id = $6`, [firstname, lastname, email, age, bio, id])
}

const deleteUser = async (id) => {
    await pool.query(`DELETE FROM users WHERE id = $1`, [id])
}

const searchUserByName = async (name) => {
    const results = await pool.query(`SELECT * FROM users WHERE firstname ILIKE $1 OR lastname ILIKE $2`, [`%${name}%`, `%${name}%`])
    return results.rows
}

const searchUserByEmail = async (email) => {
    const results = await pool.query(`SELECT * FROM users WHERE email ILIKE $1`, [`%${email}%`])
    return results.rows
}

module.exports = {
    addUser,
    getUser,
    getUserById,
    updateUser,
    deleteUser,
    searchUserByName,
    searchUserByEmail
}