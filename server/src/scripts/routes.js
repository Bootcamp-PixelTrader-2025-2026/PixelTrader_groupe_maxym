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

router.get('/produits', async (req, res) => {
    try {
        const connection = await getConnection()
        const [rows] = await connection.execute(
            'SELECT id, titre, etat FROM produits'
        )
        await connection.end()
        res.json(rows)
    } catch {
        res.status(500).json({ error: 'server_error' })
    }
})

export default router
