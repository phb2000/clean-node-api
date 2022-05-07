const jwt = require("jsonwebtoken");

class TokenGenerator {
  async generate(id) {
    return jwt.sign(id, "secret");
  }
}

const makeSut = () => {
  const tokenGen = new TokenGenerator();
  return tokenGen;
};

describe("Token Generator", () => {
  it("Should return null if JWT return null", async () => {
    const sut = makeSut();
    jwt.token = null;
    const token = await sut.generate("any_id");
    expect(token).toBeNull();
  });

  it("Should return token if JWT returns a token", async () => {
    const sut = makeSut();
    const token = await sut.generate("any_id");
    expect(token).toBe(jwt.token);
  });
});