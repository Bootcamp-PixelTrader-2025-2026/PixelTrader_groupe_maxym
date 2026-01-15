const productsGrid = document.getElementById('user-list');
const productCountEl = document.getElementById('product-count');
const totalValueEl = document.getElementById('total-value');

let produits = [];

function createProductCard(item) {
    const card = document.createElement('div');
    card.classList.add('card_wrapper');

    const glow = document.createElement('div');
    glow.classList.add('card_wrapper__glow');
    card.appendChild(glow);

    const title = document.createElement('p');
    title.textContent = item.titre || 'Titre non disponible';
    card.appendChild(title);

    const state = document.createElement('p');
    state.innerHTML = `<span>État</span><span>${item.etat || 'N/A'}</span>`;
    card.appendChild(state);

    const year = document.createElement('p');
    year.innerHTML = item.annee_sortie == null
        ? `<span>Année</span><span>N/A</span>`
        : `<span>Année</span><span>${item.annee_sortie}</span>`;
    card.appendChild(year);

    const estimatedValue = document.createElement('p');
    estimatedValue.innerHTML = item.valeur_estimee == null
        ? `<span>Valeur estimée</span><span>N/A</span>`
        : `<span>Valeur estimée</span><span>${Math.trunc(item.valeur_estimee)} €</span>`;
    card.appendChild(estimatedValue);

    const purchasePrice = document.createElement('p');
    purchasePrice.innerHTML = `<span>Prix d'achat</span><span>${item.prix_achat} €</span>`;
    card.appendChild(purchasePrice);

    return card;
}

function renderProduits(data) {
    productsGrid.innerHTML = '';

    data.forEach(item => {
        const card = createProductCard(item);
        productsGrid.appendChild(card);
    });

}

async function fetchProduits() {
    try {
        const response = await fetch('/api/produits');
        if (!response.ok) throw new Error('Erreur API');

        const data = await response.json();
        produits = data;
        renderProduits(produits);

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}


document.getElementById('sort-az').addEventListener('click', () => {
    const sorted = [...produits].sort((a, b) =>
        (a.titre || '').localeCompare(b.titre || '')
    );
    renderProduits(sorted);
});

document.getElementById('sort-year').addEventListener('click', () => {
    const sorted = [...produits].sort((a, b) =>
        (b.annee_sortie || 0) - (a.annee_sortie || 0)
    );
    renderProduits(sorted);
});

document.addEventListener('DOMContentLoaded', fetchProduits);
