import React, { Component } from "react";
import SectionWrapper from "../Common/SectionWrapper/SectionWrapper";
import Form from "../Common/Form/Form";

class Register extends Component {
  render() {
    return (
      <SectionWrapper className="register-section">
        <span className="heading">Register</span>
        <Form formType="register"></Form>
      </SectionWrapper>
    );
  }
}

export default Register;
