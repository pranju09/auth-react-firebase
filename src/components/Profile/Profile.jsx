import React, { Component } from "react";
import firebase from "../../utils/firebase";
import { Button } from "../Common/Button/Button";
import Form from "../Common/Form/Form";
import SectionWrapper from "../Common/SectionWrapper/SectionWrapper";

class Profile extends Component {
  state = {
    user: null
  };
  componentDidMount() {
    this.setUser();
  }

  setUser = () => {
    firebase.getUserData().then(res => {
      this.setState({ user: res.data() });
    });
  };

  onLogout = async () => {
    try {
      await firebase.logout();
      this.props.history.replace("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    const { user } = this.state;
    return firebase.checkUserLoggedIn() ? (
      <div>
        {user ? (
          <SectionWrapper className="profile-section">
            <span className="heading text-capitalized">Profile</span>
            <Form formType="update" form={user}>
              <Button
                onClick={this.onLogout}
                className="btn-light btn-sm logout-btn"
              >
                <i className="fa fa-sign-out" aria-hidden="true"></i>
                Log out
              </Button>
            </Form>
          </SectionWrapper>
        ) : (
          <h3>Loading..........</h3>
        )}
      </div>
    ) : (
      this.props.history.replace("/login")
    );
  }
}

export default Profile;
