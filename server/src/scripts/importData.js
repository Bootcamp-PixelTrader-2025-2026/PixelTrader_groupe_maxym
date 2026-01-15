import mysql from "mysql2/promise";
import fs from "fs";

export default async function importData() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pixel_trader"
  });

  const data = JSON.parse(
    fs.readFileSync("./stock.json", "utf-8")
  );


  const plateformes = new Set();
  const emplacements = new Set();

  for (const item of data) {
    if (item.plateforme) plateformes.add(item.plateforme);
    if (item.emplacement) emplacements.add(item.emplacement);
  }

  for (const nom of plateformes) {
    await connection.execute(
      "INSERT IGNORE INTO plateformes (nom) VALUES (?)",
      [nom]
    );
  }

  for (const nom of emplacements) {
    await connection.execute(
      "INSERT IGNORE INTO emplacements (nom) VALUES (?)",
      [nom]
    );
  }

for (const item of data) {
    
    const [[plateforme]] = await connection.execute(
      "SELECT id FROM plateformes WHERE nom = ?",
      [item.plateforme]
    );

    const [[emplacement]] = await connection.execute(
      "SELECT id FROM emplacements WHERE nom = ?",
      [item.emplacement]
    );


    await connection.execute(
      `INSERT INTO produits
        (titre, annee_sortie, etat, valeur_estimee, prix_achat, plateforme_id, emplacement_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        item.titre_jeu ?? "Unknown",
        item.annee_sortie && item.annee_sortie !== "" ? item.annee_sortie : null,
        item.etat ?? null,
        item.valeur_estimee ? parseFloat(item.valeur_estimee.replace("€", "")) : null,
        item.prix_achat ? parseFloat(item.prix_achat.replace("€", "")) : null,
        plateforme?.id ?? null,
        emplacement?.id ?? null
      ]
    );
  }

  await connection.end();
}
