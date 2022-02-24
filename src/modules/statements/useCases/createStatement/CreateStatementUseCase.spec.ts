import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;

describe("Create Statement Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it("should be able to create statement with type to deposit", async () => {
    const user = await usersRepository.create({
      name: "User test",
      password: "test@123",
      email: "test@finAPI.com.br",
    });

    const payload = {
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 100,
      description: "Deposit freela",
    };

    const statementDeposit = await createStatementUseCase.execute(payload);

    expect(statementDeposit).toHaveProperty("id");
    expect(statementDeposit.type).toBe("deposit");
  });

  it("should be able to create statement with type to deposit", async () => {
    const user = await usersRepository.create({
      name: "User test",
      password: "test@123",
      email: "test@finAPI.com.br",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 1000,
      description: "Deposit freela",
    });

    const statementWithdraw = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "withdraw" as OperationType,
      amount: 500,
      description: "basic accounts",
    });

    expect(statementWithdraw).toHaveProperty("id");
    expect(statementWithdraw.type).toBe("withdraw");
  });

  // Testes para exceções
})
