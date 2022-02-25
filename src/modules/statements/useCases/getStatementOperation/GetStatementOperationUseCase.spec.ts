import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let getStatementOperationUseCase: GetStatementOperationUseCase;
let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;

describe("Get Statement Operation Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  it("should be able get statement operation", async () => {
    const user = await usersRepository.create({
      name: "User test",
      password: "test@123",
      email: "test@finAPI.com.br",
    });

    const statement = await statementsRepository.create({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 250,
      description: "Deposit freela",
    });

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(response.id).toBe(statement.id);
    expect(response.amount).toBe(statement.amount);
    expect(response.description).toBe(statement.description);
  });

  it("should not be able get statement operation with not statement existing", async () => {
    const user = await usersRepository.create({
      name: "User test",
      password: "test@123",
      email: "test@finAPI.com.br",
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "01",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should not be able get statement operation with not user existing", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({ user_id: "01", statement_id: "02" });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
});
