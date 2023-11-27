const pool = require("../DB-connection")
const jwt = require('jsonwebtoken')

const authenticationUser = async (req, res, next) => {
    const {authorization} = req.headers

    if (!authorization) {
        return res.status(401).json({mensagem: 'Não autorizado'})
    }

    const token = authorization.split(' ')[1]

    try {
        const {id} = jwt.verify(token, process.env.CHAVE_SECRETA)

        const {rows , rowCount} = await pool.query('select * from usuarios where id = $1' , [id])

        if (rowCount < 1) {
            return res.status(401).json({mensagem: 'Não autorizado'})
        }
    
        req.user = rows 
    
        next()
    } catch (error) {
        return res.status(500).json({messagem: "Erro interno do servidor"})
    }
}

module.exports = {authenticationUser}