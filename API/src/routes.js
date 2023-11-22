const express = require('express')
const routes = express()

const { registerAndUpdateUser, datasLogin, registerOrUpdateTransaction, validateEmail} = require('./middleware/authentication')
const { updateUser, newUser, login, userProfile } = require('./controllers/users')
const { authenticationUser } = require('./middleware/token')
const { registerTransaction, listTransaction, deleteTransaction, detailTransaction, extractTransaction, updateTransaction } = require('./controllers/transactions')
const { list_categories } = require('./controllers/categories')

routes.post('/usuario', registerAndUpdateUser, validateEmail,  newUser) 
routes.post('/login', datasLogin, validateEmail,  login) 

routes.use(authenticationUser) 

routes.put('/usuario',registerAndUpdateUser, validateEmail,  updateUser) 
routes.post('/transacao', registerOrUpdateTransaction, registerTransaction) 
routes.get('/transacao', listTransaction) 
routes.get('/usuario', userProfile) 

routes.get('/categoria', list_categories)

routes.get('/transacao', listTransaction)
routes.get('/transacao/extrato', extractTransaction)
routes.get('/transacao/:id', detailTransaction)
routes.post('/transacao', registerOrUpdateTransaction, registerTransaction)
routes.put('/transacao/:id', registerOrUpdateTransaction, updateTransaction ) 
routes.delete('/transacao/:id', deleteTransaction)


module.exports = routes




