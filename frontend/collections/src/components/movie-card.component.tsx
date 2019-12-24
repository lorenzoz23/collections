import React, { Component } from "react";
import { Card, Row, Col, Tag } from "antd";
import MovieDetailsComponent from "./movie-details.component";
import Movie from "../classes/movie";
import TagClass from "../classes/tag";

const { Meta } = Card;

interface IMovieCardComponentProps {
  movie: Movie;
  tags: TagClass[];
  deleteMovie: () => void;
}

export default class MovieCardComponent extends Component<
  IMovieCardComponentProps
> {
  getTags = () => {
    let i: number = 0;
    let tags = [];
    const colors = ["green", "blue", "red", "purple", "cyan"];
    const { movie } = this.props;
    for (i = 0; i < movie.tagFormat.length; i++) {
      const rand = Math.floor(Math.random() * colors.length);
      tags.push(
        <Tag key={i} color={colors[rand]}>
          {movie.tagFormat[i]}
        </Tag>
      );
    }

    return tags;
  };

  render() {
    const tags = this.getTags();
    const { movie } = this.props;
    return (
      <div>
        <Row
          type="flex"
          justify="space-around"
          align="middle"
          style={{ paddingBottom: 50 }}
        >
          <Col span={4}>
            <Card
              style={{ width: 275, padding: 10 }}
              cover={
                <img alt={movie.title as string} src={movie.poster as string} />
              }
              actions={[
                <MovieDetailsComponent
                  tags={this.props.tags}
                  movie={this.props.movie}
                  deleteMovie={this.props.deleteMovie}
                />
              ]}
            >
              <div
                style={{
                  padding: 10,
                  display: "inline-block"
                }}
              >
                {tags.length === 0 ? "" : tags}
              </div>
              <Meta
                style={{ textAlign: "center" }}
                title={movie.title}
                description={"directed by: " + movie.director}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
