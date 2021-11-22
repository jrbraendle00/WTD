window.addEventListener('load', () => {
    const listForm = document.querySelector("#task-list-form");
    const listInput = document.querySelector("#task-list-input");
    const taskForm = document.querySelector("#tasks-form");
    const taskInput = document.querySelector("#task-input");
    const listElement = document.querySelector("#lists");

    listForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const listName = listInput.value;

        if (!listName) {
            alert("Please fill out the list name");
        } else {
            console.log(listName);
        }
    })

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskName= taskInput.value;
        if (taskName !== ""){
            addTask(taskName);
            taskInput.value='';
        }
    })
})

/*
//Arrays to store lists and tasks temporarily
let todoLists = [];
let todoTasks = [];

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