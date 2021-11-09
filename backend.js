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

function getList(btn) {
    const listName = document.getElementById(btn.id).innerHTML;
    document.getElementById('listName').innerHTML = listName;
    
}