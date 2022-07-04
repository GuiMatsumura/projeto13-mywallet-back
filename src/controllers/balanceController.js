import { db } from "../db/mongo.js";
import joi from "joi";

export async function postEntryBalance(req, res) {
  const entry = req.body;
  const entrySchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
    type: joi.string().required(),
  });
  const { error } = entrySchema.validate(entry);

  if (error) {
    res.status(422).send("Erro ao salvar entrada");
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
    value: entry.value,
    description: entry.description,
    type: entry.type,
    userId: section.userId,
  });

  res.status(201).send("Sucesso ao criar nova entrada");
}
