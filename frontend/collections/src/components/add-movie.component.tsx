import React, { Component } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  notification,
  Tooltip,
  Icon,
  InputNumber,
  Checkbox
} from "antd";
import axios from "axios";
import ConfirmMovieComponent from "./confirm-movie.component";
import Movie from "../classes/movie";
import Tag from "../classes/tag";

interface IAddMovieComponentProps {
  movies: Movie[];
  tags: Tag[];
  addMovie: (movie: Movie) => void;
  id: String;
}

interface IAddMovieComponentState {
  drawerVisible: boolean;
  searchTitle: String;
  searchYear: String;
  selection: Movie;
  modalVisible: boolean;
  tags: string[];
  yearDisabled: boolean;
}

export default class AddMovieComponent extends Component<
  IAddMovieComponentProps,
  IAddMovieComponentState
> {
  state = {
    drawerVisible: false,
    searchTitle: "",
    searchYear: "2019",
    selection: new Movie(),
    modalVisible: false,
    tags: [],
    yearDisabled: true
  };

  showDrawer = () => {
    this.setState({
      drawerVisible: true
    });
  };

  toggleYear = () => {
    this.setState({
      yearDisabled: !this.state.yearDisabled
    });
  };

  handleOk = async (tags: Tag[]) => {
    console.log("tags from selection:");
    console.log(tags);
    await this.handleListSelection(tags);
    this.handleCancel();
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  onClose = () => {
    this.setState({
      drawerVisible: false,
      searchTitle: "",
      searchYear: "",
      yearDisabled: true
    });
  };

  onChangeSearchTitle = (e: any) => {
    this.setState({
      searchTitle: e.target.value
    });
  };

  onChangeSearchYear = (year: any) => {
    this.setState({
      searchYear: year
    });
  };

  checkIfMovieAlreadyExists = (title: string) => {
    let i: number = 0;
    for (i = 0; i < this.props.movies.length; i++) {
      if (this.props.movies[i].title === title) return true;
    }
    return false;
  };

  handleListSelection = async (tags: Tag[]) => {
    if (!this.checkIfMovieAlreadyExists(this.state.selection.title)) {
      const self = this;
      let movie: Movie = {
        _id: "",
        title: this.state.selection.title,
        poster: this.state.selection.poster,
        plot: this.state.selection.plot,
        year: this.state.selection.year,
        runtime: this.state.selection.runtime,
        rated: this.state.selection.rated,
        director: this.state.selection.director,
        tagFormat: tags.map(tag => tag.format)
      };
      await axios
        .put(
          "http://localhost:5000/users/"
            .concat(this.props.id as string)
            .concat("/movies/create"),
          movie
        )
        .then(async resp => {
          let updatedMovie: Movie = {
            _id: resp.data.movies[resp.data.movies.length - 1]._id,
            title: this.state.selection.title,
            poster: this.state.selection.poster,
            plot: this.state.selection.plot,
            year: this.state.selection.year,
            runtime: this.state.selection.runtime,
            rated: this.state.selection.rated,
            director: this.state.selection.director,
            tagFormat: tags.map(tag => tag.format)
          };
          await this.setState({
            selection: updatedMovie
          });
          self.props.addMovie(self.state.selection);
          self.onClose();
        })
        .catch(function(err) {
          console.log(err);
          notification.open({
            message: "failure to add movie!",
            description:
              "we were unable to add the requested movie to your collection.",
            icon: <Icon type="frown" style={{ color: "#108ee9" }} />
          });
        });
    } else {
      notification.open({
        message: "movie already exists!",
        description: "can't have duplicates!",
        icon: <Icon type="bulb" style={{ color: "#108ee9" }} />
      });
    }
  };

  handleSearch = async () => {
    let url: String = "http://www.omdbapi.com/?apikey=59de1338&t=";
    url = url.concat(this.state.searchTitle);
    if (!this.state.yearDisabled) {
      url = url.concat("&y=");
      url = url.concat(this.state.searchYear);
    }
    const response = await fetch(url as string, { method: "GET" });
    const myJson = await response.json();

    const movie: Movie = {
      _id: "",
      title: myJson.Title,
      poster: myJson.Poster,
      plot: myJson.Plot,
      year: myJson.Year,
      runtime: myJson.Runtime,
      rated: myJson.Rated,
      director: myJson.Director,
      tagFormat: []
    };

    this.setState({
      selection: movie,
      modalVisible: true
    });
  };

  render() {
    return (
      <div>
        <Tooltip mouseEnterDelay={0.5} title="add a movie!" placement="bottom">
          <Button
            shape="circle"
            type="primary"
            icon="plus"
            onClick={this.showDrawer}
          />
        </Tooltip>
        <Drawer
          bodyStyle={{ background: "#E34B40" }}
          title="add a film to your collection!"
          placement="bottom"
          onClose={this.onClose}
          visible={this.state.drawerVisible}
          height={400}
        >
          {this.state.modalVisible ? (
            <ConfirmMovieComponent
              handleCancel={this.handleCancel}
              handleOk={tags => this.handleOk(tags)}
              selection={this.state.selection}
              tags={this.props.tags}
            />
          ) : (
            ""
          )}
          <div>
            <Form.Item>
              <strong>title</strong>
              <Tooltip
                mouseEnterDelay={0.5}
                title="enter full name of movie for most accurate results"
                placement="bottomLeft"
              >
                <Input
                  allowClear={true}
                  value={this.state.searchTitle}
                  onPressEnter={this.handleSearch}
                  onChange={this.onChangeSearchTitle}
                />
              </Tooltip>
            </Form.Item>
            <strong>year</strong>
            <Form.Item>
              <InputNumber
                value={
                  this.state.searchYear === ""
                    ? 2019
                    : Number(this.state.searchYear)
                }
                disabled={this.state.yearDisabled}
                defaultValue={2019}
                onChange={this.onChangeSearchYear}
              />
              <Checkbox
                checked={!this.state.yearDisabled}
                style={{ padding: "10px" }}
                onChange={this.toggleYear}
              >
                <strong>specify year if film title is not unique</strong>
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                disabled={this.state.searchTitle === "" ? true : false}
                onClick={this.handleSearch}
              >
                search
              </Button>
            </Form.Item>
          </div>
        </Drawer>
      </div>
    );
  }
}
