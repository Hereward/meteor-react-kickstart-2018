import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { check } from "meteor/check";

let Future = Npm.require('fibers/future'); 

Accounts.onCreateUser((options, user) => {
  if (typeof options.private_key !== "undefined") {
    user.private_key = options.private_key;
  }

  if (typeof options.auth_verified !== "undefined") {
    user.auth_verified = options.auth_verified;
  }

  if (typeof options.verificationEmailSent !== "undefined") {
    user.verificationEmailSent = options.verificationEmailSent;
  }

  if (options.profile) {
    user.profile = options.profile;
  }

  return user;
});

Meteor.publish("userData", function userData() {
  if (!this.userId) {
    return null;
  }
  const options = {
    fields: { private_key: 1, auth_verified: 1, verificationEmailSent: 1 }
  };

  return Meteor.users.find(this.userId, options);
});

Meteor.users.allow({ update: () => true });

Meteor.methods({
  "user.sendVerificationEmail": function sve() {
    let emailRes = false;
    console.log(`user.sendVerificationEmail:BEGIN`);

    emailRes = Accounts.sendVerificationEmail(this.userId);
    console.log(`emailRes = [${emailRes}]`);
    let verificationEmailSent = 2;
    let output = false;

    if (emailRes) {
      verificationEmailSent = 1;
      output = true;
    }

    Meteor.users.update(this.userId, {
      $set: {
        verificationEmailSent: verificationEmailSent
      }
    });

    return output;
  }
});

/*
Meteor.users.allow({
  update: function (userId, user) {
    return true;

    
     * Don't use `return true` in production!
     * You probably need something like this:
     * return Meteor.users.findOne(userId).profile.isAdmin;
     *
  }
});

*/
