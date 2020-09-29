require("dotenv").config();
const sid = require("shortid");
const crypto = require("crypto");
const paystack = require("paystack-api")(process.env.paystack_skey);

/**
 * in-app paystack module to handle ussd gen and verification
 */

class PsModule {
  static async ussdGen(email, amount, type) {
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
    return finalResponse;
  }

  static verifySignature(reqBody) {
    try {
      var hash = crypto
        .createHmac("sha512", process.env.paystack_skey)
        .update(JSON.stringify(reqBody))
        .digest("hex");
      return hash;
    } catch (error) {
      console.log("error ", error);
    }
  }
}

module.exports = PsModule;
