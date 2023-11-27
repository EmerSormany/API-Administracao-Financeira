# API-Administracao-Financeira

Olá, visitante. Que bom ter você aqui. Esta é a RESTful API desenvolvida por mim e por [Érico](https://github.com/dERICOd) no curso de backend da curso academy. O sistema foi desenvolvido para dar ao usuário uma forma fácil de registrar seus gastos e suas receitas.

### Ela tem as funcionalidades de:

 * Cadastrar Usuário;
 * Fazer Login;
 * Detalhar Perfil do Usuário Logado;
 * Editar Perfil do Usuário Logado;
 * Listar categorias;
 * Listar transações;
 * Detalhar transação;
 * Cadastrar transação;
 * Editar transação;
 * Remover transação;
 * Obter extrato de transações.

### Tecnologias utilizadas no projeto:

 * Linguagem Javascript;
 * Node.js;
 * Express.js para criar o servidor;
 * bcrypt;
 * dotenv;
 * jsonwebtoken;
 * pg.

### Como baixar e rodas o projeto:

 1. Para baixar e utilizar, você precisará ter em sua máquina o [Node.js](https://nodejs.org/en) e algum programa como o [Insomnia](https://insomnia.rest/download) para testar todas as requisições.
 2. Você precisará criar o banco de dados local na sua máquina e criar as tabelas com as querys disponíveis no arquivo *dump.sql*.
 3. Você precisará clonar este repositório utilizando o comando: `git clone git@github.com:EmerSormany/Api-Sistema-Bancario.git`.
 4. Após baixados os arquivos, você deverá abrir o terminal no diretório *Api-Administracao-Financeira* e digitar o comando `npm install` para instalar as dependências do projeto.
 5. Você precisará criar o arquivo *.env* e colocar suas variáveis de ambiente seguindo o modelo do arquivo *.env_example*.
 6. Após configurado o banco de dados, as variáveeis de ambiente e instaladas as bibliotecas, ainda no diretório *Api-Administracao-Financeira*, você deverá digitar o comando `npm run dev` no terminal ou abrir o terminal na pasta *SRC* e digitar o comando `node index.js`.

# Endpoints
### Cadastrar Usuário

A requisição deve conter no corpo do objeto 3 propriedades respeitando exatamente os seguintes nomes: *nome, email e senha*.

Em caso de falha do nome, email ou senha não preenchidos, o endpoint irá retornar status code 400 e um objeto contendo uma mensagem indicando qual campo permanece vazio no corpo da resposta.

Para o email, o endpoint verificará se está dentro dos padrões, por meio de lógica implementada com o middleware validateEmail. Retornará status code 400 e um objeto contendo uma mensagem de "Email inválido" no corpo da resposta ou permitirá a passagem para o próximo passo.

Em caso de sucesso, o endpoint irá criar um hash utilizando a biblioteca bcrypt. Em seguida, registrará na tabela de usuários os dados do usuário com a senha criptografada. O retorno será status code 201 e um objeto contendo os dados do usuário cadastrado, exceto a senha.

### Login

A requisição deve conter no corpo do objeto 2 propriedades respeitando exatamente os seguintes nomes: email e senha.

O endpoint irá verificar se os campos estão preenchidos e retornará status code 400 com uma mensagem indicando qual campo está vazio no corpo da resposta, caso algum não seja preenchido.

Em seguida, o endpoint verificará se existe usuário para o email enviado. Caso não encontre o email, retornará status code 400 com um objeto contendo a mensagem de credenciais inválidas no corpo da resposta.

Posteriormente, ele utilizará o método compare da biblioteca bcrypt para comparar se o hash gerado é o mesmo cadastrado no banco. Caso não seja, retornará status code 400 com um objeto contendo a mensagem de credenciais inválidas no corpo da resposta.

Em caso de sucesso em todas as validações, o endpoint irá gerar o token com o método sign da biblioteca jsonwebtoken. Retornará status code 201 com um objeto contendo 2 propriedades: os dados do usuário logado, excluindo a senha; e o token gerado, válido por 2 horas. Após esse período, o usuário precisará realizar um novo login.

### ---------------<>-------------

Apenas os endpoints de Cadastrar Usuário e Login são acessados sem a propriedade Bearer Token no cabeçalho da requisição; os demais precisarão do token gerado no endpoint de login.

Caso não seja enviado o token, os endpoints retornarão status code 401 com uma mensagem de não autorizado no corpo da resposta.

Em caso de token incorreto, os endpoints retornarão status code 500 com uma mensagem de erro interno do servidor no corpo da resposta.

### ---------------<>-------------
### Detalhar Usuário

A requisição precisa apenas conter o Bearer Token no cabeçalho.

Em caso de sucesso na requisição, o endpoint irá retornar status code 200 e os dados do usuário logado, exceto o hash da senha, no corpo da resposta.

### Atualizar Usuário

É necessário enviar o Bearer Token no cabeçalho da requisição.

A requisição deve conter no corpo do objeto 3 propriedades respeitando exatamente os seguintes nomes: nome, email e senha.

Em caso de falha no preenchimento do nome, email ou senha, o endpoint irá retornar status code 400 com um objeto contendo uma mensagem indicando qual campo permanece vazio no corpo da resposta.

Para o email, o endpoint verificará se está dentro dos padrões utilizando a lógica implementada no middleware validateEmail. Retornará status code 400 com um objeto contendo uma mensagem de email inválido no corpo da resposta ou seguirá para o próximo passo.

Também verificará se o email já está cadastrado em outra conta. Caso o encontre, retornará status code 400 com uma mensagem de email já cadastrado no corpo da resposta ou seguirá para o próximo passo.

Em caso de sucesso em todas as validações, o endpoint criará um novo hash com a biblioteca bcrypt utilizando a nova senha fornecida. Em seguida, atualizará os dados do usuário logado na tabela de usuários, não retornando nada no corpo da resposta, apenas o código de sucesso 204.

### Listar Categorias

A requisição precisa apenas conter o Bearer Token no header.

Em caso de sucesso na requisição, o endpoint retornará status code 200 e um array de objetos, no qual cada objeto conterá o ID e a descrição da categoria no corpo da resposta.

### Listar Transações

A requisição precisa apenas conter o Bearer Token no header.

O endpoint irá retornar status code 200 e, no corpo da resposta, um array com as transações, sendo cada uma um objeto contendo as propriedades de id, descricao, valor, data, categoria_id, usuario_id, tipo, categoria_nome.

As transações somente serão exibidas se estiverem associadas ao usuário logado, caso não haja nenhuma transação associada ao id do usuário logado, não será exibida nenhuma transação, apenas status code 200 e array vazio no corpo da resposta.

É possível incluir um parâmetro de rota do tipo query com nome e "filtro". O parâmetro é um array e será utilizado para filtrar as transações pela coluna descricao, que será retornado dentro do objeto como "categoria_nome". O filtro pode ser utilizado caso o usuário queira saber quais as transações ele tem com a categoria informada

### Detalhar uma Transação

A requisição precisa conter o Bearer Token no cabeçalho e, no parâmetro de rota do endpoint, o ID da transação. Exemplo: http://localhost:3000/transacao/7.

O usuário conseguirá acessar apenas as transações associadas ao seu ID. Se tentar acessar uma transação associada ao ID de outro usuário ou que não exista no banco de dados, o endpoint retornará o status code 404 e um objeto no corpo da resposta contendo a mensagem de "transação não encontrada".

Em caso de sucesso, a resposta será o status code 200 e um objeto no corpo contendo as propriedades de ID, descricao, valor, data, categoria_id, usuario_id, tipo e categoria_nome.

### Cadastrar Transação

A requisição precisa conter o Bearer Token no cabeçalho e, no corpo, um objeto contendo as propriedades: descricão, valor, data, categoria_id e tipo.

Caso alguma propriedade não seja preenchida, o endpoint retornará o status code 400 e um objeto no corpo contendo a mensagem indicando qual propriedade não está sendo preenchida.

A propriedade tipo deve ter o valor de "saida" ou "entrada". No sistema, ela indica se a transação é um valor acrescido ou subtraído do total da conta. Se for enviada uma requisição com um valor diferente para a propriedade tipo, o endpoint retornará o status code 400 e um objeto no corpo contendo a mensagem "Tipo de transação inválido".

A propriedade categoria_id indica a categoria à qual a transação pertence. Portanto, deve ter um valor numérico entre 1 e 17, que correspondem às categorias cadastradas. Se a requisição for enviada com um valor diferente, o endpoint retornará o status code 400 e um objeto no corpo da resposta contendo a mensagem "Categoria inválida".

Em caso de sucesso em todas as validações, o endpoint retornará o status code 201 e um objeto no corpo da resposta contendo as propriedades: id, descricão, valor, data, categoria_id, usuario_id, tipo e categoria_nome.


### Atualizar Transação

A requisição precisa conter o Bearer Token no cabeçalho e o ID da transação no parâmetro de rota, por exemplo: http://localhost:3000/transacao/19. Além disso, o corpo da requisição deve conter as propriedades descricão, valor, data, categoria_id e tipo.

Se não for enviado um ID no parâmetro de rota, será retornado o status code 404 com a mensagem padrão HTTP: "Cannot PUT /transacao".

Se o ID da transação enviado no parâmetro de rota não existir no banco de dados ou pertencer a outro usuário, o endpoint retornará o status code 404 e um objeto no corpo da resposta contendo a mensagem "Transação não encontrada".

Caso alguma propriedade não seja preenchida, o endpoint retornará o status code 400 e um objeto no corpo contendo a mensagem indicando qual propriedade não está sendo preenchida.

Assim como no endpoint de cadastrar transação, a propriedade categoria_id precisa ter um valor numérico entre 1 e 17. Se o valor for diferente, será retornado o status code 400 e um objeto no corpo da resposta contendo a mensagem "Categoria inválida".

A propriedade tipo também precisa ter o valor "entrada" ou "saida". Caso contrário, será retornado o status code 400 e um objeto no corpo contendo a mensagem "Tipo de transação inválida".

A propriedade data precisa ter o formato dia/mês/ano - hora:minuto, se você quiser resgistrar a hora e o minuto da transação, ou somente dia/mês/ano, nesse caso o banco de dados registrará a hora como 00:00:00. Se a requisição for enviada contendo uma palavra ou outro formato no valor da propriedade, o sistema retornará o status code 500 e um objeto no corpo da resposta com a mensagem de "Erro interno do servidor".

Se todas as validações forem obedecidas, o retorno da API será o status code 204, não contendo nada no corpo da resposta, e a atualização será feita no banco de dados.

### Deletar Transação

A requisição precisa conter o Bearer Token no cabeçalho e o ID da transação no parâmetro de rota do endpoint.

Se o ID da transação enviado não pertencer ao usuário logado ou não existir no banco de dados, o sistema retornará o status code 404 e um objeto no corpo contendo a mensagem "Transação não encontrada".

Se o ID da transação for enviado com um valor que não seja numérico, o retorno da API será o status code 500 e um objeto contendo a mensagem de "Erro interno do servidor" no corpo da resposta.

Em caso de sucesso em todas as validações, o sistema retornará o status code 204, sem mensagem no corpo da resposta.

### Obter Extrato de Transações

A requisição precisa conter apenas o Bearer Token no cabeçalho.

Em caso de sucesso em todas as validações, o sistema retornará o status code 200 e um objeto no corpo da resposta contendo 2 propriedades: uma representando o valor total das transações cadastradas como entrada e a outra representando o valor total das transações cadastradas como saída.
