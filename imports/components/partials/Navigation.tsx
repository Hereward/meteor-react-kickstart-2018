import * as React from "react";
import { Meteor } from "meteor/meteor";
import * as PropTypes from "prop-types";
import ReactRouterPropTypes from "react-router-prop-types";
import { Link, withRouter } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import styled from "styled-components";
import * as jquery from "jquery";
import ActionVerifiedUser from "material-ui/svg-icons/action/verified-user";
import ActionHighlightOff from "material-ui/svg-icons/action/highlight-off";
import timeOut from "../../modules/timeout";
import * as ContentManagement from "../../modules/contentManagement";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Tooltip,
  UncontrolledTooltip
} from "reactstrap";

import * as AuthMethods from "../../api/auth/methods";
import { Auth } from "../../api/auth/publish";
import * as Library from "../../modules/library";

interface IProps {
  history: any;
  signedIn: any;
  ShortTitle: any;
  emailDashDisplay: any;
  authVerified: boolean;
  EmailVerified: boolean;
  enhancedAuth: boolean;
  loading: boolean;
  profile: any;
  authData: {
    _id: string;
    verified: boolean;
    currentAttempts: number;
    private_key: string;
    owner: string;
    keyObj: any;
    QRCodeShown: boolean;
  };
}

interface IState {
  collapsed: boolean;
}

const VerifiedIndicator = function vfi(verified) {
  let tag: any;
  let style: any;

  if (verified) {
    //style = { verticalAlign: "text-top", color: "lime", marginTop: "0px" };
    tag = <ActionVerifiedUser className="action-verified-user" />;
  } else {
    //style = { verticalAlign: "text-top", color: "red", marginTop: "0px" };
    tag = <ActionHighlightOff className="action-highlight-off" />;
  }
  return <div id="VerifiedIndicator">{tag}</div>;
};

declare var Bert: any;

class Navigation extends React.Component<IProps, IState> {
  emailNotifySent: boolean;
  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.closeNavbar = this.closeNavbar.bind(this);
    this.logOut = this.logOut.bind(this);
    this.state = {
      collapsed: true
    };
    this.emailNotifySent = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.signedIn && nextProps.signedIn !== this.props.signedIn) {
      console.log(`Launching timeout script`);
      timeOut({ logoutFunc: this.logOut, on: true });
      //Library.userModelessAlert("verifyEmail", nextProps);
    }
    
  }

  componentWillUpdate(nextProps) {}

  componentDidUpdate() {
    let notify = this.verifyEmailNotificationRequired();
    if (notify) {
      this.emailNotifySent = Library.userModelessAlert("verifyEmail", this.props);
    }
  }

  componentDidMount() {
    console.log(`Navigation DID MOUNT`);
    
  }

  verifyEmailNotificationRequired() {
    console.log(
      `verifyEmailNotificationRequired`,
      this.emailNotifySent,
      this.props.signedIn,
      this.props.profile,
      this.props.enhancedAuth
    );
    return (
      !this.emailNotifySent &&
      this.props.signedIn &&
      this.props.profile &&
      (!this.props.enhancedAuth || this.props.authData)
    );
  }

  closeNavbar() {
    //e.preventDefault();
    console.log(`closeNavbar`, this.state.collapsed);
    if (!this.state.collapsed) {
      this.setState({ collapsed: true });
    }
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  static propTypes = {
    authVerified: PropTypes.bool,
    EmailVerified: PropTypes.bool,
    signedIn: PropTypes.bool,
    enhancedAuth: PropTypes.bool,
    emailDashDisplay: PropTypes.string,
    ShortTitle: PropTypes.string,
    history: ReactRouterPropTypes.history,
    loading: PropTypes.bool,
    profile: PropTypes.any,
    authData: PropTypes.shape({
      _id: PropTypes.string,
      verified: PropTypes.bool,
      currentAttempts: PropTypes.number,
      private_key: PropTypes.string,
      owner: PropTypes.string,
      keyObj: PropTypes.any,
      QRCodeShown: PropTypes.bool
    })
  };

  logOut() {
    //event.preventDefault();
    //timeOut({on: false});
    AuthMethods.setVerified.call({ verified: false }, (err, res) => {
      if (err) {
        Library.modalErrorAlert(err.reason);
        console.log(`setVerified error`, err);
      }
    });

    //ContentManagement.refreshDefaultContent();
    Meteor.logout(() => {
      this.closeNavbar();
      this.emailNotifySent = false;
      this.props.history.push("/");
    });
  }

  getAuthLink() {
    if (this.props.enhancedAuth) {
      if (this.props.authData && !this.props.authData.verified) {
        return (
          <DropdownItem onClick={this.closeNavbar} className="nav-link" tag={Link} to="/authenticate">
            Authenticator
          </DropdownItem>
        );
      }
    }
  }

  getAuthLayout() {
    let SignedInLayout = (
      <DropdownMenu>
        <DropdownItem onClick={this.logOut} tag={Link} to="#" className="nav-link">
          Sign Out
        </DropdownItem>

        <DropdownItem onClick={this.closeNavbar} className="nav-link" tag={Link} to="/profile">
          Profile
        </DropdownItem>

        <DropdownItem onClick={this.closeNavbar} className="nav-link" tag={Link} to="/change-password">
          Change Password
        </DropdownItem>

        {this.getAuthLink()}
      </DropdownMenu>
    );

    let SignedOutLayout = (
      <DropdownMenu>
        <DropdownItem onClick={this.closeNavbar} className="nav-link" tag={Link} to="/register">
          Register
        </DropdownItem>

        <DropdownItem onClick={this.closeNavbar} className="nav-link" tag={Link} to="/signin">
          Sign In
        </DropdownItem>
        <DropdownItem onClick={this.closeNavbar} className="nav-link" tag={Link} to="/forgot-password">
          Forgot Password
        </DropdownItem>
      </DropdownMenu>
    );

    return this.props.signedIn ? SignedInLayout : SignedOutLayout;
  }

  authVerifiedLayout() {
    let tipObj = Library.dashBoardTip(this.props);
    let tip = tipObj.tip;
    let verifiedFlag = tipObj.verified;
    let verified = (
      <div className="d-inline-block">
        <div className="d-none d-sm-inline">{this.props.emailDashDisplay}</div>{" "}
        <div className="d-inline-block">
          {VerifiedIndicator(verifiedFlag)}
          <UncontrolledTooltip placement="right" target="VerifiedIndicator">
            {tip}
          </UncontrolledTooltip>
        </div>
      </div>
    );
    return verified;
  }

  navBar() {
    return (
      <div>
        <Navbar color="dark" expand="md" className="main-nav fixed-top" dark>
          <div className="navbar-brand">
            {this.props.ShortTitle} {this.props.signedIn === true ? this.authVerifiedLayout() : ""}
          </div>
          <NavbarToggler onClick={this.toggleNavbar} />
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={this.closeNavbar} tag={Link} to="/">
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={this.closeNavbar} tag={Link} to="About">
                  About
                </NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Members
                </DropdownToggle>
                {this.getAuthLayout()}
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

  render() {
    return this.navBar();
  }
}

export default withRouter(
  withTracker(({ params }) => {
    let userDataHandle = Meteor.subscribe("userData");
    let authDataReady = Meteor.subscribe("enhancedAuth");
    let authData: any;
    if (Meteor.user()) {
      if (authDataReady) {
        authData = Auth.findOne({ owner: Meteor.userId() });
      }
    }
    let loading = !userDataHandle.ready();
    return { loading: loading, authData: authData };
  })(Navigation)
);
