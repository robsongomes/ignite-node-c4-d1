import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

describe("User Profile", () => {
  let usersRepository: IUsersRepository;
  let autheticateUserUseCase: AuthenticateUserUseCase
  let createUserUseCase: CreateUserUseCase;
  let userSaved: User;
  const user: ICreateUserDTO = {
    email: "user@example.com",
    password: "123456",
    name: "Test User",
  };

  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository();
    autheticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository);
    userSaved = await createUserUseCase.execute(user);
  });

  it("Deve ser possível se autenticar com um email e senha corretos", async () => {
    const userLogged = await autheticateUserUseCase.execute({email: user.email, password: user.password})

    expect(userLogged).toHaveProperty('token')
  });

  it("Deve lançar exceção quando o usuário tiver credenciais erradas", async () => {
    expect(async () => await autheticateUserUseCase.execute({email: "invalid@email", password: "123"}))
    .rejects
    .toBeInstanceOf(IncorrectEmailOrPasswordError)
  });
});
