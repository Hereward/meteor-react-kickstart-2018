//import React from 'react';

//var withTracker: any;

import * as React from "react";
import { Meteor } from "meteor/meteor";
import * as PropTypes from "prop-types";
//import PropTypes from "prop-types";
//import { Link } from "react-router-dom";
import { Link, withRouter } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import styled from "styled-components";

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

interface IProps {
  history: any;
  SignedIn: any;
  ShortTitle: any;
  UserName: any;
  AuthVerified: boolean;
}

interface IState {
  isOpen: boolean;
}

//import { browserHistory } from 'react-router';

const VerifiedIndicator = styled.div`
  border-radius: 50%;
  height: 1rem;
  width: 1rem;
  display: inline-block;
  position: relative;
  top: 0.2rem;
  background-color: ${props => (props.verified ? 'lime' : 'red')};
`;

class Navigation extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };

    //this.LogOut = this.LogOut.bind(this);

    //console.log(`Navigation Constructor: props.SignedIn: [${this.props.mySillyProp}] [${this.props.SignedIn}]`);
  }

  static propTypes = {
    AuthVerified: PropTypes.bool,
    SignedIn: PropTypes.bool
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  LogOut(event) {
    event.preventDefault();
    Meteor.logout(() => {
      console.log("Successfull log out!");
      this.props.history.push("/");
    });
  }

  getAuthLayout() {
    let SignedInLayout = (
      <DropdownMenu>
        <DropdownItem>
          <NavLink tag={Link} to="#" onClick={this.LogOut.bind(this)}>
            Sign Out
          </NavLink>
        </DropdownItem>
      </DropdownMenu>
    );

    let SignedOuLayout = (
      <DropdownMenu>
        <DropdownItem>
          <NavLink tag={Link} to="/register">
            Register
          </NavLink>
        </DropdownItem>
        <DropdownItem>
          <NavLink tag={Link} to="/signin">
            Sign In
          </NavLink>
        </DropdownItem>
      </DropdownMenu>
    );

    return this.props.SignedIn ? SignedInLayout : SignedOuLayout;
  }

  authVerified() {
    //let verified = this.props.AuthVerified ? <span> [verified] </span> : "";
    let tip = this.props.AuthVerified === true ? 'Your session was verified.' : 'Unverified session.';
    let verified = (
      <span>
        <VerifiedIndicator
          verified={this.props.AuthVerified}
          id="VerifiedIndicator"
        />

        <UncontrolledTooltip placement="right" target="VerifiedIndicator">
           {tip}
        </UncontrolledTooltip>
      </span>
    );
    //let verified =  <span> [NOT VERIFIED] </span>;
    return verified;
  }

  render() {
    return (
      <Navbar color="dark" expand="md" className="main-nav" dark>
        <NavbarBrand>
          <span className="app-title">{this.props.ShortTitle}</span>
          {this.props.UserName} {this.authVerified()}
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="About">
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
    );
  }
}

export default withRouter(
  withTracker(({ params }) => {
    Meteor.subscribe("tasks");
    return {};
  })(Navigation)
);



/*
Navigation.propTypes = {
  AuthVerified: PropTypes.bool,
  SignedIn: PropTypes.bool
};
*/


//


/*
export default withRouter(withTracker(({ params }) => {
    Meteor.subscribe('tasks');
    return {

    };
})(Navigation));
*/
