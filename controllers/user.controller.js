const usersStorage = require("../storages/userStorage");
const db = require('../db/queries');
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengtherr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstname").trim().isAlpha().withMessage(`First Name ${alphaErr}`).isLength({ min: 1, max: 10 }).withMessage(`First name ${lengtherr}`),
  body("lastname").trim().isAlpha().withMessage(`Last Name ${alphaErr}`).isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengtherr}`),
  body("email").trim().isEmail().withMessage("Email must be valid email address."),
  body("age").optional({ checkFalsy: true }).isInt({ min: 18, max: 120 }).withMessage("Age must be a number between 18 and 120."),
  body("bio").optional({ checkFalsy: true }).isLength({ max: 200 }).withMessage("Bio must be less than 200 characters.")
];

exports.usersListGet = async (req, res) => {
  try {
    const users = await db.getUser();
    res.render("index", {
      title: "User list",
      users,
      searchName: "",
      searchEmail: ""
    });
  } catch (err) {
    console.error("Error in usersListGet:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.usersCreateGet = (req, res) => {
  try {
    res.render("createUser", {
      title: "Create user",
      errors: []
    });
  } catch (err) {
    console.error("Error in usersCreateGet:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.usersCreatePost = [
  validateUser,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("createUser", {
          title: "Create User",
          errors: errors.array()
        });
      }

      const { firstname, lastname, email, age, bio } = req.body;
      await db.addUser({ firstname, lastname, email, age, bio });
      res.redirect("/");
    } catch (err) {
      console.error("Error in usersCreatePost:", err);
      res.status(500).send("Internal Server Error");
    }
  }
];

exports.usersUpdateGet = async (req, res) => {
  try {
    const user = await db.getUserById(Number(req.params.id));
    res.render("updateUser", {
      title: "Update User",
      user,
      errors: []
    });
  } catch (err) {
    console.error("Error in usersUpdateGet:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.usersUpdatePost = [
  validateUser,
  async (req, res) => {
    try {
      const user = await db.getUserById(Number(req.params.id));
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("updateUser", {
          title: "Update User",
          user,
          errors: errors.array()
        });
      }

      const { firstname, lastname, email, age, bio } = req.body;
      await db.updateUser(Number(req.params.id), { firstname, lastname, email, age, bio });
      res.redirect("/");
    } catch (err) {
      console.error("Error in usersUpdatePost:", err);
      res.status(500).send("Internal Server Error");
    }
  }
];

exports.usersDeletePost = async (req, res) => {
  try {
    await db.deleteUser(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error("Error in usersDeletePost:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.usersSearchGet = async (req, res) => {
  try {
    const results = await db.searchUserByName(req.query.searchName);
    res.render("index", {
      title: "Search result By Name",
      users: results,
      searchName: req.query.searchName,
      searchEmail: ""
    });
  } catch (err) {
    console.error("Error in usersSearchGet:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.usersSearchEmailGet = async (req, res) => {
  try {
    const results = await db.searchUserByEmail(req.query.searchEmail);
    res.render("index", {
      title: "Search result By Email",
      users: results,
      searchEmail: req.query.searchEmail,
      searchName: ""
    });
  } catch (err) {
    console.error("Error in usersSearchEmailGet:", err);
    res.status(500).send("Internal Server Error");
  }
};
