import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import TextInput from "../Common/TextInput/TextInput";
import { Button } from "../Common/Button/Button";
import SectionWrapper from "../Common/SectionWrapper/SectionWrapper";
import firebase from "../../utils/firebase";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: null,
      btnLoading: false
    };
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value, errors: null });
  };

  onLogin = async () => {
    const { email, password } = this.state;
    try {
      this.setState({ errors: null, btnLoading: true });
      await firebase.login(email, password);
      if (firebase.onAuthComplete()) {
        this.setState({ btnLoading: false });
        this.props.history.replace("/profile");
      }
    } catch (error) {
      const errors = { ...this.state.errors };
      if (error.code === "auth/invalid-email") errors["email"] = error.message;
      else if (error.code === "auth/wrong-password")
        errors["password"] = error.message;
      this.setState({ errors, btnLoading: false });
    }
  };
  render() {
    const { email, password, errors, btnLoading } = this.state;
    return (
      <SectionWrapper className="login-section">
        <span className="heading">Log In</span>
        <form action="" className="login-form mt-4 text-center">
          <div className="form-group mb-4">
            <TextInput
              placeholder="Email ID"
              name="email"
              value={email}
              onChange={this.onChange}
              error={errors && errors["email"]}
            ></TextInput>
          </div>
          <div className="form-group mb-4">
            <TextInput
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={this.onChange}
              error={errors && errors["password"]}
            ></TextInput>
          </div>
          <div className="form-group mb-4">
            <Button
              className="login-btn"
              onClick={this.onLogin}
              btnLoading={btnLoading}
            >
              {btnLoading ? "Loging In..." : "Login"}
            </Button>
          </div>
          <p>
            Don’t have an account? Register{" "}
            <NavLink to="/register" className="text-blue text-underline">
              <u>here</u>
            </NavLink>{" "}
            for free
          </p>
        </form>
      </SectionWrapper>
    );
  }
}

export default Login;
