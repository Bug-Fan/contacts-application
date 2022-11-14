const express = require("express");
const app = express();
const user = require("./models/user");
const contact = require("./models/contact");
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.end("Welcome to the contacts application.");
});

app.post("/register", async (req, res) => {
  const data = req.body;
  if (data.name && data.email && data.phoneno && data.password) {
    const result = await user.registerNewUser(data);
    if (result.status) {
      res.status(200).send(result);
    } else {
      res.send(result);
    }
  } else {
    res.send({
      message: "Data is incomplete. Please enter complete details",
      status: false,
    });
  }
});

app.post("/login", async (req, res) => {
  const data = req.body;
  if (data.email && data.password) {
    const result = await user.loginUser(data);
    if (result.status) {
      res.status(200).send(result);
    } else {
      res.send(result);
    }
  } else {
    res.send({
      messsage: "Data is incomplete. Enter complete details",
      status: false,
    });
  }
});

app.put("/modifyuserdetails", user.validateToken, async (req, res) => {
  const data = req.body;
  data.email = res.locals.email;
  if (res.locals.isAuthenticated && data.name && data.phoneno && data.password) {
    const result = await user.modifyUserDetails(data);
    if (result.status) {
      res.status(200).send(result);
    } else {
      res.send(result);
    }
  } else {
    res.send({
      message: "Data is incomplete. Please enter complete details",
      status: false,
    });
  }
});

app.delete("/deleteuser", user.validateToken, async (req, res) => {
  const data = req.body;
  data.email = res.locals.email;
  if (res.locals.isAuthenticated && data.password) {
    const result = await user.deleteUser(data);
    if (result.status) {
      res.status(200).send(result);
    } else {
      res.send(result);
    }
  } else {
    res.send({
      message: "Data is incomplete. Please enter complete details",
      status: false,
    });
  }
});

app.post("/addnewcontact", user.validateToken, async (req, res) => {
  const data = req.body;
  data.userid = res.locals.userId;
  if (res.locals.isAuthenticated && data.contact_name && data.contact_email && data.contact_phoneno) {
    const result = await contact.addNewContact(data);
    if (result.status) {
      res.status(200).send(result);
    } else {
      res.send(result);
    }
  } else {
    res.send({
      message: "Data is incomplete. Please enter complete details",
      status: false,
    });
  }
});

app.put("/modifycontact", user.validateToken, async (req, res) => {
  const data = req.body;
  data.userid = res.locals.userId;
  if (res.locals.isAuthenticated && data.contact_name && data.contact_email && data.contact_phoneno) {
    const result = await contact.modifyContact(data);
    if (result.status) {
      res.status(200).send(result);
    } else {
      res.send(result);
    }
  } else {
    res.send({
      message: "Data is incomplete. Please enter complete details",
      status: false,
    });
  }
});

app.get("/searchcontact", user.validateToken, async (req, res) => {
  const data = req.body;
  data.userid = res.locals.userId;
  if (res.locals.isAuthenticated && data.contact_email) {
    const result = await contact.searchContact(data);
    if (result.status) {
      res.status(200).send(result);
    } else {
      res.send(result);
    }
  } else {
    res.send({
      message: "Data is incomplete. Please enter complete details",
      status: false,
    });
  }
});

app.delete("/deletecontact", user.validateToken, async (req, res) => {
  const data = req.body;
  data.userid = res.locals.userId;
  if (res.locals.isAuthenticated && data.contact_email) {
    const result = await contact.deleteContact(data);
    if (result.status) {
      res.status(200).send(result);
    } else {
      res.send(result);
    }
  } else {
    res.send({
      message: "Data is incomplete. Please enter complete details",
      status: false,
    });
  }
});

app.listen(port, () => {
  console.log(`Sever up and running on port ${port}`);
});