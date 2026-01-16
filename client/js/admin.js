let isLoggedIn = false;
let currentPassword = '';
let produits = [];

// Admin login
async function login() {
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            isLoggedIn = true;
            currentPassword = password;
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('adminPanel').classList.add('active');
            loadProduits();
        } else {
            errorDiv.textContent = 'Mot de passe incorrect';
        }
    } catch (error) {
        errorDiv.textContent = 'Erreur de connexion';
    }
}

function logout() {
    isLoggedIn = false;
    currentPassword = '';
    window.location.href = './index.html';
}

// Load products from API
async function loadProduits() {
    try {
        const response = await fetch('/api/produits');
        const data = await response.json();
        produits = data;
        displayProduits();
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
    }
}


// Display products list
function displayProduits() {
    const listDiv = document.getElementById('productsList');
    listDiv.innerHTML = '';
    
    produits.forEach(produit => {
        const item = document.createElement('div');
        item.className = 'product-item';
        
        item.innerHTML = `
            <div class="product-info">
                <strong>${produit.titre || 'Sans titre'}</strong> - 
                État: ${produit.etat || 'N/A'} - 
                Année: ${produit.annee_sortie || 'N/A'} - 
                Prix: ${produit.prix_achat} €
            </div>
            <div class="product-actions">
                <button onclick="editProduct(${produit.id})">Modifier</button>
                <button class="btn-danger" onclick="deleteProduct(${produit.id})">Supprimer</button>
            </div>
        `;
        
        listDiv.appendChild(item);
    });
}

// Load product data into form for editing
function editProduct(id) {
    const produit = produits.find(p => p.id === id);
    if (!produit) return;
    
    document.getElementById('productId').value = produit.id;
    document.getElementById('titre').value = produit.titre || '';
    document.getElementById('etat').value = produit.etat || '';
    document.getElementById('annee_sortie').value = produit.annee_sortie || '';
    document.getElementById('valeur_estimee').value = produit.valeur_estimee || '';
    document.getElementById('prix_achat').value = produit.prix_achat || '';
    
    document.getElementById('formTitle').textContent = 'Modifier le produit';
    document.getElementById('productForm').scrollIntoView();
}

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('formTitle').textContent = 'Ajouter un produit';
    document.getElementById('message').textContent = '';
}

// Create or update product
async function saveProduct(event) {
    event.preventDefault();
    
    if (!isLoggedIn) {
        alert('Vous devez être connecté');
        return;
    }
    
    const id = document.getElementById('productId').value;
    const productData = {
        password: currentPassword,
        titre: document.getElementById('titre').value,
        etat: document.getElementById('etat').value,
        annee_sortie: document.getElementById('annee_sortie').value || null,
        valeur_estimee: document.getElementById('valeur_estimee').value || null,
        prix_achat: document.getElementById('prix_achat').value
    };
    
    const messageDiv = document.getElementById('message');
    
    try {
        let response;
        if (id) {
            response = await fetch(`/api/admin/produits/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
            response = await fetch('/api/admin/produits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }
        
        const data = await response.json();
        
        if (data.success) {
            messageDiv.textContent = id ? 'Produit modifié avec succès!' : 'Produit ajouté avec succès!';
            messageDiv.className = 'success';
            resetForm();
            loadProduits();
        } else {
            messageDiv.textContent = data.error || 'Erreur lors de l\'enregistrement';
            messageDiv.className = 'error';
        }
    } catch (error) {
        messageDiv.textContent = 'Erreur de connexion au serveur';
        messageDiv.className = 'error';
    }
}


// Delete product
async function deleteProduct(id) {
    if (!isLoggedIn) {
        alert('Vous devez être connecté');
        return;
    }
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/produits/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: currentPassword })
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadProduits();
            document.getElementById('message').textContent = 'Produit supprimé avec succès!';
            document.getElementById('message').className = 'success';
        } else {
            alert(data.error || 'Erreur lors de la suppression');
        }
    } catch (error) {
        alert('Erreur de connexion au serveur');
    }
}
