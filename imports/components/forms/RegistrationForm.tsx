import * as React from "react";
import { withTracker } from "meteor/react-meteor-data";
import * as PropTypes from "prop-types";
import * as jquery from "jquery";
import "jquery-validation";
import "tooltipster";
import "tooltipster/dist/css/tooltipster.bundle.min.css";
import "tooltipster/dist/css/plugins/tooltipster/sideTip/themes/tooltipster-sideTip-light.min.css";
import RaisedButton from "material-ui/RaisedButton";

interface IProps {
  handleChange: any;
  handleSubmit: any;
}

interface IState {
  disableSubmit: boolean;
}

export default class RegistrationForm extends React.Component<IProps, IState> {
  formID: string = "RegistrationForm";
  baseCSSClass: string = "form-control tooltipster required";

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      disableSubmit: false
    };
  }

  static propTypes = {
    handleSubmit: PropTypes.func,
    handleChange: PropTypes.func
  };

  componentDidMount() {
    jquery(`.tooltipster, .tooltipsterParent input`).tooltipster({
      trigger: "custom",
      animation: "slide",
      theme: "tooltipster-light",
      zIndex: 1400
    });
    jquery(`#${this.formID}`).validate({
      errorPlacement: function ep(error, element) {
        let errorString = jquery(error).text();
        element.tooltipster("content", errorString);
        element.tooltipster("open");
      },
      submitHandler: form => {
        this.props.handleSubmit();
      },
      success: function success(label, element) {
        jquery(`#${element.id}`).tooltipster("close");
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      disableSubmit: true
    });
    this.props.handleSubmit(e);
  }

  handleChange(e) {
    this.props.handleChange(e);
  }

  render() {
    return (
      <div>
        <h2>Register</h2>
        <form id={this.formID}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              onChange={this.handleChange}
              type="email"
              className={this.baseCSSClass}
              id="email"
              name="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password1">Password</label>
            <input
              onChange={this.handleChange}
              type="password"
              className={this.baseCSSClass}
              id="password1"
              name="password1"
              placeholder="Password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              onChange={this.handleChange}
              type="password"
              className={this.baseCSSClass}
              id="password2"
              name="password2"
              placeholder="Confirm Password"
              required
            />
          </div>

          <div className="form-group">
            <RaisedButton disabled={this.state.disableSubmit} type="submit" primary={true} label="Submit" />
          </div>
        </form>
      </div>
    );
  }
}
