const pool = require("../DB-connection")

const checkEmail = async (email) => {
  try {
    const emailFound = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])
    if (emailFound.rowCount === 0) {
      return false
    }
    return true

  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}


  const datasLogin = (req, res, next) => {
    const { senha, email } = req.body
  
    if ( !senha || !email ) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatorios' })
    }
    next()
  }

  const registerAndUpdateUser = (req, res, next) => {
    const { nome, senha, email } = req.body
  
    if (!nome || !senha || !email) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatorios' })
    }
    next()
  }

  const registerOrUpdateTransaction = (req, res, next) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body
  
    if (!descricao || !valor || !data || !categoria_id || !tipo) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatorios' })
    }
    next()
  }

const validateEmail = (req, res, next) => {
  const {email} = req.body
  try {
  
      let validateAtSign = email.indexOf('@')
      const validatePoint = email.lastIndexOf('.')
      if (validateAtSign == -1 || validateAtSign == 0 || validateAtSign+1 == email.length || email.slice(validateAtSign+1, validateAtSign+2) === '.' 
      || email.includes(' ') || validatePoint == email.length-1 || validatePoint < validateAtSign || email.includes(' ')) {
        return res.status(400).json({ mensagem: "Email informado não atende as requisições" })
      }

      next()
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

  module.exports = {
  checkEmail,
  datasLogin,
  registerAndUpdateUser,
  registerOrUpdateTransaction,
  validateEmail
  }



