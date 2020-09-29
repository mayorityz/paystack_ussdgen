require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const sid = require("shortid");

const app = express();
const PORT = process.env.PORT || 3500;

const paystack = require("paystack-api")(process.env.paystack_skey);

const crypto = require("crypto");

app.use(bodyParser.json());

/**
 * ! todo
 *  add protective layer for urls access
 */

/**
 * pay with ussd
 * body receives - email, amount & type of ussd
 * type -> 737, 919(uba), 822(sterling), 966(zenith)
 */
app.post("/paywithussd", async (req, res, next) => {
  const { email, amount, type } = req.body;
  console.log(req.body);
  let finalResponse;
  try {
    const charge = await paystack.charge.charge({
      email,
      amount,
      ussd: { type },
      reference: sid.generate(),
    });
    console.log(charge);
    if (charge.status) {
      const { message, data } = charge;
      const { status, reference, display_text, ussd_code } = data;
      finalResponse = ussd_code;
    } else {
      console.log(charge.message); // return better error message ...
      finalResponse = charge.message;
    }
  } catch (error) {
    console.log(error.message);
  }
  res.send(finalResponse);
});

// web hook! nb: hook can't be localhost and must be on the https protocol

app.post("/webservicehook", (req, res) => {
  var hash = crypto
    .createHmac("sha512", process.env.paystack_skey)
    .update(JSON.stringify(req.body))
    .digest("hex");
  if (hash == req.headers["x-paystack-signature"]) {
    var event = req.body;
    if (event.event === "charge.success") {
      console.log(event);
      console.log("do something here");
      res.send(200);
    }
  } else {
    console.log("error occured!");
    res.status(500).send("suspicious transaction!");
  }
});

app.get("/", (req, res) => {
  res.send("Paystack Test App!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
