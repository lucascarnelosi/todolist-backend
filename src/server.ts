import express from 'express'
import cors from 'cors'
import routes from './routes/index.ts'
import cookieParser from 'cookie-parser'

const app = express()

app.use(
  cors({
    origin: 'https://todolist-lucas.vercel.app',
    credentials: true
  })
)
app.use(express.json())
app.use(routes)
app.use(cookieParser())

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})

export default app