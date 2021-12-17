import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "../getStatementOperation/GetStatementOperationError";
import { IMakeTransferDTO } from "./IMakeTransferDTO";

enum OperationType {
  TRANSFER = "transfer",
  DEPOSIT = "deposit",
}

@injectable()
export class MakeTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    sender,
    amount,
    description,
    recipient,
  }: IMakeTransferDTO): Promise<void> {
    const user_sender = await this.usersRepository.findById(sender);
    const user_recipient = await this.usersRepository.findById(recipient);

    if (!user_recipient || !user_sender) {
      throw new GetStatementOperationError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender,
    });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }

    await this.statementsRepository.create({
      user_id: sender,
      type: OperationType.TRANSFER,
      amount,
      description,
    });

    await this.statementsRepository.create({
      user_id: recipient,
      type: OperationType.DEPOSIT,
      amount,
      description,
    });
  }
}
