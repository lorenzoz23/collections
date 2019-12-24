import React, { Component } from "react";
import {
  Layout,
  Menu,
  Icon,
  Typography,
  notification,
  Tooltip,
  Switch,
  BackTop,
  Empty,
  Avatar,
  Popover
} from "antd";
import MovieCardComponent from "./movie-card.component";
import AddMovieComponent from "./add-movie.component";
import AddDeleteTagComponent from "./add-delete-tag.component";
import Movie from "../classes/movie";
import Tag from "../classes/tag";
import { Redirect } from "react-router";
import axios from "axios";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Title } = Typography;

interface IDashboardComponentState {
  username: String;
  id: String;
  light: boolean;
  menuCollapsed: boolean;
  loggedIn: boolean;
  invalidRoute: boolean;
  movies: Movie[];
  tags: Tag[];
}

export default class DashboardComponent extends Component<
  IDashboardComponentState
> {
  movie: Movie = {
    _id: "",
    title: "",
    poster: "",
    plot: "",
    year: 0,
    rated: "",
    runtime: "",
    director: "",
    tagFormat: [""]
  };
  tag: Tag = {
    _id: "",
    format: ""
  };
  state = {
    username: "",
    id: "",
    light: true,
    menuCollapsed: true,
    loggedIn: true,
    invalidRoute: false,
    movies: [this.movie],
    tags: [this.tag]
  };
  constructor(props: any) {
    super(props);
    this.state = {
      username:
        props.location.state === undefined ? "" : props.location.state.username,
      id: props.location.state === undefined ? "" : props.location.state.id,
      light: true,
      menuCollapsed: true,
      loggedIn: true,
      invalidRoute: false,
      movies: [],
      tags: props.location.state === undefined ? [] : props.location.state.tags
    };
  }

  componentDidMount = async () => {
    if (this.state.username === "" || this.state.id === "") {
      this.setState({
        invalidRoute: true,
        loggedIn: false
      });
      this.openErrorNotification();
    } else {
      let movieResults: Movie[] = (
        await axios.get(
          "http://localhost:5000/users/"
            .concat(this.state.id as string)
            .concat("/movies")
        )
      ).data;
      let tagResults: Tag[] = (
        await axios.get(
          "http://localhost:5000/users/"
            .concat(this.state.id as string)
            .concat("/tags")
        )
      ).data;
      let tmpMovies: Movie[] = movieResults.map(movie => ({
        _id: movie._id,
        title: movie.title,
        poster: movie.poster,
        plot: movie.plot,
        year: movie.year,
        rated: movie.rated,
        runtime: movie.runtime,
        director: movie.director,
        tagFormat: movie.tagFormat
      }));
      let tmpTags: Tag[] = tagResults.map(tag => ({
        _id: tag._id,
        format: tag.format
      }));
      this.setState({
        movies: tmpMovies,
        tags: tmpTags
      });
    }
  };

  logOut = () => {
    this.setState({
      loggedIn: false
    });
  };

  changeTheme = () => {
    this.setState({
      light: !this.state.light
    });
  };

  openErrorNotification = () => {
    notification.open({
      message: "invalid route!",
      description:
        "you must first login with your account information before enjoying this application",
      icon: <Icon type="frown" style={{ color: "#108ee9" }} />
    });
  };

  deleteMovieNotification = (title: string) => {
    notification.open({
      message: "movie deleted!",
      description: "say goodbye to " + title + "...",
      icon: <Icon type="heart" style={{ color: "#108ee9" }} />
    });
  };

  onCollapse = () => {
    this.setState({
      menuCollapsed: !this.state.menuCollapsed
    });
  };

  deleteMovie = async (movie: Movie) => {
    let m: any[] = this.state.movies;
    let result = m.filter(t => t._id !== movie._id);
    await axios.delete(
      "http://localhost:5000/users/"
        .concat(this.state.id)
        .concat("/movies/")
        .concat(movie._id)
    );
    this.setState({
      movies: result
    });
    this.deleteMovieNotification(movie.title);
  };

  getMovieCards = () => {
    let movies: Movie[] = Array.from(this.state.movies);
    let movieComponents: any = [];
    let i = 0;
    movieComponents = movies.map(movie => (
      <MovieCardComponent
        tags={this.state.tags}
        key={i++}
        movie={movie}
        deleteMovie={() => this.deleteMovie(movie)}
      />
    ));
    return movieComponents;
  };

  movieAddedNotification = (title: string) => {
    notification.open({
      message: "movie added!",
      description: "please give a warm welcome to " + title + "!",
      icon: <Icon type="smile" style={{ color: "#108ee9" }} />
    });
  };

  addMovie = (movie: Movie) => {
    let m: Movie[] = this.state.movies;

    m.push(movie);
    this.setState({
      movies: m
    });
    this.movieAddedNotification(movie.title);
  };

  addTag = async (title: string) => {
    const tmpTags = this.state.tags;
    const t = new Tag("", title);
    await axios
      .put(
        "http://localhost:5000/users/"
          .concat(this.state.id)
          .concat("/tags/create"),
        t
      )
      .then(res => {
        t._id = res.data._id;
        tmpTags.push(t);
      })
      .catch(function(err) {
        console.log(err);
        notification.open({
          message: "failure to add tag!",
          description:
            "we were unable to add a newly made tag to your collection.",
          icon: <Icon type="frown" style={{ color: "#108ee9" }} />
        });
      });

    this.setState({
      tags: tmpTags
    });
  };

  deleteTags = async (tagsToDelete: Tag[]) => {
    let tmp: Tag[] = this.state.tags;
    let i: number;
    for (i = 0; i < tagsToDelete.length; i++) {
      const t: Tag = tagsToDelete[i];
      await axios
        .delete(
          "http://localhost:5000/users/"
            .concat(this.state.id)
            .concat("/tags/")
            .concat(t._id)
        )
        .then(() => {
          const idx: number = tmp.indexOf(t);
          tmp.splice(idx, 1);
          notification.open({
            message: "tag deleted!",
            description:
              t.format + " was just removed from your tag collection!",
            icon: <Icon type="check" style={{ color: "#108ee9" }} />
          });
        });
    }

    this.setState({
      tags: tmp
    });
  };

  getSettingsContent = () => {
    let content: any[] = [];
    content.push(
      <div key={0} style={{ padding: "10px", textAlign: "center" }}>
        <Switch
          checked={this.state.loggedIn}
          checkedChildren="signed in"
          unCheckedChildren="bye..."
          onChange={this.logOut}
        />{" "}
        sign out
      </div>
    );
    content.push(
      <div style={{ padding: "10px" }}>
        <AddDeleteTagComponent
          key={1}
          tags={this.state.tags}
          deletedTags={tagsToDelete => this.deleteTags(tagsToDelete)}
          addTag={title => this.addTag(title)}
        />
      </div>
    );
    content.push(
      <div key={2} style={{ padding: "10px", textAlign: "center" }}>
        <Switch
          checkedChildren="dark"
          unCheckedChildren="light"
          onChange={this.changeTheme}
        />{" "}
        change theme
      </div>
    );
    return content;
  };

  render() {
    const movieCards = this.getMovieCards();
    const settingsContent = this.getSettingsContent();
    const userSettings = "user settings - " + this.state.username;

    return (
      <div>
        <Layout className="dashboard" style={{ minHeight: "100vh" }}>
          <Header className="header">
            <Title style={{ color: "white" }}>
              welcome to your{" "}
              <strong style={{ color: "#1088e9" }}> collection </strong>
            </Title>
          </Header>
          <Layout>
            <Sider
              theme={this.state.light ? "dark" : "light"}
              collapsible
              collapsed={this.state.menuCollapsed}
              onCollapse={this.onCollapse}
            >
              <Menu
                style={{ height: "100%", borderRight: 0 }}
                theme={this.state.light ? "light" : "dark"}
                mode="inline"
              >
                <SubMenu
                  key="sub1"
                  title={
                    <Tooltip
                      mouseEnterDelay={0.5}
                      title="filter collection with tags!"
                      placement="bottom"
                    >
                      <span>
                        <Icon type="tags" />
                      </span>
                    </Tooltip>
                  }
                >
                  {this.state.tags.map(tag => (
                    <Menu.Item key={tag!.format}>{tag!.format}</Menu.Item>
                  ))}
                </SubMenu>

                <div
                  key="settings"
                  style={{
                    padding: "10px",
                    textAlign: "center"
                  }}
                >
                  <Popover
                    content={settingsContent}
                    placement="rightTop"
                    title={userSettings}
                  >
                    <Avatar
                      style={{ backgroundColor: "#87d068" }}
                      icon="user"
                    />
                  </Popover>
                </div>
                <div
                  key="add-movie"
                  style={{
                    padding: "10px",
                    textAlign: "center"
                  }}
                >
                  <AddMovieComponent
                    movies={this.state.movies}
                    tags={this.state.tags}
                    addMovie={movie => this.addMovie(movie)}
                    id={this.state.id}
                  />
                </div>
              </Menu>
            </Sider>
            <Layout style={{ padding: "0 24px 24px" }}>
              <div style={{ margin: "16px 0" }} />
              <Content
                style={{
                  background:
                    "linear-gradient(160deg, #9cc8aa, #7bb8a9, #60a7a9, #4e94a7, #4b819f, #516c92)",
                  padding: 25,
                  margin: 0,
                  minHeight: 280
                }}
              >
                {this.state.movies.length === 0 ? (
                  <Empty
                    image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                    description={
                      <>
                        <strong>empty collection?</strong>
                        <br />
                        <strong>add a movie!</strong>
                      </>
                    }
                  >
                    <AddMovieComponent
                      movies={this.state.movies}
                      tags={this.state.tags}
                      addMovie={movie => this.addMovie(movie)}
                      id={this.state.id}
                    />
                  </Empty>
                ) : (
                  <div style={{ padding: 25 }}>{movieCards}</div>
                )}
              </Content>
            </Layout>
          </Layout>
        </Layout>
        <BackTop>
          <div className="ant-back-top-inner">
            <Icon type="arrow-up" />
          </div>
        </BackTop>
        {this.state.invalidRoute || !this.state.loggedIn ? (
          <Redirect to="/" />
        ) : (
          ""
        )}
      </div>
    );
  }
}
