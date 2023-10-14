const PORT = process.env.PORT ?? 8001 // PORT deixa a porta secreta caso nao exista a variavel porta usado 8001
const express = require('express')
const cors = require('cors')
const app = express()
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { v4: uuidv4 } = require('uuid')

require('dotenv').config();

app.use(cors())
app.use(express.json());


// get all todos

app.get('/', (req, res) => {
    res.send('Hello, World!'); // Send a simple response for the root URL
});

app.get('/todos/:userEmail', async (req, res) => {
    const { userEmail } = req.params //se ha mais de um parametro salvar em {}

    try {
        const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail])
        res.json(todos.rows)
    } catch (err) {
    }
})

// create new todo

app.post("/todos", async (req, res) => {
    const { user_email, title, progress, date } = req.body //id gerado por biblioteca nativa
    const id = uuidv4()
    console.log(user_email, title, progress, date)
    try {
        const newTodo = await pool.query(`INSERT INTO todos(id, user_email, title, progress, date) 
        VALUES($1, $2, $3, $4, $5)`, [id, user_email, title, progress, date])
        res.json(newTodo) //mandando resposta pro front
    } catch (err) {
        console.log(err)
    }
})


// edit to do

app.put("/todos/:id", async (req, res) => {
    const { id } = req.params
    const { user_email, title, progress, date } = req.body
    try {
        const editTodo = await pool.query('UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5', [user_email, title, progress, date, id])
        res.json(editTodo)
    } catch (err) {
        console.error(err)
    }
})

// delete a todo
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        deleteTodo = await pool.query('DELETE FROM todos WHERE id = $1', [id])
        res.json(deleteTodo)
    } catch (err) {
        console.error(err)
    }
})

// signup
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    try {
        const signUP = await pool.query('INSERT INTO users (email, hashed_password) VALUES ($1, $2)',
            [email, hashedPassword])

        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })

        res.json({ email, token })

    } catch (err) {
        console.error(err)
        if (err) {
            console.log(err.detail)
            res.json({ detail: err.detail })
        }
    }
})

// login
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])

        //pega a resposta e verifica
        if (!users.rows.length) return res.json({ detail: 'User doest not exist' }) //if use does not exist

        const sucess = await bcrypt.compare(password, users.rows[0].hashed_password) //comparando senha salva criptografada 
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })

        if (sucess) {
            res.json({ 'email': users.rows[0].email, token })
        } else {
            res.json({ detail: "Login failed" })
        }
    } catch (err) {
        console.log(err)
    }
})


app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`))

