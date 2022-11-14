require("dotenv").config();
const pool = require("./databaseconfig");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

const registerNewUser = async (data) => {
  const { name, email, phoneno, password } = data;
  const query = "INSERT INTO users (user_name, user_email, user_phoneno, password) VALUES ($1, $2, $3, $4)";
  try {
    const result = await pool.query(query, [name, email, phoneno, md5(password),]);
    if (result.rowCount > 0) {
      return {
        message: "You have been registered successfully",
        status: true,
      };
    }
  } catch (e) {
    return {
      message: "Cannot register user. Please try again",
      status: "false",
    };
  }
};

const loginUser = async (data) => {
  const { email, password } = data;
  const query = "SELECT user_email, password, user_id FROM users WHERE user_email = $1";
  try {
    const result = await pool.query(query, [email]);
    if (result.rowCount > 0) {
      if (result.rows[0].user_email === email && result.rows[0].password === md5(password)) {
        const userid = result.rows[0].user_id;
        const token = await jwt.sign({ email, userid }, process.env.secret_key, { expiresIn: "15m" }
        );
        return {
          message: "You have logged in successfully",
          token,
          status: true,
        };
      } else if (result.rows[0].password !== md5(password)) {
        return {
          message: "Incorrect password entered. Try again",
          status: false,
        };
      }
    } else {
      return {
        message:
          "Incorrect Email ID. Check your email ID and try again. If that doesn't work, register yourself",
        status: false,
      };
    }
  } catch (e) {
    return {
      message: "User with the same email is already registered",
      status: "false",
    };
  }
};

const modifyUserDetails = async (data) => {
  const { name, phoneno, password, email } = data;
  const query = "UPDATE users SET user_name=$1, user_phoneno=$2, password=$3 WHERE user_email=$4";
  try {
    const result = await pool.query(query, [name, phoneno, md5(password), email,]);
    if (result.rowCount > 0) {
      return {
        message: "Your data has been modified successfully",
        status: true,
      };
    }
  } catch (e) {
    return {
      message: "Unable to modify your data. Please try again later",
      status: false,
    };
  }
};

const deleteUser = async (data) => {
  const {email, password} = data;
  const query = "DELETE FROM users WHERE user_email = $1 AND password = $2";
  try {
    const result = await pool.query(query, [email, md5(password)])
    if (result.rowCount > 0) {
      return {
        message: "User deleted successfully",
        status: true,
      }
    } else {
      return {
        message: "User not found",
        status: false,
      }
    }
  } catch (error) {
    return {
      message: "Unable to delete user. Please try again",
      status: false,
    }
  }
}

const validateToken = async (req, res, next) => {
  try {
    const token = req.header("token");
    const verified = await jwt.verify(token, process.env.secret_key);
    if (verified) {
      res.locals.isAuthenticated = true;
      res.locals.email = verified.email;
      res.locals.userId = verified.userid;
      console.log("Token verified");
      next();
    }
  } catch (error) {
    res.status(440).send({
      message: "Oops your session has expired. Please login again",
    });
    res.end();
  }
};

module.exports = {
  registerNewUser,
  loginUser,
  modifyUserDetails,
  validateToken,
  deleteUser,
};