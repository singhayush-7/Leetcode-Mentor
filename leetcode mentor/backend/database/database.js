import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const adapter = new JSONFile("data/db.json");

const db = new Low(adapter, {
    reviews: []
});

await db.read();

db.data ||= {
    reviews: []
};

await db.write();

export default db;