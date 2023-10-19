const pool = require("../DB-connection")


const list_categories = async (req, res) => {
    const categories = await pool.query('select * from categorias')
    return res.status(200).json(categories.rows)
}

module.exports = { list_categories }