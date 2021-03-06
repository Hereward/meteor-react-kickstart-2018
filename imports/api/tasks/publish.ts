//import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

declare var Mongo: any;
export const Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
  Meteor.publish("tasks", function tasksPublication() {
    if (!this.userId) return this.ready();
    return Tasks.find({
      $or: [{ private: { $ne: true } }, { owner: this.userId }]
    });
  });

  Meteor.startup(function tasksStart() {
    Tasks.remove({});
    //console.log(`startup (tasks) - clearing content`);
  });
}
