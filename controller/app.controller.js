require("dotenv").config();
const PsModule = require("../utility/PS-module");

/**
 * pay with ussd
 * body receives - email, amount & type of ussd
 * type -> 737, 919(uba), 822(sterling), 966(zenith)
 */

exports.generateUssd = async (req, res) => {
  const { email, amount, type } = req.body;
  try {
    const generateUSSD = await PsModule.ussdGen(email, amount, type);
    res.status(201).send(generateUSSD);
  } catch (error) {
    console.log(error);
  }
};

// web hook! nb: hook can't be localhost and must be on the https protocol
exports.webservice = (req, res) => {
  const hash = PsModule.verifySignature(req.body);

  if (hash == req.headers["x-paystack-signature"]) {
    var event = req.body;

    if (event.event === "charge.success") {
      /* 
        proves that the charge was successful.
        run queries / logic here. 
       */
      console.log("do something here");
      res.sendStatus(200); // required for paystack to completes its cycle
    }
  } else {
    console.log("error occured!");
    res.status(500).send("suspicious transaction!");
  }
};
