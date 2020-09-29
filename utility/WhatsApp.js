require("dotenv").config();
const twilio = require("twilio");

const accountSid = "process.env.accountSid";
const authToken = "process.env.authToken";
const client = new twilio(accountSid, authToken);

// whatsapp demo api ---

app.get("/sendwhatsapp", (req, res, next) => {
  try {
    client.messages
      .create({
        body: `Your pin code is 1234`,
        to: "whatsapp:+2348051985616", // Text this number
        from: "whatsapp:+2348167836364", // From a valid Twilio number
      })
      .then((message) => console.log(message.sid));
    res.sendStatus("ok!");
  } catch (error) {
    console.log("error : ", error.name);
  }
});

// !pending task here!
