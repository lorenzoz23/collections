import React, { Component } from "react";
import { Modal, Typography } from "antd";
import TagComponent from "./tag.component";
import TagClass from "../classes/tag";
import Movie from "../classes/movie";

const { Title } = Typography;

interface IConfirmMovieComponentProps {
  tags: TagClass[];
  handleOk: (tags: TagClass[]) => void;
  handleCancel: () => void;
  selection: Movie;
}

export default class ConfirmMovieComponent extends Component<
  IConfirmMovieComponentProps
> {
  state = {
    tags: this.props.tags,
    chosenTags: [],
    modalVisible: true
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false
    });
    this.props.handleCancel();
  };

  handleCheckedTag = (checked: boolean, tag: TagClass) => {
    let tmp: TagClass[] = this.state.chosenTags;
    if (checked) {
      tmp.push(tag);
    } else {
      const idx: number = tmp.indexOf(tag);
      console.log(tmp);
      tmp.splice(idx, 1);
      console.log(tmp);
    }

    this.setState({
      chosenTags: tmp
    });
  };

  render() {
    const { tags } = this.state;
    let tagKey = 0;
    return (
      <div>
        <Modal
          title={<Title level={3}>confirm your movie selection for...</Title>}
          visible={this.state.modalVisible}
          onOk={() => this.props.handleOk(this.state.chosenTags)}
          onCancel={this.handleCancel}
        >
          <img
            alt={this.props.selection.title as string}
            src={this.props.selection.poster as string}
            width={150}
          />
          <p />
          <strong>{this.props.selection.title}</strong>
          <p>{this.props.selection!.plot}</p>
          <p />
          <Title level={4}>what format do you own this title?</Title>
          {tags.map(tag => {
            tagKey++;
            return (
              <div key={tagKey} style={{ display: "inline-block" }}>
                <TagComponent
                  tag={tag}
                  handleChecked={checked => this.handleCheckedTag(checked, tag)}
                />
              </div>
            );
          })}
        </Modal>
      </div>
    );
  }
}
