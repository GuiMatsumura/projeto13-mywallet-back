import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let db = null;
const client = new MongoClient(process.env.MONGO_URI);

client.connect().then(() => {
  db = client.db(process.env.MONGO_DB);
});

const objectId = ObjectId;

export { db, objectId };
