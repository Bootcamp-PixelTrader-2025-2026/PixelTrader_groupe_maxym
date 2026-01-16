import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pixel_trader"
});

console.log("Connecté à MySQL !");
export default connection;
