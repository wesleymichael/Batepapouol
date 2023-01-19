/**** VARIÁVEIS GLOBAIS ****/
let userName;




function loadMessagesSucess(sucess){
    console.log(sucess)
    //Implementar sucesso - Renderizar mensagens do servidor
}


function loadMessagesError(error){
    console.log(error)
    //Implementar erro
}


function loadMessages(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

    promise.then(loadMessagesSucess);
    promise.catch(loadMessagesError);
}


///////////////////////////// INICIO DA IMPLEMENTAÇÃO DO CHAT (acima) ///////////////////////////////////////////////////


/**** Função para tratar resposta com sucesso ao enviar nome do usuário para o servidor ****/
function userSucessRequest(sucess){
    //Status = 200, usuário pode conectar. Ir para a página de mensagens
    //Dúvida: sempre que eu precisar do meu nome de usuário preciso usar o GET??
    //console.log(sucess.status)
    window.location.href = "chat.html"
    //Redirecionar para a página de mensagens
}


/**** Função para tratar erro do envio do nome do usuário para o servidor ****/
function errorUser(erro){
    //Status 400 = nome de usuário já em uso
    //Pedir pra escolher outro nome
    if (erro.status === 400){
        alert('Já existe alguém com esse nome.');
        const login = document.querySelector('.login');
        login.innerHTML = `
            <input type="text" placeholder="Digite seu nome">
            <button type="submit" name="button" onclick="logIn()" disabled>Entrar</button>
        `;
    }
    else{
        alert('Ocorreu um erro inexperado');
        const login = document.querySelector('.login');
        login.innerHTML = `
            <input type="text" placeholder="Digite seu nome">
            <button type="submit" name="button" onclick="logIn()" disabled>Entrar</button>
        `;
    }
}


/**** Função para solicitar entrada na sala de bate papo ****/
function logIn(){
    userName = document.querySelector('input').value;
    const dados = {
        name: userName,
    };

    const login = document.querySelector('.login');
    login.innerHTML = `
        <img class="img-loading" src="../img/loading.gif" alt="loading">
        <span>Entrando...</span>
    `;

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', dados);

    promise.then(userSucessRequest);
    promise.catch(errorUser);
}



/**** Função para habilitar o botão quando for digitado pelo menos 3 caracteres ****/
function validateInput({target}){
    const button = document.querySelector('button');
    if(target.value.length > 2){
        button.removeAttribute('disabled');
        return;
    }
    button.setAttribute('disabled', '');
}

