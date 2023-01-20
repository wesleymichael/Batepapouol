/**** VARIÁVEIS GLOBAIS ****/
let userName;
let to = 'Todos';
let type = 'message';
let usersOnline = [];

/**** Função para atualizar o nome do destinatário ****/
function messageRecipient(recipient){
    to = recipient;
}


function publicORprivate(){
    if(type === 'private_message'){
        return 'reservadamente';
    }
    else{
        return 'publicamente';
    }
}


/**** Função para atualizar o rodapé ****/
function updatefooter(){
    let rodape = document.querySelector('footer');

    if(to !== 'Todos'){
        rodape.innerHTML = `
        <div class="reservado">
            <input type="text" placeholder="Escreva aqui..." data-test="input-message">
            <span data-test="recipient">Enviado para ${to} (${publicORprivate()})</span>
        </div>
        <button type="text" onclick="sendMessage()" data-test="send-message">
            <ion-icon name="paper-plane-outline"></ion-icon>
        </button>
        `
    }
    else{
        rodape.innerHTML = `
        <footer>
            <input type="text" placeholder="Escreva aqui..." data-test="input-message">
            <button type="text" onclick="sendMessage()" data-test="send-message">
                <ion-icon name="paper-plane-outline"></ion-icon>
            </button>
        </footer>
        `;
    }
}

/**** Função que remove a classe 'selecionado' do item anteriormente selecionado e adicionada ao novo item ****/
function selectUser(select){
    const user = document.querySelector('.users .selecionado');
    user.classList.remove('selecionado');

    select.classList.add('selecionado');
    
    //Atualizar o novo do remetente
    const to = document.querySelector('.users .selecionado span');
    messageRecipient(to.innerHTML);

    //Atualiza o rodapé
    updatefooter();
}

function selectVisibility(select, messageType){
    const visibility = document.querySelector('.visibility .selecionado');
    visibility.classList.remove('selecionado');

    select.classList.add('selecionado');

    //Atualização da variável global que tem o tipo de mensagem selecionada (pública ou privada)
    type = messageType;

    //Atualiza o rodapé
    updatefooter();
}


/**** Implementação do envio da mensagem com tecla Enter ****/
function buttonEnterSendMEssage(){
    document.addEventListener("keypress", function(e) {
        if( e.key === "Enter"){
            document.querySelector('footer button').click();
        }
    });
}


/**** Função para enconder/mostrar o menu lateral ****/
function hideNav(){
    const hide = document.querySelector('.nav');
    hide.classList.remove('nav');
    hide.classList.add('display-hide');
}


/**** Função para mostrar a barra de navegação com informações do usuário ****/
function navUsers(){
    let show = document.querySelector('.display-hide');
    if(show !== null){
        show.classList.remove('display-hide');
        show.classList.add('nav');
        return;
    }
    //Se for a primeira execução, a classe que existe no menu lateral é 'display-none'
    show = document.querySelector('.display-none');
    show.classList.remove('display-none');
    show.classList.add('nav');
}


/**** Em caso de sucesso atualizar o chat ****/
function sendSucess(){
    loadMessages();
}

function sendError(){
    alert('Ocorreu um erro inexperado.');
    window.location.reload();
}


/**** Implementação do envio de mensagem para o servidor ****/
function sendMessage(){
    const text = document.querySelector('footer input').value;

    //Limpar input
    document.querySelector('footer input').value = '';

    const dados = {
        'from': userName,
        'to': to,
        'text': text,
        'type': type,
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', dados);
    promise.then(sendSucess);
    promise.catch(sendError);
}


/**** Função para atualizar o destinatário da mensagem, caso ele tenha saido da sala ****/
function updateRecipient(){
    for(let i = 0; i < usersOnline.length; i++){
        if(usersOnline[i].name === to){
            return to;
        }
    }
    to = 'Todos';
}


function renderUsersOnline(){
    let listUsers = document.querySelector('.users');
    updateRecipient();                                              //Função para atualizar o destinatário
    let todosSelecionado = '';
    if (to === 'Todos'){
        todosSelecionado = 'selecionado';
    }
    listUsers.innerHTML = `
        <li onclick="selectUser(this)" class='${todosSelecionado}' data-test="all">
            <div>
                <ion-icon name="people"></ion-icon>
                <span>Todos</span>
            </div>
            <ion-icon name="checkmark-sharp" data-tes="check"></ion-icon>
        </li>
    `;
    for (let i = 0; i < usersOnline.length; i++){
        const usuario = usersOnline[i].name;

        //Remover o próprio nome da lista de participantes ativos
        if(usuario !== userName){
            if (usuario === to){
                listUsers.innerHTML += `
                <li onclick="selectUser(this)" class="selecionado" data-test="participant">
                    <div>
                        <ion-icon name="person-circle"></ion-icon>
                        <span>${usuario}</span>
                    </div>
                    <ion-icon name="checkmark-sharp" data-tes="check"></ion-icon>
                </li>  
                `;
            }
            else{
                listUsers.innerHTML += `
                <li onclick="selectUser(this)" data-test="participant">
                    <div>
                        <ion-icon name="person-circle"></ion-icon>
                        <span>${usuario}</span>
                    </div>
                    <ion-icon name="checkmark-sharp" data-tes="check"></ion-icon>
                </li>  
                `;
            }
        }
    }
}


/**** Função para obter a lista de participantes ativos no chat ****/
function loadUsersSucess(sucess){
    usersOnline = sucess.data;
    //Toda vez que atualizar, renderizo a lista de usuários dinamicamente
    renderUsersOnline();
}

function loadUsers(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promise.then(loadUsersSucess);
}


/**** Função para renderizar as mensagens que estão no servidor ****/
function loadMessagesSucess(sucess){
    const message = sucess.data;
    let conversation = document.querySelector('.conversation');

    conversation.innerHTML = '';

    for(let i = 0; i < message.length; i++){
        const recipient = message[i].to;

        if(message[i].type === 'status'){
            conversation.innerHTML += `
            <div class="msg status" data-test="message">
                <span class="time">(${message[i].time})</span>
                <strong class="from">${message[i].from}</strong>
                <span>${message[i].text}</span>
            </div>`;
        }
        else if(message[i].type === 'message'){
            conversation.innerHTML += `
            <div class="msg message" data-test="message">
                <span class="time">(${message[i].time})</span>
                <strong class="from">${message[i].from}</strong>
                <span>para</span>
                <strong class="to">${recipient}:</strong>
                <span>${message[i].text}</span>
            </div>`;
        }
        else if (message[i].type === 'private_message'){
            //Renderização da mensagem privada apenas se for destinada ao Usuário ou enviada por
            if(recipient === userName || recipient === 'Todos' || message[i].from === userName){
                conversation.innerHTML += `
                <div class="msg private_message" data-test="message">
                    <span class="time">(${message[i].time})</span>
                    <strong class="from">${message[i].from}</strong>
                    <span>reservadamente para</span>
                    <strong class="to">${message[i].to}:</strong>
                    <span>${message[i].text}</span>
                </div>`;
            }
        }
    }
    //Direcionar a página para a última mensagem enviada
    document.querySelector('.conversation div:last-child').scrollIntoView();
}


function loadMessagesError(){
    alert('Ocorreu algum erro no carregamento das mensagens do chat');
    window.location.reload();
}


/**** Função para carregar as mensagens do servidor ****/
function loadMessages(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

    promise.then(loadMessagesSucess);
    promise.catch(loadMessagesError);
}


/**** Função para carregar o layout da página do bate papo ****/
function loadPage(){
    const page = document.querySelector('body');
    
    page.innerHTML = `
    <header>
        <img src="../img/uol.png" alt="uol">
        <button type="text" onclick="navUsers()" data-test="open-participants">
            <ion-icon name="people"></ion-icon>
        </button>
    </header>
    <div class="conversation">
    </div>
    <div class="display-none">
        <div class="dark" onclick="hideNav()" data-test="overlay"></div>
        <div class="conteudo">
            <div class="info">Escolha um contato para enviar mensagem:</div>
            <ul class='users'>      
            </ul>
            <div class="info">Escolha a visibilidade:</div>
            <ul class='visibility'>
                <li onclick="selectVisibility(this, 'message')" class='selecionado' data-test="public">
                    <div>
                        <ion-icon name="lock-open"></ion-icon>
                        <span>Público</span>
                    </div>
                    <ion-icon name="checkmark-sharp" data-tes="check"></ion-icon>
                </li>
                <li onclick="selectVisibility(this, 'private_message')" data-test="private">
                    <div>
                        <ion-icon name="lock-closed"></ion-icon>
                        <span>Reservadamente</span>
                    </div>
                    <ion-icon name="checkmark-sharp" data-tes="check"></ion-icon>
                </li>
            </ul>
        </div>
    </div>
    <footer>
        <input type="text" placeholder="Escreva aqui..." data-test="input-message">
        <button type="text" onclick="sendMessage()" data-test="send-message">
            <ion-icon name="paper-plane-outline"></ion-icon>
        </button>
    </footer>
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
    `
}


/**** Função para informar ao servidor a cada 5 segundos que o usuário permanece conectado ****/
function userLogged(){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name: userName});
}


function enterChat(){

    setInterval(userLogged, 5000);                        //Informar ao servidor que o usuário continua logado
    loadPage();                                           //Carregar layout do chat
    loadMessages();                                       //Carregar mensagens
    setInterval(loadMessages, 3000);                      //Atualizar as mensagens a cada 3 segundos
    loadUsers();                                          //Verificar os usuários logados
    setInterval(loadUsers, 10000);                        //Atualizar usuários logados a cada 10 segundos
    buttonEnterSendMEssage();                             //Adicionar evento na página para enviar mensagem com ENTER
}


////////////////////////////////////////------------IMPLEMENTAÇÃO DA PÁGINA DE LOGIN----------////////////////////////////////////////

/**** Função para tratar resposta com sucesso ao enviar nome do usuário para o servidor ****/
function userSucessRequest(sucess){
    //Status = 200, usuário pode conectar
    userName = JSON.parse(sucess.config.data).name;

    document.removeEventListener('keypress', loginEnter);
    
    //Com o nome do usuário, vou entrar na sala
    enterChat();

}


/**** Função para tratar erro do envio do nome do usuário para o servidor ****/
function errorUser(erro){
    //Status 400 = nome de usuário já em uso
    if (erro.request.status === 400){
        alert('Já existe alguém com esse nome.');
        window.location.reload();
    }
    else{
        alert('Ocorreu um erro inexperado');
        window.location.reload();
    }
}


/**** Função para solicitar entrada na sala de bate papo ****/
function logIn(){
    userName = document.querySelector('input').value;
    const dados = {
        name: userName,
    };

    document.querySelector('.login').innerHTML = `
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


/**** Click com a tecla ENTER ****/
function loginEnter(){
    const obj = document.querySelector('.login button');
    let tecla = event.key; 
    if (tecla === 'Enter'){
        obj.click();
    }
}


/**** Adicionar eventos na página de login ****/
function eventsLogin(){
    document.querySelector('.login input').addEventListener('input', validateInput);
    document.addEventListener("keypress", loginEnter);
}