import joi from "joi";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db = null;
const client = new MongoClient(process.env.MONGO_URI);

client.connect().then(() => {
  db = client.db(process.env.MONGO_DB);
});

export async function postUsers(req, res) {
  const user = req.body;
  const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.required(),
    confirmPassword: joi.ref("password"),
  });
  const { error } = userSchema.validate(user);

  if (error) {
    res.status(422).send("Erro ao cadastrar");
    return;
  }

  const passwordHash = bcrypt.hashSync(user.password, 10);

  try {
    const exist = await db.collection("users").findOne({ email: user.email });
    if (exist) {
      res.status(409).send();
      return;
    }
    await db.collection("users").insertOne({
      name: user.name,
      email: user.email,
      password: passwordHash,
    });
    res.status(201).send("Conta cadastrada com sucesso!");
  } catch (err) {
    res.status(500).send(err);
    return;
  }
}
