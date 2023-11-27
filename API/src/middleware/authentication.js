const pool = require("../DB-connection")

const checkEmailRegistar = async (email) => {
  try {
    const emailFound = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])
    if (emailFound.rowCount >= 1) {
      return emailFound.rows[0]
    }
    return false
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" })
  }
}

const checkEmailUpdate = async (email, id) => {
  try {
    const emailFound = await pool.query('SELECT * FROM usuarios WHERE email = $1 and $2 != id', [email, id])
    if (emailFound.rowCount >= 1 ) {
      return true
    }
    return false
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" })
  }
}

const datasLogin = (req, res, next) => {
    const { senha, email } = req.body
  
    if (!email) {
      return res.status(400).json({ mensagem: 'Campo email é obrigatório' })
    }
    if (!senha) {
      return res.status(400).json({ mensagem: 'Campo senha é obrigatório' })
    }
    next()
}

const registerAndUpdateUser = (req, res, next) => {
    const { nome, senha, email } = req.body
  
    if (!nome) {
      return res.status(400).json({ mensagem: 'Campo nome é obrigatório' })
    }
    if (!email) {
      return res.status(400).json({ mensagem: 'Campo email é obrigatório' })
    }
    if (!senha) {
      return res.status(400).json({ mensagem: 'Campo senha é obrigatório' })
    }
    next()
}

const registerOrUpdateTransaction = (req, res, next) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body
  
    if (!descricao) {
      return res.status(400).json({ mensagem: 'Campo descrição é obrigatório' })
    }
    if (!valor) {
      return res.status(400).json({ mensagem: 'Campo valor é obrigatório' })
    }
    if (!data) {
      return res.status(400).json({ mensagem: 'Campo data é obrigatório' })
    }
    if (!categoria_id) {
      return res.status(400).json({ mensagem: 'Campo categoria_id é obrigatório' })
    }
    if (!tipo) {
      return res.status(400).json({ mensagem: 'Campo tipo é obrigatório' })
    }
    next()
}

const validateEmail = (req, res, next) => {
  const {email} = req.body
    let validateAtSign = email.indexOf('@')
    const validatePoint = email.lastIndexOf('.')
    if (validateAtSign == -1 || validateAtSign == 0 || validateAtSign+1 == email.length || email.slice(validateAtSign+1, validateAtSign+2) === '.' 
    || email.includes(' ') || validatePoint == email.length-1 || validatePoint < validateAtSign || email.includes(' ')) {
      return res.status(400).json({ mensagem: "Email inválido" })
    }
    next()
}

module.exports = {
  checkEmailUpdate,
  checkEmailRegistar,
  datasLogin,
  registerAndUpdateUser,
  registerOrUpdateTransaction,
  validateEmail
}



