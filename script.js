/**** VARIÁVEIS GLOBAIS ****/
let userName;




function loadMessagesSucess(sucess){
    //Implementar sucesso - carregar mensagens do servidor
    const message = sucess.data;
    let conversation = document.querySelector('.conversation');

    conversation.innerHTML = '';

    for(let i = 0; i < message.length; i++){
        if(message[i].type === 'status'){
            conversation.innerHTML += `
            <div class="msg status">
                <span class="time">(${message[i].time})</span>
                <strong class="from">${message[i].from}</strong>
                <span>${message[i].text}</span>
            </div>`;
        }
        else if(message[i].type === 'message'){
            conversation.innerHTML += `
            <div class="msg message">
                <span class="time">(${message[i].time})</span>
                <strong class="from">${message[i].from}</strong>
                <span>para</span>
                <strong class="to">${message[i].to}:</strong>
                <span>${message[i].text}</span>
            </div>`;
        }
        else if (message[i].type === 'private_message'){
            conversation.innerHTML += `
            <div class="msg private-message">
                <span class="time">(${message[i].time})</span>
                <strong class="from">${message[i].from}</strong>
                <span>reservadamente para</span>
                <strong class="to">${message[i].to}:</strong>
                <span>${message[i].text}</span>
            </div>`;
        }
    }
}


/**** Função para carregar as mensagens do servidor ****/
function loadMessages(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

    promise.then(loadMessagesSucess);
    //promise.catch(loadMessagesError);
}


/**** Função para carregar o layout da página do bate papo ****/
function loadPage(){
    const page = document.querySelector('body');
    
    page.innerHTML = `
    <header>
        <img src="../img/uol.png" alt="uol">
        <ion-icon name="people"></ion-icon>
    </header>
    <div class="conversation">
    </div>
    <footer>
        <input type="text" placeholder="Escreva aqui...">
        <ion-icon name="paper-plane-outline"></ion-icon>
    </footer>
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
    `
}


/**** Função para informar ao servidor a cada 5 segundos que o usuário permanece conectado****/
function userLogged(){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name: userName});
}



function enterChat(){

    setInterval(userLogged, 5000);
    loadPage();
    loadMessages();
    setInterval(loadMessages, 3000);
    
}


///////////////////////////// INICIO DA IMPLEMENTAÇÃO DO CHAT (acima) ///////////////////////////////////////////////////


/**** Função para tratar resposta com sucesso ao enviar nome do usuário para o servidor ****/
function userSucessRequest(sucess){
    //Status = 200, usuário pode conectar. Ir para a página de mensagens
    //Dúvida: sempre que eu precisar do meu nome de usuário preciso usar o GET??
    //console.log(sucess.config.data);

    /*sucess.config.data é uma string no formato JSON. Preciso formatar para objeto - JSON.parse(string) */

    userName = JSON.parse(sucess.config.data).name;
    
    //Com o nome do usuário, vou entrar na sala
    enterChat();

    //window.location.href = "chat.html"
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

