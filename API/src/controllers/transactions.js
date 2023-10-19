
const pool = require("../DB-connection")

const registerTransaction = async (req, res) => {
  const { tipo, descricao, valor, data, categoria_id } = req.body
  const userId = req.user[0].id

  if (tipo != 'saida' && tipo != 'entrada') {
    return res.status(400).json({ mensagem: 'tipo de transacao inválida' })
  }

  if (categoria_id > 17 || categoria_id < 1) {
    return res.status(400).json({ message: 'categoria inválida' })
  }

  try {
    const query =
      'insert into transacoes (tipo, descricao, valor, data, categoria_id, usuario_id) values ($1, $2, $3, $4, $5, $6) returning *'
    const params = [tipo, descricao, valor, data, categoria_id, userId]
    const result = await pool.query(query, params)

    return res.status(201).json(result.rows[0])
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const deleteTransaction = async (req, res) => {
  const userId = req.user[0].id
  const { id } = req.params

  try {
    const query = 'DELETE FROM transacoes WHERE id = $1 and usuario_id = $2'
    const params = [id, userId]
    const result = await pool.query(query, params)
    if(result.rowCount < 1){
      return res.status(404).json({ menssagem: 'Transação não encontrada'})
    }

    return res.status(204).json()
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}


const detailTransaction = async (req, res) => {
  const userId = req.user[0].id
  const {id} = req.params
  try {
    const query = `Select transacoes.id, transacoes.descricao, transacoes.valor, transacoes.data, transacoes.categoria_id,
    transacoes.usuario_id, transacoes.tipo, categorias.descricao as categoria_nome from transacoes
    inner join categorias on transacoes.categoria_id = categorias.id where 
    transacoes.usuario_id = $1 and transacoes.id = $2`
    const params = [userId, id ]
    const result = await pool.query(query, params)
    if(result.rowCount < 1){
      return res.status(404).json({ menssagem: 'Transação não encontrada'})
    }
    return res.status(200).json(result.rows[0])
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
};

const listTransaction = async (req, res) => {
  const userId = req.user[0].id
  const {filtro} = req.query
  try {    
    if (filtro) {
      const result = []
        for (const categoria of filtro) {
          const query = `Select transacoes.id, transacoes.descricao, transacoes.valor, transacoes.data, transacoes.categoria_id,
          transacoes.usuario_id, transacoes.tipo, categorias.descricao as categoria_nome from transacoes
          inner join categorias on transacoes.categoria_id = categorias.id where 
          transacoes.usuario_id = $1 and categorias.descricao ilike $2`
          const params = [userId, categoria]
          const consulta = (await pool.query(query, params)).rows
          for (const item of consulta) {
            if (item) {
              result.push(item)              
            }
          }
        }  
        return res.status(200).json(result) 
    }
    const query = `Select transacoes.id, transacoes.descricao, transacoes.valor, transacoes.data, transacoes.categoria_id,
    transacoes.usuario_id, transacoes.tipo, categorias.descricao as categoria_nome
    from transacoes inner join categorias on transacoes.categoria_id = categorias.id where 
    transacoes.usuario_id = $1`
    const params = [userId]
    const result = await pool.query(query, params)
    return res.status(200).json(result.rows)    
  } catch (error) {
      return res.status(500).json({ error: error.message })
  }
};

const extractTransaction = async (req, res) => {
  const userId = req.user[0].id
  const saida = []
  const entrada = []
  let somaSaida = 0
  let somaEntrada = 0
  try {
      const query = 'select valor, tipo FROM transacoes WHERE usuario_id = $1'
      const params = [userId]
      const result = await pool.query(query, params)

      for(let item = 0; item < result.rows.length; item++){
        if(result.rows[item].tipo === 'saida'){
          saida.push(result.rows[item])
        }
      }
      for(let item = 0; item < result.rows.length; item++){
        if(result.rows[item].tipo === 'entrada'){
          entrada.push(result.rows[item])
        }
      }

      for(item of entrada){
        somaEntrada += item.valor
      }
      for(item of saida){
        somaSaida += item.valor
      }

      return res.status(200).json({entrada: somaEntrada, saida: somaSaida})
     
  } catch (error) {
      return res.status(500).json({ error: error.message })
  }
};

const updateTransaction = async (req, res) => {
  const userId = req.user[0].id;
  const {id} = req.params
  const {descricao, valor, data, categoria_id, tipo} = req.body


  if (tipo != 'saida' && tipo != 'entrada') {
    return res.status(400).json({ mensagem: 'tipo de transacao inválida' });
  }

  if (categoria_id > 17 || categoria_id < 1) {
    return res.status(400).json({ message: 'categoria inválida' });
  }


  try {
    const query = 'update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6 and usuario_id = $7'
    const params = [descricao, valor, data, categoria_id, tipo, id, userId]
    const result = await pool.query(query, params)

    if (result.rowCount < 1) {
      return res.status(404).json({mensage: 'Transacao não encontrada'})
    }

    return res.status(204).json()
    
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

module.exports = {
  registerTransaction,
  listTransaction,
  deleteTransaction,
  detailTransaction,
  extractTransaction,
  updateTransaction
}