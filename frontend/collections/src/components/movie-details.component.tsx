import React, { Component } from "react";
import { Modal, Button, Icon, Tooltip, Typography, Popconfirm } from "antd";
import Movie from "../classes/movie";
import Tag from "../classes/tag";
import TagComponent from "./tag.component";

const { Title } = Typography;

interface IMovieDetailsComponentProps {
  movie: Movie;
  tags: Tag[];
  deleteMovie: () => void;
}

export default class MovieDetailsComponent extends Component<
  IMovieDetailsComponentProps
> {
  state = {
    infoVisible: false,
    updateVisible: false,
    chosenTags: []
  };

  showInfoModal = () => {
    this.setState({
      infoVisible: true
    });
  };

  showUpdateModal = () => {
    this.setState({
      updateVisible: true
    });
  };

  handleInfoCancel = () => {
    this.setState({ infoVisible: false });
  };

  handleUpdateCancel = () => {
    this.setState({ updateVisible: false });
  };

  handleDelete = () => {
    this.props.deleteMovie();
  };

  handleCheckedTag = (checked: boolean, tag: Tag) => {
    let tmp: Tag[] = this.state.chosenTags;
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
    return (
      <div>
        <Tooltip
          mouseEnterDelay={0.5}
          title="click to update movie!"
          placement="bottom"
        >
          <div style={{ display: "inline-block" }}>
            <Button onClick={this.showUpdateModal}>
              <Icon type="edit" theme="twoTone" />
            </Button>
          </div>
        </Tooltip>
        <Tooltip
          mouseEnterDelay={0.5}
          title="click to display movie information!"
          placement="bottom"
        >
          <div style={{ padding: 10, display: "inline-block" }}>
            <Button onClick={this.showInfoModal}>
              <Icon type="info-circle" theme="twoTone" />
            </Button>
          </div>
        </Tooltip>

        <Tooltip
          mouseEnterDelay={0.5}
          title="click to delete movie!"
          placement="bottom"
        >
          <div style={{ display: "inline-block" }}>
            <Popconfirm
              title="are you sure you want to delete this title from your collection?"
              okText="yes"
              cancelText="no"
              onConfirm={this.handleDelete}
              icon={<Icon type="question-circle-o" style={{ color: "red" }} />}
            >
              <Button>
                <Icon type="delete" theme="twoTone" twoToneColor="#d11a2a" />
              </Button>
            </Popconfirm>
          </div>
        </Tooltip>
        <Modal
          title={<Title level={4}>{this.props.movie.title}</Title>}
          closable={false}
          style={{ left: 500, top: 250 }}
          visible={this.state.infoVisible}
          onCancel={this.handleInfoCancel}
          footer={[
            <Button
              block
              icon="close-circle"
              type="primary"
              ghost
              onClick={this.handleInfoCancel}
            />
          ]}
        >
          <p>
            <strong>year released</strong>: {this.props.movie.year}
          </p>
          <p>
            <strong>rated</strong>: {this.props.movie.rated}
          </p>
          <p>
            <strong>runtime</strong>: {this.props.movie.runtime}
          </p>
          <br />
          <p>{this.props.movie.plot}</p>
        </Modal>
        <Modal
          title={
            <Title level={4}>
              add some tags to... {this.props.movie.title}
            </Title>
          }
          closable={false}
          style={{ left: 500, top: 250 }}
          visible={this.state.updateVisible}
          onCancel={this.handleUpdateCancel}
          footer={[
            <Button
              block
              icon="close-circle"
              type="primary"
              ghost
              onClick={this.handleUpdateCancel}
            />
          ]}
        >
          {this.props.tags.map(tag => {
            return (
              <div style={{ display: "inline-block" }}>
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
