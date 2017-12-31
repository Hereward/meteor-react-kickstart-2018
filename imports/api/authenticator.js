import { Meteor } from "meteor/meteor";
import { check } from 'meteor/check'

const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

let Future = Npm.require( 'fibers/future' ); 

  


Meteor.methods({
  "authenticator.verify": function verify(key, myToken) {
    check(key, String);
    check(myToken, String); // [Match.Any]

    let verified = speakeasy.time.verify({
      secret: key,
      encoding: "base32",
      token: myToken,
      window: 2
    });

    let currentValidToken = speakeasy.totp({
      secret: key,
      encoding: "base32"
    });

    console.log(
      `mySecret = [${key}] CVT = [${currentValidToken}] MYTOKEN = ${myToken} VERIFIED= [${verified}]`
    );

    return verified;
  },
  "authenticator.currentValidToken": function currentValidToken(key) {
    check(key, String);
    let token = speakeasy.totp({
      secret: key,
      encoding: "base32"
    });
    return token;
  },
  "authenticator.generateKey": function generateKey() {
    let future = new Future();

    let key = speakeasy.generateSecret({length: 20, name: "Personal Web Wallet"});


    QRCode.toDataURL(key.otpauth_url, (err, data_url) => {

      if ( err ) {
        future.return(err);
      } else {
        future.return({key: key, url: data_url});
      }
    });

    return future.wait();

  }
});








