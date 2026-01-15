async function fetchCSV(url) {
  try {
    const response = await fetch(url);
    const csvText = await response.text();

    const result = Papa.parse(csvText, {
      header: true,
      delimiter: ";",
      skipEmptyLines: true,
    });

    async function convertUSDToEUR(amount) {
      if (amount === 0) return 0;
      const resp = await fetch(`https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR`);
      const data = await resp.json();
      return (amount * data.rates.EUR).toFixed(2);
    }

    async function convertYENToEUR(amount) {
      if (amount === 0) return 0;
      const resp = await fetch(`https://api.frankfurter.dev/v1/latest?base=JPY&symbols=EUR`);
      const data = await resp.json();
      return (amount * data.rates.EUR).toFixed(2);
    }

    for (const row of result.data) {
      
      result.data = result.data.filter(row => {
        return !(row.emplacement && row.emplacement.includes("Poubelle"));
      });

      async function cleanAndConvert(price) {
        if (!price || price.toUpperCase() === "NULL") return "0€";
        price = String(price).replace(/\s/g, "");
        let amount;

        if (price.includes("$")) {
          amount = parseFloat(price.replace("$", "")) || 0;
          const euro = await convertUSDToEUR(amount);
          return euro + "€";
        } else if (price.includes("¥") || price.includes("YEN")) {
          amount = parseFloat(price.replace("¥", "")) || 0;
          const yen = await convertYENToEUR(amount);
          return yen + "€";
        } else {
          amount = parseFloat(price.replace("€", "")) || 0;
          return amount.toFixed(2) + "€";
        }
      }

      if (row.prix_achat) {
        row.prix_achat = await cleanAndConvert(row.prix_achat);
      }
      if (row.valeur_estimee) {
        row.valeur_estimee = await cleanAndConvert(row.valeur_estimee);
      }
      if (row.etat) {
        row.etat = row.etat.replace("Mint", "Neuf");
        row.etat = row.etat.replace("Loose", "Sans boîte");
        row.etat = row.etat.replace("Good", "Bon état");
      }

      let str = row.plateforme;
      let majuscules = str.match(/[A-Z]/g) || [];
      if (majuscules.length >= 2 || str.match(/[A-Z]/) && str.match(/[0-9]/)) {
        row.plateforme = row.plateforme.replace(/[a-z]/g, "");
      }
      row.plateforme = row.plateforme.replace(" ", "");

    }

    console.log(result.data);
    document.getElementById("output").innerText = JSON.stringify(result.data, null, 2);

  } catch (error) {
    console.error("Error fetching CSV:", error);
  }
}


fetchCSV("data/stock_legacy_full.csv");
