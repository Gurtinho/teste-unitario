import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { AppError } from "../../../../shared/errors/AppError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create an statement", async () => {
    const user = await createUserUseCase.execute({
      name: "Vyctor",
      email: "dev.vyctor@gmail.com",
      password: "123123",
    });

    if (user.id) {
      const depositStatement = await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 12300,
        description: "Deposit",
      });

      const withDrawStatement = await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 12300,
        description: "Withdraw",
      });

      expect(withDrawStatement).toHaveProperty("id");
      expect(withDrawStatement).toHaveProperty("type", "withdraw");

      expect(depositStatement).toHaveProperty("id");
      expect(depositStatement).toHaveProperty("type", "deposit");
    }
  });

  it("should not be able to create a statement to a non-existant user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "non-existant-user",
        type: OperationType.WITHDRAW,
        amount: 12300,
        description: "Withdraw",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to withdraw money if insufficient founds", async () => {
    const user = await createUserUseCase.execute({
      name: "Vyctor",
      email: "dev.vyctor@gmail.com",
      password: "123123",
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 12300,
        description: "Withdraw",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
