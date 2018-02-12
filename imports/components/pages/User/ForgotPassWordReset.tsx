// import jquery from "jquery";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import * as PropTypes from "prop-types";
import ReactRouterPropTypes from "react-router-prop-types";

import { withTracker } from "meteor/react-meteor-data";
import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import Transition from "../../partials/Transition";
import ForgotPassWordResetForm from "../../forms/ForgotPassWordResetForm";
import * as Library from "../../../modules/library";

/*
  history: ReactRouterPropTypes.history,
  enhancedAuth: PropTypes.bool,
  AuthVerified: PropTypes.bool
*/

interface IProps {
  history: any;
  enhancedAuth: boolean;
  authVerified: boolean;
}

interface IState {
  password1: string;
  password2: string;
  email: string;
}

class ForgotPassWordReset extends React.Component<IProps, IState> {
  token: string;

  constructor(props) {
    super(props);

    //let url = jquery(location).attr("href");
    let url = window.location.href;
    this.token = url.substr(url.lastIndexOf("/") + 1);

    console.log(`TOKEN= [${this.token}]`);

    this.state = {
      password1: "",
      password2: "",
      email: ""
    };

    this.resetPassword = this.resetPassword.bind(this);
    this.handleChange = this.handleChange.bind(this);

    console.log(
      `ForgotPassWordReset: enhancedAuth = [${this.props.enhancedAuth}]`
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authVerified) {
      this.props.history.push("/");
    }
  }

  handleChange(e) {
    let target = e.target;
    let value = target.value;
    let id = target.id;

    this.setState({ [id]: value });
  }

  getLayout() {
    let form = (
      <ForgotPassWordResetForm
        handleChange={this.handleChange}
        handleSubmit={this.resetPassword}
      />
    );

    return form;
  }

  resetPassword() {
    console.log(`FORM SUBMIT >> EMAIL =  ${this.state.email}`);

    let password1 = this.state.password1.trim();
    let password2 = this.state.password2.trim();

    let isValidPassword = function isValidPassword(password1, password2) {
      if (password1 === password2) {
        return password1.length >= 6 ? true : false;
      } else {
        return Library.modalErrorAlert(
          {message: "Please try again.", title: "Passwords don't match."}
        );
      }
    };

    if (isValidPassword(password1, password2)) {
      Accounts.resetPassword(
        this.token,
        password1,
        function reset(err) {
          if (!err) {
            Meteor.call(
              "authenticator.updateAuthVerified",
              true,
              (error, response) => {
                if (error) {
                  console.warn(error);
                }
              }
            );

            Library.modalSuccessAlert(
              {message: 'Your password was reset.'}
            );

            if (this.props.enhancedAuth) {
              console.log("password reset: redirect to /authenticate");
              this.props.history.push("/authenticate");
            } else {
              this.props.history.push("/");
              console.log("password reset: redirect to /");
            }
          } else {
            Library.modalErrorAlert(
              {reason: err, title: "Password reset failed."}
            );
           
            console.log(err);
          }
        }.bind(this)
      );
    } else {
      return Library.modalErrorAlert(
        {message: 'Please try again.', title: "Password must be at least 6 characters."}
      );
    }
  }

  render() {
    return (
      <Transition>
        <div>{this.getLayout()}</div>
      </Transition>
    );
  }
}

export default withRouter(
  withTracker(({ params }) => {
    Meteor.subscribe("userData");
    return {};
  })(ForgotPassWordReset)
);

