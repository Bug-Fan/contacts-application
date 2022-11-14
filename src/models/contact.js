require("dotenv").config();
const pool = require("./databaseconfig");

const addNewContact = async (data) => {
  const { contact_name, contact_email, contact_phoneno, userid } = data;
  const query = "INSERT INTO contacts (contact_name, contact_email, contact_phoneno, user_id) VALUES ($1, $2, $3, $4)";
  try {
    const result = await pool.query(query, [contact_name, contact_email, contact_phoneno, userid,]);
    if (result.rowCount > 0) {
      return {
        message: "Contact added successfully",
        status: true,
      };
    }
  } catch (error) {
    return {
      message: "Cannot add contact. Please try again",
      status: false,
    };
  }
};

const modifyContact = async (data) => {
  const { contact_name, contact_email, contact_phoneno, userid } = data;
  const query = "UPDATE contacts SET contact_name=$1, contact_email=$2, contact_phoneno=$3 WHERE user_id=$4";
  try {
    const result = await pool.query(query, [contact_name, contact_email, contact_phoneno, userid,]);
    if (result.rowCount > 0) {
      return {
        message: "Contact modified successfully",
        status: true,
      };
    }
  } catch (error) {
    return {
      message: "Cannot modify contact. Please try again",
      status: false,
    };
  }
};

const searchContact = async (data) => {
  const { contact_email, userid } = data;
  const query = "SELECT * FROM contacts WHERE contact_email = $1 AND user_id = $2";
  try {
    const result = await pool.query(query, [contact_email, userid]);
    if (result.rowCount > 0) {
      return {
        message: "Contact found successfully",
        status: true,
        details: result.rows[0],
      };
    }
  } catch (error) {
    return {
      message: "Contact not found. Please try again",
      status: false,
    };
  }
};

const deleteContact = async (data) => {
  const { contact_email, userid } = data;
  const query = "DELETE FROM contacts WHERE contact_email = $1 AND user_id = $2";
  try {
    const result = await pool.query(query, [contact_email, userid]);
    if (result.rowCount > 0) {
      return {
        message: "Contact deleted successfully",
        status: true,
      };
    }
  } catch (error) {
    return {
      message: "Contact not found. Please try again",
      status: false,
    };
  }
};

module.exports = {
  addNewContact,
  modifyContact,
  searchContact,
  deleteContact,
};