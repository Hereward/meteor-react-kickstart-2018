//import swal from 'sweetalert';
//declare var _swal: any;
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import * as User from "./user";

const temp: any = _swal;
const swal: SweetAlert = temp;
declare var window: any;

const authErrors = {
  invalidCode: "Invalid Code",
  exceededAttempts: "Account Locked",
  invalidSession: "Invalid Session"
};

export const nested = (pathArr, nestedObj) => {
  return pathArr.reduce((obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : null), nestedObj);
};

export function invalidAuthCodeAlert(error) {
  let message: string;
  let title: string;
  //let obj = arguments[0];
  message = error.reason || "Operation completed sucessfully.";
  title = authErrors[error.error] ? authErrors[error.error] : "Something Went Wrong...";

  swal({
    title: title,
    text: message,
    icon: "error"
  });
}

// showConfirmButton: true,

export function modalSuccessAlert(params: any) {
  let message: string;
  let title: string;
  let obj = arguments[0];
  message = obj.message || "Operation completed sucessfully.";
  title = obj.title || "Success!";

  swal({
    title: title,
    text: message,
    icon: "success"
  }).then(value => {
    if (obj.location) {
      log.info(`changing page location [${location}]`);
      //window.location = obj.location;
      window.location.assign(obj.location);
    }
  });
}

export function modalErrorAlert(params: any) {
  let argLength = arguments.length;
  let message: string;
  let title: string;
  let detail: string;
  let text = '';
  let location = '';
  let obj = arguments[0];
  if (typeof arguments[0] === "object") {
    
    message = obj.message;
    title = obj.title || "Oops, something went wrong!";
    detail = obj.detail;
  } else {
    message = arguments[1] || "The last action failed to complete properly.";
    title = arguments[2] || "Oops, something went wrong!";
    detail = arguments[0] || "Please try again.";
  }

  if (message) {
    text += message;
  }
  if (message && detail) {
    text += " ";
  }
  if (detail) {
    text += detail;
  }

  swal({
    title: title,
    text: `${text}`,
    icon: "error"
  }).then(value => {
    if (obj.location) {
      //log.info(`changing page location [${location}]`);
      //window.location = obj.location;
      window.location.assign(obj.location);
    }
  });
}

export function userModelessAlert(type, props) {
  /*
  if (!User.data()) {
    return;
  }
  */

  //let emailVerified = props.userData.emails[0].verified;

  let msg = "";
  let alertType = "";
  let title = "";
  let hideDelay = 7000;
  // let icon = "fa-magic";

  if (type === "verifyEmail") {
    if (props.profile.verificationEmailSent === 1) {
      title = "Check Your Email";
      msg =
        "A verification email has been sent to your nominated email account. Please check your email and click on the verification link.";
      alertType = "info";
    } else if (props.profile.verificationEmailSent === 2) {
      //allowFurtherAlerts = true;
      title = "Verification email could not be sent";
      msg =
        "We tried to send a verification email to your nominated email address, but there was a problem. Please check your profile for more details.";
      alertType = "danger";
    }
  }

  Bert.defaults.hideDelay = hideDelay;
  Bert.alert({
    hideDelay: hideDelay,
    type: alertType,
    title: title,
    message: msg
  });
}

export function setCookie(name, value, sec) {
  if (sec) {
    var date = new Date();
    date.setTime(date.getTime() + sec * 1000);
    var expires = "; expires=" + date.toUTCString();
  } else var expires = "";
  let cookie = name + "=" + value + expires + "; path=/";
  document.cookie = cookie;
  return cookie;
}

export function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2)
    return parts
      .pop()
      .split(";")
      .shift();
}
