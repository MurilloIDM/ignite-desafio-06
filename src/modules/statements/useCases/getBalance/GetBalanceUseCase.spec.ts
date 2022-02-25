import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let getBalanceUseCase: GetBalanceUseCase;
let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;

describe("Get Balance Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
  });


  it("should be able get balance final", async () => {
    const user = await usersRepository.create({
      name: "User test",
      password: "test@123",
      email: "test@finAPI.com.br",
    });

    await statementsRepository.create({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 1000,
      description: "Deposit freela",
    });

    await statementsRepository.create({
      user_id: user.id as string,
      type: "withdraw" as OperationType,
      amount: 500,
      description: "basic accounts",
    });

    const response = await getBalanceUseCase.execute({ user_id: user.id as string });

    expect(response.balance).toBe(500);
    expect(response.statement).toHaveLength(2);
  });

  it("should not be able get balance final with not user existing", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "01" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
