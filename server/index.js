import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import router from './src/scripts/routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use('/api', router)

app.use(express.static(path.join(__dirname, '../client')))

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
