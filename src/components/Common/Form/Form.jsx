import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../Button/Button";
import TextInput from "../TextInput/TextInput";
import FileInput from "../FileInput/FileInput";

import firebase from "../../../utils/firebase";
import app from "firebase/app";
import "firebase/storage";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        age: "",
        city: "",
        file: [],
        profile_picture: ""
      },
      errors: null,
      btnLoading: false
    };
  }

  componentDidMount() {
    const { form } = this.props;
    if (this.props.formType === "update" && form) {
      this.setState({
        form: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          password: form.password,
          age: form.age,
          city: form.city,
          file: [],
          profile_picture: form.profile_picture
        }
      });
    }
  }
  onChange = e => {
    const form = { ...this.state.form };
    form[e.target.name] = e.target.value;
    this.setState({ form, errors: null });
  };

  handleFileChange = e => {
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState(
        {
          form: { ...this.state.form, file: file }
        },
        () => {
          const { file } = this.state.form;
          const uploadFile = app
            .storage()
            .ref(`images/${file.name}`)
            .put(file);
          uploadFile.on(
            "state_changed",
            snapshot => {},
            error => {
              console.log("File Upload error : ", error);
            },
            () => {
              app
                .storage()
                .ref("images")
                .child(file.name)
                .getDownloadURL()
                .then(url => {
                  this.setState({
                    form: { ...this.state.form, profile_picture: url }
                  });
                });
            }
          );
        }
      );
    };
    reader.readAsDataURL(file);
  };

  onRegister = async () => {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      age,
      city,
      profile_picture
    } = this.state.form;
    try {
      this.setState({ errors: null, btnLoading: true });
      await firebase.register(
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        age,
        city,
        profile_picture
      );
      if (firebase.onAuthComplete()) {
        this.setState({ btnLoading: false }, () => {
          window.location.href = "/profile";
        });
      }
    } catch (error) {
      const errors = { ...this.state.errors };
      if (error.code == "auth/invalid-email") errors["email"] = error.message;
      else if (error.code == "auth/weak-password")
        errors["password"] = error.message;
      this.setState({ errors, btnLoading: false });
    }
  };

  onUpdate = async () => {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      age,
      city,
      profile_picture
    } = this.state.form;
    try {
      this.setState({ errors: null, btnLoading: true });
      await firebase.update(
        email,
        firstName,
        lastName,
        phoneNumber,
        age,
        city,
        profile_picture
      );
      this.setState({ btnLoading: false }, () => {
        alert("Profile Details Updated Successfully!");
        this.getUser();
      });
    } catch (error) {
      const errors = { ...this.state.errors };
      if (error.code == "auth/invalid-email") errors["email"] = error.message;
      else if (error.code == "auth/weak-password")
        errors["password"] = error.message;
      this.setState({ errors, btnLoading: false });
      console.error("On Update error : ", error.message);
    }
  };

  getUser = () => {
    firebase.getUserData().then(res => {
      this.setState({ form: { ...this.state.form, ...res.data() } });
    });
  };

  render() {
    const { form, errors, btnLoading } = this.state,
      { formType, children } = this.props;
    return (
      <form action="" className="user-form mt-4 mx-auto text-center">
        <div className="profile-img">
          <div className="form-group mx-auto mb-4">
            <FileInput
              value={form.file}
              profile_picture={form.profile_picture}
              onChange={e => this.handleFileChange(e)}
            ></FileInput>
            {formType === "register" ? (
              <p className="mt-1">Upload Profile</p>
            ) : (
              ""
            )}
          </div>
          {formType === "update" ? (
            <div className="login-info mb-4">
              <div className="mb-2">
                <b className="text-capitalize">
                  {form ? form.firstName + " " + form.lastName : ""}
                </b>
              </div>
              {children}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="fields-wrapper">
          <div className="input-wrapper">
            <div className="form-group mb-4">
              <TextInput
                placeholder="First Name"
                name="firstName"
                value={form.firstName}
                onChange={this.onChange}
              ></TextInput>
            </div>
            <div className="form-group mb-4">
              <TextInput
                placeholder="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={this.onChange}
              ></TextInput>
            </div>
          </div>
          <div className="input-wrapper">
            <div className="form-group mb-4">
              <TextInput
                placeholder="Email ID"
                name="email"
                value={form.email}
                onChange={this.onChange}
                error={errors && errors["email"]}
              ></TextInput>
            </div>
            <div className="form-group mb-4">
              {formType === "register" ? (
                <TextInput
                  type="password"
                  placeholder="Create Password"
                  name="password"
                  value={form.password}
                  onChange={this.onChange}
                  error={errors && errors["password"]}
                ></TextInput>
              ) : (
                <TextInput
                  placeholder="Current location"
                  name="city"
                  value={form.city}
                  onChange={this.onChange}
                ></TextInput>
              )}
            </div>
          </div>
          <div className="input-wrapper">
            <div className="form-group mb-4">
              <TextInput
                placeholder="Age"
                name="age"
                value={form.age}
                onChange={this.onChange}
              ></TextInput>
            </div>
            <div className="form-group mb-4">
              <TextInput
                placeholder="Phone Number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={this.onChange}
              ></TextInput>
            </div>
          </div>
          {formType === "register" && (
            <div className="form-group mb-4 current-location">
              <TextInput
                placeholder="Current location"
                name="city"
                value={form.city}
                onChange={this.onChange}
              ></TextInput>
            </div>
          )}
          <div className="form-footer">
            {formType === "register" ? (
              <>
                <div className="form-group mb-2">
                  <Button
                    className="login-btn"
                    onClick={this.onRegister}
                    btnLoading={btnLoading}
                  >
                    {btnLoading ? "Registering..." : "Register"}
                  </Button>
                </div>
                <p>
                  Already have an account? Login{" "}
                  <NavLink to="/login" className="text-blue text-underline">
                    <u>here</u>
                  </NavLink>
                </p>
              </>
            ) : (
              <Button
                className="login-btn"
                onClick={this.onUpdate}
                btnLoading={btnLoading}
              >
                {btnLoading ? "Updating..." : "Update"}
              </Button>
            )}
          </div>
        </div>
      </form>
    );
  }
}

export default Form;
