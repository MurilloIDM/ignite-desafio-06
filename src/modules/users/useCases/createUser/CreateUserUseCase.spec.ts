import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Create User Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create user", async () => {
    const payload = {
      name: "User test",
      password: "test@123",
      email: "test@finAPI.com.br",
    };

    const user = await createUserUseCase.execute(payload);

    expect(user).toHaveProperty("id");
    expect(user.name).toBe(payload.name);
    expect(user.email).toBe(payload.email);
  });

  it("should not be able to create user with email existing", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User test",
        password: "test@123",
        email: "test@finAPI.com.br",
      });

      await createUserUseCase.execute({
        name: "User test 2",
        password: "test@1234",
        email: "test@finAPI.com.br",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
