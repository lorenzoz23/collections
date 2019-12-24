import React, { Component } from "react";
import { Button, Drawer, Input, notification, Icon } from "antd";
import TagClass from "../classes/tag";

import TagComponent from "./tag.component";

interface IAddDeleteTagComponentProps {
  tags: TagClass[];
  deletedTags: (tagsToDelete: TagClass[]) => void;
  addTag: (tagToAdd: string) => void;
}

export default class AddDeleteTagComponent extends Component<
  IAddDeleteTagComponentProps
> {
  state = {
    visible: false,
    childrenDrawer: false,
    deletedTags: [],
    inputValue: ""
  };
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
      inputValue: ""
    });
  };

  handleAddSubmit = () => {
    if (this.findTag() === undefined) {
      this.props.addTag(this.state.inputValue);
      this.onChildrenDrawerClose();
      this.onClose();
      notification.open({
        message: "tag add!",
        description:
          this.state.inputValue + " was added to your tag collection!",
        icon: <Icon type="smile" style={{ color: "#108ee9" }} />
      });
    } else {
      notification.open({
        message: "failure to add tag!",
        description: "can't add what's already there!",
        icon: <Icon type="frown" style={{ color: "#108ee9" }} />
      });
    }
  };

  handleDeleteSubmit = () => {
    let tagsToDelete: TagClass[] = this.state.deletedTags;
    this.props.deletedTags(tagsToDelete);
    this.onClose();
  };

  handleCheckedTag = (checked: boolean, tag: TagClass) => {
    let tmp: TagClass[] = this.state.deletedTags;
    if (checked) {
      tmp.push(tag);
    } else {
      const idx: number = tmp.indexOf(tag);
      tmp.splice(idx, 1);
    }
    this.setState({
      deletedTags: tmp
    });
  };

  handleInputChange = (e: any) => {
    console.log(e.target.value);
    this.setState({ inputValue: e.target.value });
  };

  findTag = () => {
    let i: number;
    for (i = 0; i < this.props.tags.length; i++) {
      if (this.props.tags[i].format === this.state.inputValue) {
        return this.props.tags[i];
      }
    }
  };

  getSecondDrawerContent = () => {
    return (
      <div>
        <div>
          <Input
            value={this.state.inputValue}
            onChange={this.handleInputChange}
            size="large"
            placeholder="enter new tag here..."
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            borderTop: "1px solid #e8e8e8",
            padding: "10px 16px",
            textAlign: "center",
            left: 0,
            background: "#fff",
            borderRadius: "0 0 4px 4px"
          }}
        >
          <Button
            disabled={this.state.inputValue.length === 0 ? true : false}
            onClick={this.handleAddSubmit}
            type="primary"
            block
          >
            add
          </Button>
        </div>
      </div>
    );
  };

  getFirstDrawerContent = () => {
    let content = [];
    let i: number = 0;
    const secondContent = this.getSecondDrawerContent();

    content.push(
      this.props.tags.map(tag => (
        <div style={{ padding: "10px", display: "inline-block" }}>
          <TagComponent
            key={tag.format}
            tag={tag}
            handleChecked={checked => this.handleCheckedTag(checked, tag)}
          />
        </div>
      ))
    );
    content.push(
      <div>
        <div style={{ marginLeft: 10 }}>
          <br />
          <strong>or...</strong>
        </div>
        <div style={{ padding: 10 }}>
          <Button type="primary" onClick={this.showChildrenDrawer}>
            add a tag
          </Button>
        </div>
        <Drawer
          title="add a tag!"
          width={320}
          closable={false}
          onClose={this.onChildrenDrawerClose}
          visible={this.state.childrenDrawer}
        >
          {secondContent}
        </Drawer>
      </div>
    );
    content.push(
      <div
        key={i++}
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          borderTop: "1px solid #e8e8e8",
          padding: "10px 16px",
          textAlign: "right",
          left: 0,
          background: "#fff",
          borderRadius: "0 0 4px 4px"
        }}
      >
        <Button
          style={{
            marginRight: 8
          }}
          onClick={this.onClose}
        >
          cancel
        </Button>
        <Button
          disabled={this.state.deletedTags.length === 0 ? true : false}
          onClick={this.handleDeleteSubmit}
          type="primary"
        >
          delete
        </Button>
      </div>
    );
    return content;
  };

  render() {
    const content = this.getFirstDrawerContent();
    return (
      <div>
        <Button onClick={this.showDrawer} type="ghost" block>
          add/delete a tag
        </Button>
        <Drawer
          title="select tags to delete..."
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          {content}
        </Drawer>
      </div>
    );
  }
}
