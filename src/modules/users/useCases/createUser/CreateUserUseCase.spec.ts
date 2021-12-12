import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

describe("Criar Usuário", () => {
  let createUserUseCase: CreateUserUseCase;
  let usersRepository: IUsersRepository;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("Deve ser possível criar um usuário", async () => {
    const user: ICreateUserDTO = {
      email: "user@example.com",
      password: "123456",
      name: "Test User",
    };

    const userSaved = await createUserUseCase.execute(user);

    expect(userSaved).toHaveProperty("id");
    expect(userSaved.name).toBe(user.name);
    expect(userSaved.email).toBe(user.email);
    expect(userSaved.password).not.toBe(user.password);
  });

  it("Não Deve ser possível criar dois usuários com mesmo email", async () => {
    const user: ICreateUserDTO = {
      email: "user1@example.com",
      password: "123456",
      name: "Test User",
    };

    await createUserUseCase.execute(user);

    expect(async () => {
      await createUserUseCase.execute({ ...user, email: "outro" });
    }).rejects.toThrow(CreateUserError);
  });
});
