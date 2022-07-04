import { db } from "../db/mongo.js";
import joi from "joi";

export async function postBalance(req, res) {
  const balance = req.body;
  const balanceSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
    type: joi.string().required(),
    date: joi.required(),
  });
  const { error } = balanceSchema.validate(balance);

  if (error) {
    res.status(422).send("Erro ao salvar saldo!");
    return;
  }

  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  const section = await db.collection("sections").findOne({ token });
  if (!section) {
    res.sendStatus(401);
    return;
  }
  await db.collection("balance").insertOne({
    value: balance.value,
    description: balance.description,
    type: balance.type,
    date: balance.date,
    userId: section.userId,
  });

  res.status(201).send("Sucesso ao criar novo saldo!");
}

export async function getBalance(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  const section = await db.collection("sections").findOne({ token });
  if (!section) {
    res.sendStatus(401);
    return;
  }
  const transactions = await db
    .collection("balance")
    .find({ userId: section.userId })
    .toArray();
  res.status(200).send(transactions);
}
