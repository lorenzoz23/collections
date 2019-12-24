export default class Movie {
  _id: string;
  title: string;
  poster: string;
  plot: string;
  year: number;
  rated: string;
  runtime: string;
  director: string;
  tagFormat: string[];

  constructor(
    _id?: string,
    title?: string,
    poster?: string,
    plot?: string,
    year?: number,
    rated?: string,
    runtime?: string,
    director?: string,
    tagFormat?: string[]
  ) {
    this._id = _id || "";
    this.title = title || "";
    this.poster = poster || "";
    this.plot = plot || "";
    this.year = year || 0;
    this.rated = rated || "";
    this.runtime = runtime || "";
    this.director = director || "";
    this.tagFormat = tagFormat || [""];
  }
}
