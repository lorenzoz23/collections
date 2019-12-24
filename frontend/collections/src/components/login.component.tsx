import React, { Component } from "react";
import { Form, Icon, Input, Button, Typography, notification } from "antd";
import axios from "axios";
import "../css-styling/Login.css";
import { Link, Redirect } from "react-router-dom";
import Tag from "../classes/tag";

const { Title } = Typography;

export default class LoginComponent extends Component {
  state = {
    username: "",
    password: "",
    loginSuccess: false,
    id: "",
    tags: [new Tag()]
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

  handleSubmit = (e: any) => {
    let self = this;
    e.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password
    };

    axios
      .post("http://localhost:5000/users/login", user)
      .then(function(res) {
        self.setState({
          loginSuccess: true,
          id: res.data._id,
          tags: res.data.tags
        });
      })
      .catch(function(err) {
        console.log(err);
        notification.open({
          message: "failure to login!",
          description: "we were unable to log you in to the application.",
          icon: <Icon type="frown" style={{ color: "#108ee9" }} />
        });
      });
  };

  render() {
    let userId = "/dashboard/" + this.state.id;
    return (
      <div className="login">
        <Title>login</Title>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="username"
              onChange={this.onChangeUsername}
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="password"
              onChange={this.onChangePassword}
            />
          </Form.Item>
          <Form.Item>
            <Button
              icon="login"
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ width: "100%" }}
            >
              log in
            </Button>
            <div>
              <Link to="/create">
                <Button icon="user-add">sign up</Button>
              </Link>
            </div>
          </Form.Item>
        </Form>
        {this.state.loginSuccess ? (
          <Redirect
            to={{
              pathname: userId,
              state: {
                username: this.state.username,
                id: this.state.id,
                tags: this.state.tags
              }
            }}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
