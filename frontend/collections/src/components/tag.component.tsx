import React, { Component } from "react";
import { Tag } from "antd";
import TagClass from "../classes/tag";

const { CheckableTag } = Tag;

interface ITagComponentProps {
  tag: TagClass;
  handleChecked: (checked: boolean) => void;
}

export default class TagComponent extends Component<ITagComponentProps> {
  state = {
    checked: false
  };

  handleCheckChange = async () => {
    await this.setState({ checked: !this.state.checked });
    this.props.handleChecked(this.state.checked);
  };

  render() {
    return (
      <div>
        <CheckableTag
          checked={this.state.checked}
          onChange={this.handleCheckChange}
        >
          {this.props.tag.format}
        </CheckableTag>
      </div>
    );
  }
}
