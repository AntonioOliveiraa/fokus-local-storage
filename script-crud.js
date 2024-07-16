// Armazenando as buscas dos seletores
const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const botaoCancelarTarefa = document.querySelector('.app__form-footer__button--cancel');
const paragradoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');

// Carregando as tarefas do localStorage
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

// Atualizando as tarefas no localStorage
function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// Adicionando os eventos
function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    // Alterando o nome da tarefa
    botao.onclick = () => {
        // debugger;
        const novaDescricao = prompt("Qual é o novo nome da tarefa?");
        // console.log('Nova descrição da tarefa: ', novaDescricao);

        // Atualizando a descrição da tarefa no localStorage
        if(novaDescricao) {
            paragrafo.textContent = novaDescricao;
    
            tarefa.descricao = novaDescricao;
            atualizarTarefas();
        }
    };

    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', './imagens/edit.png');
    botao.append(imagemBotao);

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    // Verificando se a tarefa selecionada está completa
    if(tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    } else {
        // Adicionando e removendo a tarefa para #Em andamento
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active').forEach(elemento =>
                elemento.classList.remove('app__section-task-list-item-active')
            );
    
            // Verificando se a tarefa clicada já está na sessão em questão
            if(tarefaSelecionada == tarefa) {
                paragradoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return;
            }
    
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            paragradoDescricaoTarefa.textContent = tarefa.descricao;
            li.classList.add('app__section-task-list-item-active');
        };
    }


    return li;
};

// Esconder o formulário de adicionar tarefa ao clicar no botão de adicionar
btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden');
});

// Adicionando uma nova tarefa ao clicar no botão de envio do formulário
formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value
    };

    // Salvando a tarefa no localStorage
    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();

    textArea.value = '';
    formAdicionarTarefa.classList.add('hidden');
});

// Carregando as tarefas existentes na página
tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});

// Cancelando a criação de uma tarefa ao clicar no botão cancelar
 botaoCancelarTarefa.addEventListener('click', () => {
    textArea.value = '';
    formAdicionarTarefa.classList.add('hidden');
});


// Marcando uma tarefa como concluída após o timeout foco
document.addEventListener('FocoFinalizado', () => {
    if(tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');

        // Marcar a tarefa como conluída na localStorage
        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
});


// Remover tarefas concluídas ao clicar no botão de remover concluídas
btnRemoverConcluidas.onclick = () => {
    const seletor = ".app__section-task-list-item-complete";
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    });

    // Remover as tarefas concluídas do localStorage
    tarefas = tarefas.filter(tarefa => !tarefa.completa); // Mantendo apenas as tarefas que não tem o atributo "completa"
    atualizarTarefas();
};
