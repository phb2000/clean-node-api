const { MissingParamError } = require("../../utils/errors");
const MongoHelper = require("../helpers/mongo-helper");
const LoadUserByEmailRepository = require("./load-user-by-email-repository");

let userModel;

const makeSut = () => {
  const sut = new LoadUserByEmailRepository();
  return { sut };
};

describe(`LoadUserByEmailRepository`, () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL, null);
    userModel = await MongoHelper.getCollection('users');
  });

  beforeEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test(`should return null if no user is found`, async () => {
    const { sut } = makeSut();
    const user = await sut.load("invalid_mail@mail.com");
    expect(user).toBeNull();
  });

  test(`should return an user if user exists`, async () => {
    const { sut } = makeSut();
    const hashedPassword = "hashed_password";
    const email = "valid_mail@mail.com";
    const fakeUser = await userModel.insertOne({
      email,
      name: "any_name",
      age: 50,
      state: "any",
      password: hashedPassword,
    });
    const user = await sut.load("valid_mail@mail.com");
    expect(user._id).toEqual(fakeUser.insertedId);
    expect(user.email).toEqual(email);
    expect(user.password).toEqual(hashedPassword);
  });

  test(`should throw if no email is provided`, async () => {
    const {sut} = makeSut();
    const promise = sut.load();
    expect(promise).rejects.toThrow(new MissingParamError('email'));
  });
});
