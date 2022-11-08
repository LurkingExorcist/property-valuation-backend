export class MockResponse {
  statusCode: number;
  body: object;

  status(statusCode: number) {
    this.statusCode = statusCode;
    return this;
  }
  json(body: object) {
    this.body = body;
    return this;
  }
}
