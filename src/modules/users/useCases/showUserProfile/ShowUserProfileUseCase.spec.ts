import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("User Profile", () => {
  let showUserProfileUseCase: ShowUserProfileUseCase;
  let usersRepository: IUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("Deve ser possível buscar um usuário pelo id", async () => {
    const user: ICreateUserDTO = {
      email: "user@example.com",
      password: "123456",
      name: "Test User",
    };

    const userSaved = await createUserUseCase.execute(user);

    const userProfile = await showUserProfileUseCase.execute(userSaved.id + "");

    expect(userProfile).toBe(userSaved);
  });
});
