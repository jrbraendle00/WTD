const listsElement = document.querySelector('#lists');
const listForm = document.querySelector('#list-form');
const listInput = document.querySelector('#list-input');
const deleteListBtn = document.querySelector('#delete-list-btn');

const LOCAL_STORAGE_LIST_KEY = 'todo.lists'; //key for local storage where we store our lists
const LOCAL_STORAGE_CURRENT_LIST_ID_KEY = 'task.currentListId';

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let currentListId = localStorage.getItem(LOCAL_STORAGE_CURRENT_LIST_ID_KEY);

listsElement.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') { //if we click on an li element
        currentListId = e.target.dataset.listId;
        save();
        getLists();
    }
})

deleteListBtn.addEventListener('click', e => {
    lists = lists.filter(list => list.id != currentListId);
    currentListId = null;
    save();
    getLists();
})

listForm.addEventListener('submit', e => {
    e.preventDefault();
    const listName = listInput.value;
    
    if (!listName) {
        alert("Please fill out the list name");
        return
    }

    const newList = new List(listName);
    listInput.value = null;
    lists.push(newList);
    getLists();
    save();
})

//List Object Constructor
function List(name) {
    this.id = Date.now().toString();
    this.title = name;
    this.tasks = [];
}

//Saves our lists into local storage so they don't disappear when page is refreshed
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_CURRENT_LIST_ID_KEY, currentListId);
}

function getLists() {
    clearLists(listsElement);
    console.log(lists);
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.title;

        if (list.id === currentListId) {
            listElement.classList.add('active');
        }    
        listsElement.appendChild(listElement);
    })
}

function clearLists(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

getLists(); 

/*
//List, student and task objects
function Student() {
    let studentId = "";
    this.username = "";
    this.firstName = "";
    this.lastName = "";
    
    this.getStudentId = function() {
        return studentId;
    }
    
    this.getUsername = function() {
        return this.username;
    }

    this.getFirstName = function() {
        return this.firstName;
    }

    this.getLastName = function() {
        return this.lastName;
    }

    this.createList = function() {
        //...
    }

    this.deleteList = function(listID) {
        //...
    }
}    

function List() {
    let listId = "";
    
    let getListId = function() {
        return listId;
    }
    
    this.addTask = function() {
        //...
    }

    this.deleteTask = function(taskID) {
        //...
    }

    this.getTask = function(taskID) {
        //...
    }

    let sort = function() {
        //...
    }

    let notify = function() {
        //...
    }
}

function Task(text) {
    this.taskId = "";
    this.taskText = text;
    this.status = false;
    this.deadline = "";
    
    this.getTaskId = function() {
        return this.taskId;
    }
    
    this.getText = function() {
        return this.taskText;
    }

    this.getDeadline = function() {
        return this.deadline;
    }

    this.getStatus = function() {
        return this.status;
    }

    this.edit = function() {
        //...
    }
}  
function showTask(todo){
    const list= document.querySelector('.taskSpace');
    const isChecked= todo.checked ? 'done': '';
    const element= document.createElement("li");
    element.setAttribute('class', `todo-item ${isChecked}`);
    element.setAttribute('data-key', todo.id);
    element.innerHTML= `
    <input id="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="check"></label>
    <span>${todo.text}</span>
    <button>x</button>
    `;
list.append(element);
}  
function addTask(text)
{
    const todo={
        text,
        checked: false,
        id: Date.now(),
    };
    todoTasks.push(todo);
    console.log(todoTasks);
    showTask(todo);
}
function getList(btn) {
    const listName = document.getElementById(btn.id).innerHTML;
    document.getElementById('listName').innerHTML = listName;
    
} */