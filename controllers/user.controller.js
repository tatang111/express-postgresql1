const usersStorage = require("../storages/userStorage")
const db = require('../db/queries')

const { body, validationResult } = require("express-validator")

const alphaErr = "must only contain letters."
const lengtherr = "must be between 1 and 10 characters."

const validateUser = [
    body("firstname").trim().isAlpha().withMessage(`First Name ${alphaErr}`).isLength({
        min: 1, max: 10
    }).withMessage(`First name ${lengtherr}`),
    body("lastname").trim().isAlpha().withMessage(`Last Name ${alphaErr}`).isLength({
        min: 1, max: 10
    }).withMessage(`Last name ${lengtherr}`),
    body("email").trim().isEmail().withMessage("Email must be valid email address."),
    body("age").optional({ checkFalsy: true }).isInt({ min: 18, max: 120 }).withMessage("Age must be a number between 18 and 120."),
    body("bio").optional({ checkFalsy: true }).isLength({ max: 200 }).withMessage("Bio must be less than 200 characters.")
]

exports.usersListGet = async (req, res) => {
    res.render("index", {
        title: "User list",
        users: await db.getUser(),
        searchName: "",
        searchEmail: ""
    })
}

exports.usersCreateGet = (req, res) => {
    res.render("createUser", {
        title: "Create user",
        errors: []
    })
}

exports.usersCreatePost = [
    validateUser,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).render("createUser", {
                title: "Create User",
                errors: errors.array()
            })
        }

        const { firstname, lastname, email, age, bio } = req.body
        await db.addUser({ firstname, lastname, email, age, bio })
        res.redirect("/")
    }
]

exports.usersUpdateGet = async (req, res) => {
    const user = await db.getUserById(Number(req.params.id))
    console.log(user)
    res.render("updateUser", {
        title: "Update User",
        user: user,
        errors: []
    })
}

exports.usersUpdatePost = [
    validateUser,
     async (req, res) => {
        const user = await db.getUserById(Number(req.params.id))
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).render("updateUser", {
                title: "Update User",
                user,
                errors: errors.array()
            })
        }
        const { firstname, lastname, email, age, bio } = req.body
        await db.updateUser(Number(req.params.id), { firstname, lastname, email, age, bio })
        res.redirect("/")
    }
]

exports.usersDeletePost = async (req, res) => {
    await db.deleteUser(req.params.id)
    res.redirect("/")
}

exports.usersSearchGet = async (req, res) => {
    const results = await db.searchUserByName(req.query.searchName)
    res.render("index", {
        title: "Search result By Name",
        users: results,
        searchName: req.query.searchName,
        searchEmail: ""
    })
}

exports.usersSearchEmailGet = async (req, res) => {
    const results = await db.searchUserByEmail(req.query.searchEmail)
    res.render("index", {
        title: "Search result By Email",
        users: results,
        searchEmail: req.query.searchEmail,
        searchName: ""
    })
}