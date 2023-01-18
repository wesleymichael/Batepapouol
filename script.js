

function sucessRequest(response){
    //Status = 200, usuário pode conectar. Ir para a página de mensagens
    //Dúvida: sempre que eu precisar do meu nome de usuário preciso usar o GET??
    alert('Pode entrar')

    //Redirecionar para a página de mensagens
    console.log(response.status);
}


function error(response){
    //Status 400 = nome de usuário já em uso
    //Pedir pra escolher outro nome
    const login = document.querySelector('.login');
    login.innerHTML = `
        <input type="text" placeholder="Digite seu nome">
        <button type="submit" name="button" onclick="logIn()" disabled>Entrar</button>
    `;    

    console.log(response.status);
}


function logIn(){
    const dados = {
        name: document.querySelector('input').value,
    };

    const login = document.querySelector('.login');
    login.innerHTML = `
        <img class="img-loading" src="../img/loading.gif" alt="loading">
        <span>Entrando...</span>
    `;

    const promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', dados);

    promisse.then(sucessRequest);
    promisse.catch(error);
}


function validateInput({target}){
    const button = document.querySelector('button');
    if(target.value.length > 2){
        button.removeAttribute('disabled');
        return;
    }
    button.setAttribute('disabled', '');
}

