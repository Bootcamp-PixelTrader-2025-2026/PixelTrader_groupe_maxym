import express from 'express'
import mysql from 'mysql2/promise'

const router = express.Router()

async function getConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'pixel_trader'
    })
}

// Mot de passe admin (simple, à changer pour la production)
const ADMIN_PASSWORD = 'admin123'

// Fonction pour vérifier le mot de passe
function checkPassword(req, res) {
    const password = req.body.password
    if (password !== ADMIN_PASSWORD) {
        res.status(401).json({ success: false, error: 'Mot de passe incorrect' })
        return false
    }
    return true
}

// Route: Obtenir tous les produits
router.get('/produits', async (req, res) => {
    try {
        const connection = await getConnection()
        const [rows] = await connection.execute(
            'SELECT id, titre, etat, annee_sortie, valeur_estimee, prix_achat FROM produits'
        )
        await connection.end()
        res.json(rows)
    } catch {
        res.status(500).json({ error: 'server_error' })
    }
})

// Route: Connexion admin
router.post('/admin/login', (req, res) => {
    const password = req.body.password
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true })
    } else {
        res.status(401).json({ success: false, error: 'Mot de passe incorrect' })
    }
})

// Route: Ajouter un produit
router.post('/admin/produits', async (req, res) => {
    if (!checkPassword(req, res)) return
    
    try {
        const { titre, etat, annee_sortie, valeur_estimee, prix_achat } = req.body
        
        const connection = await getConnection()
        const [result] = await connection.execute(
            'INSERT INTO produits (titre, etat, annee_sortie, valeur_estimee, prix_achat) VALUES (?, ?, ?, ?, ?)',
            [titre, etat, annee_sortie, valeur_estimee, prix_achat]
        )
        await connection.end()
        
        res.json({ success: true, id: result.insertId })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erreur serveur' })
    }
})

// Route: Modifier un produit
router.put('/admin/produits/:id', async (req, res) => {
    if (!checkPassword(req, res)) return
    
    try {
        const id = req.params.id
        const { titre, etat, annee_sortie, valeur_estimee, prix_achat } = req.body
        
        const connection = await getConnection()
        await connection.execute(
            'UPDATE produits SET titre = ?, etat = ?, annee_sortie = ?, valeur_estimee = ?, prix_achat = ? WHERE id = ?',
            [titre, etat, annee_sortie, valeur_estimee, prix_achat, id]
        )
        await connection.end()
        
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erreur serveur' })
    }
})

// Route: Supprimer un produit
router.delete('/admin/produits/:id', async (req, res) => {
    if (!checkPassword(req, res)) return
    
    try {
        const id = req.params.id
        
        const connection = await getConnection()
        await connection.execute('DELETE FROM produits WHERE id = ?', [id])
        await connection.end()
        
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erreur serveur' })
    }
})

export default router
