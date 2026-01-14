
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pixel_trader"
});

console.log("Connecté à la base MySQL !");

const [rows] = await connection.execute("INSERT * INTO produits");
console.log(rows);

await connection.end();
