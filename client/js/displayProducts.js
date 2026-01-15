const view = document.getElementById('user-list')

async function fetchProduits() {
    const response = await fetch('/api/produits')
    const data = await response.json()

    data.forEach(item => {

        let card = document.createElement('div')

        let titre = document.createElement('p')
        titre.innerText = item.titre
        
        let etat = document.createElement('p')
        etat.innerText = item.etat

        card.appendChild(titre)
        card.appendChild(etat)
        view.appendChild(card)
    });
}

fetchProduits()
