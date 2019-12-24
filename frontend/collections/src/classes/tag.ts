export default class Tag {
  _id: string;
  format: string;

  constructor(_id?: string, format?: string) {
    this._id = _id || "";
    this.format = format || "";
  }
}
