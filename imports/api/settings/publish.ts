//import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

declare var Mongo: any;

export const userSettings = new Mongo.Collection("userSettings");

if (Meteor.isServer) {
  Meteor.publish("userSettings", function userSettingsPublication() {
    if (!this.userId) return this.ready();
    
    return userSettings.find(
      { owner: this.userId },
      {
        fields: {
          authEnabled: 1,
          locked: 1,
          owner: 1
        }
      }
    );
  });

  userSettings.deny({
    insert() {
      return true;
    },
    update() {
      return true;
    },
    remove() {
      return true;
    }
  });
}
