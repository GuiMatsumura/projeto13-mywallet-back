import { db } from "../db/mongo.js";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

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

export async function postSections(req, res) {
  const user = req.body;
  const userSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.required(),
  });
  const { error } = userSchema.validate(user);
  if (error) {
    res.status(422).send("Erro ao entrar");
    return;
  }

  try {
    const findUser = await db
      .collection("users")
      .findOne({ email: user.email });
    if (!findUser) {
      res.status(401).send("Email ou senha incorretos!");
      return;
    }

    const comparePassword = bcrypt.compareSync(
      user.password,
      findUser.password
    );
    if (!comparePassword) {
      res.status(401).send("Email ou senha incorretos!");
      return;
    }

    const token = uuid();
    await db.collection("sections").insertOne({
      token,
      userId: findUser._id,
    });

    res.status(200).send({ token, name: findUser.name });
  } catch (err) {
    res.status(500).send(err);
    return;
  }
}
