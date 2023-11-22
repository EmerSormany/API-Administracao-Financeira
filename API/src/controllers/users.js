const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const pool = require("../DB-connection");
const { checkEmailRegistar, checkEmailUpdate } = require('../middleware/authentication');

const newUser = async (req, res) => {
    const {nome, email, senha} = req.body

    const validEmail = await checkEmailRegistar(email)

    if (validEmail) {
        return res.status(400).json({ mensagem: "Email já cadastrado em outra conta" })
    }

    try {
        const cryptPass = await bcrypt.hash(senha,10) 
        const newUser = await pool.query('insert into usuarios (nome, email, senha) values($1, $2, $3) returning *', [nome, email, cryptPass])
        const {senha: _, ...user }= newUser.rows[0]
     
        return res.status(201).json(user)
    
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

const login = async (req, res) => {
    const { senha, email } = req.body

    const validEmail = await checkEmailRegistar(email)

    if (!validEmail) {
        return res.status(400).json({ mensagem: "Credenciais Invalidas" })
    }

    try {
        const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const correctPass = await bcrypt.compare(senha, user.rows[0].senha);

        if (!correctPass) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ id: user.rows[0].id }, process.env.CHAVE_SECRETA, { expiresIn: '2h' });

        const { senha: _, ...usuario } = user.rows[0];

        return res.status(201).json({ usuario, token });

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

const updateUser = async (req, res) => { 
    const {nome, email, senha} = req.body
    const userId = req.user[0].id

    const validEmail = await checkEmailUpdate(email, userId)

    if (validEmail) {
        return res.status(400).json({ mensagem: "Email já cadastrado em outra conta" })
    }

    try {       
        const cryptPass = await bcrypt.hash(senha,10)
        await pool.query('update usuarios set nome = $1, email = $2, senha = $3 where id = $4 returning *', [nome, email, cryptPass, userId]) 

        return res.status(204).json()

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

const userProfile = (req, res) => {
    try {
        const { senha: _, ...userProfile } = req.user[0];
        return res.status(200).json(userProfile)
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

module.exports = {
    newUser,
    login,
    updateUser,
    userProfile
}