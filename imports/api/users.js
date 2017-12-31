import { Meteor } from 'meteor/meteor';

// Server
Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId }, {
      fields: { private_key: 1 }
    });
  } else {
    this.ready();
  }
});

Meteor.users.allow({ update: () => true });

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