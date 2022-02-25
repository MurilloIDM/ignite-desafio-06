import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Show User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able show user profile", async () => {
    const user = await usersRepository.create({
      name: "User test",
      password: "test@123",
      email: "test@finAPI.com.br",
    });

    const response = await showUserProfileUseCase.execute(user.id as string);

    expect(response.id).toBe(user.id);
    expect(response.name).toBe(user.name);
    expect(response.email).toBe(user.email);
  });

  it("should not be able show user profile with id invalid", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("01");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
