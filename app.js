const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.todo-filter');

document.addEventListener('DOMContentLoaded', loadLocalTodos);
todoButton.addEventListener('click', addTodoEvent);
todoList.addEventListener('click', deleteOrCheckTodoEvent);
filterOption.addEventListener('click', filterTodoEvent);

function addTodoEvent(event) {
    event.preventDefault(); // Prevents the form from submitting
    if(!todoInput.value || isDuplicateTodo(todoInput.value)) // Don't use empty values or duplicates
        return;

    // Local Storage
    addLocalTodo(todoInput.value);

    addTodo(todoInput.value);

    // Clear Input
    todoInput.value = '';
}

function deleteOrCheckTodoEvent(event) {
    const item = event.target;
    const parent = item.parentElement;

    if(item.classList.contains('trash-btn')) {
        parent.classList.add('fall');
        deleteLocalTodo(parent.children[0].innerText);
        parent.addEventListener('transitionend', () => {
            parent.remove();
        });
    } else if(item.classList.contains('complete-btn')) {
        const completed = parent.classList.toggle('completed');
        updateLocalTodo(parent.children[0].innerText, completed);
        parent.addEventListener('transitionend', () => {
            runFilter();
        });
    }
}

function filterTodoEvent(event) {
    runFilter();
}

function runFilter() {
    const todos = todoList.childNodes;
    switch(filterOption.value) {
        case 'all':
            todos.forEach((todo) => {
                todo.style.display = 'flex';
            });
            break;
        case 'completed':
            todos.forEach((todo) => {
                if(todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else
                    todo.style.display = 'none';
            });
            break;
        case 'uncompleted':
            todos.forEach((todo) => {
                if(!todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else
                    todo.style.display = 'none';
            });
            break;
        default:
            break;
    }
}

function addTodo(value, completed = false) {
    // Create Div
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    if(completed) {
        todoDiv.classList.add('completed');
    }

    // Create Li
    const newTodo = document.createElement('li');
    newTodo.classList.add('todo-item');
    newTodo.innerText = value;
    todoDiv.appendChild(newTodo);

    // Create Checkmark Button
    const completedButton = document.createElement('button');
    completedButton.classList.add('complete-btn');
    completedButton.innerHTML = '<i class="fas fa-check"><i/>';
    todoDiv.appendChild(completedButton);

    // Create Trash Button
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-btn');
    trashButton.innerHTML = '<i class="fas fa-trash"><i/>';
    todoDiv.appendChild(trashButton);

    // Append to List
    todoList.appendChild(todoDiv);

    // Run the filter
    runFilter();
}

function loadLocalTodos() {
    const cached = localStorage.getItem('todos');
    const todos = cached ? JSON.parse(cached) : [];
    todos.forEach(todo => addTodo(todo.value, todo.completed));
}

function addLocalTodo(value) {
    const cached = localStorage.getItem('todos');
    const todos = cached ? JSON.parse(cached) : [];
    todos.push({ value: value, completed: false });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function deleteLocalTodo(value) {
    const cached = localStorage.getItem('todos');
    const todos = (cached ? JSON.parse(cached) : []).filter(todo => todo.value !== value);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateLocalTodo(value, completed) {
    const cached = localStorage.getItem('todos');
    const todos = cached ? JSON.parse(cached) : [];
    const update = todos.find(todo => todo.value === value);
    if(update) {
        update.completed = completed;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function isDuplicateTodo(value) {
    const cached = localStorage.getItem('todos');
    const todos = cached ? JSON.parse(cached) : [];
    return todos.some(todo => todo.value === value);
}