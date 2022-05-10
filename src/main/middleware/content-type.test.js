const request = require("supertest");
const app = require("../config/app");

describe("Content Type", () => {
  it("should return json content type as default", async () => {
    app.get("/test_content_type", (req, res) => {
      res.send({});
    });

    await request(app).get("/test_content_type").expect("content-type", /json/);
  });

  it("should return text content type if forced", async () => {
    app.get("/test_content_type_xml", (req, res) => {
      res.type('xml')
      res.send('');
    });

    await request(app).get("/test_content_type_xml").expect("content-type", /xml/);
  });
});