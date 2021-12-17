import { Request, Response } from "express";
import { container } from "tsyringe";
import { MakeTransferUseCase } from "./MakeTransferUseCase";

export class MakeTransferController {
  async execute(request: Request, response: Response) {
    const { id: sender } = request.user;
    const { user_id: recipient } = request.params;
    const { amount, description } = request.body;

    const transfer = container.resolve(MakeTransferUseCase);

    const statement = await transfer.execute({
      sender,
      recipient,
      amount,
      description,
    });

    return response.status(201).json(statement);
  }
}
