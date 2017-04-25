export default class Field {
  constructor(value = null) {
    this.isOpened = false;
    this.isMarked = false;
    this.value = value;
  }
}