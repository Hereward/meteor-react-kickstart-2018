import * as jquery from "jquery";
import { Meteor } from "meteor/meteor";
import * as User from "./user";

declare var store: any;

export default function timeOut(tProps: { logoutFunc?: any; on: boolean }) {
  if (!tProps.on) {
    //clear();
  }

  var defaults = {
    //how long to wait (in seconds) before showing inactivity notification
    inactivityWait: Meteor.settings.public.session.inactivityWait, //default 10 minutes

    //how long to show inactivity dialog (in seconds) before automatically logging out.
    dialogWait: Meteor.settings.public.session.dialogWait, //default 1 minute

    //when to reset timer
    bindEvents:
      "mousemove keydown wheel DOMMouseScroll mousewheel mousedown touchstart touchmove MSPointerDown MSPointerMove",

    logoutUrl: "/logout",

    dialogMessage:
      "For security purposes, you will be automatically logged out in %s seconds " +
      'due to inactivity.&nbsp;&nbsp;<a href="#" style="color: #FFF;"><strong>Click here to stay logged in.</strong></a>',

    // id of the wrapper for the notification dialog
    dialogId: "inactivity-notifier",

    // the element in the dialog message to reset the timer.
    resetSelector: "#inactivity-notifier a",

    // the cookie name/localStorage name to use.
    cookieName: "it_timestamp",

    //dialog/notification styling
    dialogBorderColor: "#FF0000",
    dialogBackgroundColor: "#FF6666",
    dialogFontColor: "#FFF",
    dialogFontSize: "14px"
  };

  var opts = jquery.extend(defaults, "");

  var activityCheck, dialogActivityCheck, countdown, useStore, x, y;

  /**
   * Stores a cookie (or use store.js if enabled)
   */
  var setCookie = function(name, value, path?) {
    if (useStore) {
      store.set(name, value);
      return;
    }

    if (!path) {
      path = "/";
    }

    document.cookie = name + "=" + value + "; path=" + path;
  };

  /**
   * Retrieves a cookie (or store.js if enabled)
   */
  var getCookie = function(name, path?) {
    if (useStore) {
      return store.get(name);
    }

    if (!path) {
      path = "/";
    }

    var nameEQ = name + "=";
    var ca = document.cookie.split(";");

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }

    return "";
  };

  /**
   * Sets the current time as a cookie.
   */
  var setTimestampCookie = function(evt?) {
    // mousemove can act weird sometimes (always trigger even if mouse is still)
    // this tracks the location of the mouse
    if (evt != undefined && evt.type == "mousemove") {
      if (evt.clientX == x && evt.clientY == y) {
        return;
      }

      x = evt.clientX;
      y = evt.clientY;
    }

    setCookie(opts.cookieName, new Date().getTime());
  };

  var checkInactivity = function() {
    var timestamp = parseInt(getCookie(opts.cookieName));

    var now = new Date().getTime();

    var dialogCheck = timestamp + opts.inactivityWait * 1000;

    if (now >= dialogCheck) {
      clear();
      if (User.id()) {
        
        toggleDialog();
      } else {
        console.log(`Bypassing timeout alert because logged out.`);
      }
    }
  };

  /**
   * Once the notification dialog has been presented,
   * determine whether we should redirect to the logout page.
   */
  var checkDialog = function() {
    var timestamp = parseInt(getCookie(opts.cookieName));

    var now = new Date().getTime();

    var dialogCheck = timestamp + opts.inactivityWait * 1000;
    var logoutCheck = dialogCheck + opts.dialogWait * 1000;

    // timestamp has been updated in another browser window/tab
    if (now < dialogCheck) {
      reset();
    }

    // Time has exceeded.  Time to log out.
    if (now >= logoutCheck) {
        
        if (User.id()) {
            clear();
            console.log(`logging out due to inactivity`);
            tProps.logoutFunc();
        }
     
      //window.location.href = opts.logoutUrl;
    }
  };

  var toggleDialog = function() {
    var text = opts.dialogMessage;
    let counter: any;

    counter = opts.dialogWait;

    jquery("<div></div>")
      .css({
        "border-bottom": "2px solid " + opts.dialogBorderColor,
        "background-color": opts.dialogBackgroundColor,
        color: opts.dialogFontColor,
        padding: "10px",
        "font-size": opts.dialogFontSize
      })
      .html(text.replace("%s", counter))
      .appendTo(
        jquery('<div id="' + opts.dialogId + '"></div>')
          .css({
            position: "fixed",
            width: "100%",
            "text-align": "center",
            "z-index": 999999,
            top: 0,
            left: 0
          })
          .appendTo("body")
      );

    //display countdown timer

    countdown = window.setInterval(function() {
      let currVal: any = Math.max(--counter, 0);
      jquery("#" + opts.dialogId)
        .find("div")
        .html(text.replace("%s", currVal));
    }, 1000);

    dialogActivityCheck = window.setInterval(checkDialog, 500);
    //console.log(`timeout setInterval dialogActivityCheck`, dialogActivityCheck);
  };

  /**
   * Clear timers and restart the inactivity process.
   */
  var reset = function() {
    clear();
    init();
  };

  /**
   * Clear everything related to the inactivity timer.
   */
  var clear = function() {
    console.log(`clearing inactivity timeouts`, dialogActivityCheck, activityCheck, countdown);
    window.clearInterval(dialogActivityCheck);
    window.clearInterval(activityCheck);
    window.clearInterval(countdown);

    jquery("#" + opts.dialogId).remove();

    unbindEvents();
  };

  /**
   * Begin inactivity observer.
   */
  var init = function() {
    console.log(`Begin inactivity observer`);
    setTimestampCookie();
    bindEvents();

    activityCheck = window.setInterval(checkInactivity, 1000);
  };

  /**
   * Bind the observer events to the document
   */
  var bindEvents = function() {
    jquery(document).bind(jquery.trim((opts.bindEvents + " ").split(" ").join("._inactivityTimeout ")), function(e) {
      setTimestampCookie(e);
    });
  };

  var unbindEvents = function() {
    jquery(document).unbind("._inactivityTimeout");
  };

  jquery("body").on("click", opts.resetSelector, function() {
    reset();
    return false;
  });

  // determine whether or not to use store.js for localStorage.
  // Uses document.cookie otherwise.
  if (typeof store == "undefined" || !store.enabled) {
    useStore = false;
  } else {
    useStore = true;
  }

  init();
}
