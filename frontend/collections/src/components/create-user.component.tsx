import React, { Component } from "react";
import { Form, Icon, Input, Button, Typography, notification } from "antd";
import "../css-styling/Login.css";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";

const { Title } = Typography;

export default class CreateUserComponent extends Component {
  state = {
    username: "",
    password: "",
    password2: "",
    usernameErrorText: "",
    passwordErrorText: "",
    userCreated: false
  };

  onChangeUsername = (e: any) => {
    this.setState({
      username: e.target.value
    });
  };

  onChangePassword = (e: any) => {
    this.setState({
      password: e.target.value
    });
  };

  onChangePassword2 = (e: any) => {
    this.setState({
      password2: e.target.value
    });
  };

  verification = () => {
    if (this.state.username.length < 6) {
      this.setState({
        usernameErrorText: "username must be at least 6 characters long!"
      });
      return false;
    } else {
      this.setState({
        usernameErrorText: ""
      });
    }
    if (this.state.password.length < 8) {
      this.setState({
        passwordErrorText: "password must be at least 8 characters long!"
      });
      return false;
    } else {
      this.setState({
        passwordErrorText: ""
      });
    }
    if (this.state.password !== this.state.password2) {
      this.setState({
        passwordErrorText: "passwords must match!"
      });
      return false;
    } else {
      this.setState({
        passwordErrorText: ""
      });
    }

    return true;
  };

  checkIfUserExists = (username: string) => {
    let found = false;
    axios
      .get("http://localhost:5000/users/".concat(username))
      .then(function(res) {
        console.log(res);
        if (res.data.username === username) {
          notification.open({
            message: "user already exists!",
            description: "try a different username",
            icon: <Icon type="warning" style={{ color: "#108ee9" }} />
          });
          found = true;
        } else found = false;
      })
      .catch(function(err) {
        console.log(err);
      });
    return found;
  };

  handleSubmit = (e: any) => {
    let self = this;
    e.preventDefault();
    if (this.verification()) {
      const tags = [];
      tags.push({
        format: "blu-ray"
      });
      tags.push({
        format: "dvd"
      });
      tags.push({
        format: "4k ultra-hd"
      });
      const user = {
        username: this.state.username,
        password: this.state.password,
        tags: tags
      };

      if (!this.checkIfUserExists(this.state.username)) {
        axios
          .post("http://localhost:5000/users/create", user)
          .then(function(user) {
            notification.open({
              message: "new account!",
              description: "",
              icon: <Icon type="smile" style={{ color: "#108ee9" }} />
            });
            self.setState({
              userCreated: true
            });
          })
          .catch(function(err) {
            console.log(err);
            notification.open({
              message: "failure to create new account!",
              description:
                "we were unable to create a new account with the credentials supplied.",
              icon: <Icon type="frown" style={{ color: "#108ee9" }} />
            });
            self.setState({
              userCreated: false
            });
          });
      }
    }
  };

  render() {
    return (
      <div className="login">
        <Title>sign up</Title>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            <Input
              name="username"
              placeholder="enter new username"
              required={true}
              value={this.state.username}
              onChange={this.onChangeUsername}
            />
          </Form.Item>
          <Form.Item>
            <Input
              name="password"
              type="password"
              placeholder="enter new password"
              required={true}
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type="password"
              name="password"
              placeholder="re-enter password"
              required={true}
              value={this.state.password2}
              onChange={this.onChangePassword2}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              icon="user-add"
            >
              create
            </Button>
            <div>
              <Link to="/">
                <Button icon="rollback">back</Button>
              </Link>
            </div>
          </Form.Item>
          <p style={{ color: "red" }}>{this.state.usernameErrorText}</p>
          <p style={{ color: "red" }}>{this.state.passwordErrorText}</p>
        </Form>
        {this.state.userCreated ? <Redirect to="/" /> : ""}
      </div>
    );
  }
}
