import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("should be able to authenticate user", async () => {
    const user = await createUserUseCase.execute({
      name: "User test",
      password: "test@123",
      email: "test@finAPI.com.br",
    });

    const response = await authenticateUserUseCase.execute({
      email: "test@finAPI.com.br",
      password: "test@123",
    });

    expect(response).toHaveProperty("token");
    expect(response.user.id).toBe(user.id);
  });

  it("should not be able to authenticate user with email invalid", async () => {
    const user = await createUserUseCase.execute({
      name: "User test",
      password: "test@123",
      email: "test@finAPI.com.br",
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test123@finAPI.com.br",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate user with password invalid", async () => {
    const user = await createUserUseCase.execute({
      name: "User test",
      password: "test@123",
      email: "test@finAPI.com.br",
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "test@1234",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
