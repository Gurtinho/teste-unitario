import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create an user", async () => {
    const user = await createUserUseCase.execute({
      name: "Vyctor",
      email: "dev.vyctor@gmail.com",
      password: "123123",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to register two users with same e-mail", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Vyctor",
        email: "dev.vyctor@gmail.com",
        password: "123123",
      });

      await createUserUseCase.execute({
        name: "Vyctor",
        email: "dev.vyctor@gmail.com",
        password: "123123",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
