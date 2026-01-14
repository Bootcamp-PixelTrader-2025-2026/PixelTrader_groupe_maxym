import mysql from "mysql2/promise";
import importData from "./src/scripts/importData.js";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pixel_trader"
});

console.log("Connected to MySQL");

await importData(connection);

await connection.end();
console.log("Connection closed");