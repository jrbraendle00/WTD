//Get html elements
const listsElement = document.querySelector('#lists');
const listForm = document.querySelector('#list-form');
const listInput = document.querySelector('#list-input');
const deleteListBtn = document.querySelector('#delete-list-btn');
const tasksListElement = document.querySelector('#tasks-list');
const taskListTitle = document.querySelector('#list-name');
const tasksCounter = document.querySelector('#tasks-count');
const tasksElement = document.querySelector('#tasks');
const taskOutline = document.querySelector('#task-outline');
const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const deleteTasksBtn = document.querySelector('#delete-tasks-btn')

//keys for local storage where we store our lists
const LIST_KEY = 'todo.lists'; 
const CURRENT_LIST_ID_KEY = 'task.currentListId';

//Get lists from local storage using key and convert to a js object or set to an empty array if there are no existing lists in local storage.

//query lists from db using the keys associated with a user
//lists should be a json objects array of all thje lists attached to a specified user
let lists = JSON.parse(localStorage.getItem(LIST_KEY)) || []; 
let currentListId = localStorage.getItem(CURRENT_LIST_ID_KEY);

getListData();

async function getListData() {
    const response = await fetch('/listdata');
    const data = await response.json();
    console.log(data);
    

    clearElement(listsElement);

    for (item of data) {
        const taskName = document.createElement('li');
        taskName.textContent = `${item.Task_List_Name}`;
        taskName.classList.add("list-name");
        taskName.setAttribute('id', `${item.Task_List_ID}`);//as listid as the attribute id
        document.getElementById('lists').append(taskName);

        //getTaskData(item.Task_List_ID);
        console.log(taskName.id);

    }


/* 
    if (currentListId == null) { //If we don't have a list selected
        //tasksListElement.style.display = 'none'; 
        //deleteListBtn.style.display = 'none';
        //deleteTasksBtn.style.display ='none';
    } else { //display tasks element with current list info
        tasksListElement.style.display = ''; 
        deleteListBtn.style.display = '';
        deleteTasksBtn.style.display ='';
        //taskListTitle.innerText = currentListId.title;
        //getTaskCount(currentListId);
        clearElement(tasksElement);
        //addTask(currentList);
    }
 */
}
async function getTaskData(listID) {

    clearElement(tasksElement);

    //getTaskCount(listID);

    const taskData = { listID };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData),
    }

    const response = await fetch('/taskdata', options);
    const data = await response.json();
    //console.log(data);
    
    taskListTitle.innerText = document.getElementById(listID).innerText;

    for (item of data) {
        const taskElement = document.importNode(taskOutline.content, true);

        const task = document.createElement('div');
        task.setAttribute('id', `${item.Task_ID}`);
        task.classList.add('task');
        const checkbox = taskElement.querySelector('input');
        checkbox.id = `${item.Task_ID}`;
        if (item.Complete == "1") {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
        const space = document.createElement('a');
        space.textContent = '   ';
        const label = taskElement.querySelector('label');
        label.htmlFor = `${item.Task_ID}`;
        label.textContent = `${item.Name}`;

        task.append(checkbox,space, label);

        tasksElement.appendChild(task);
    }

}

//Event Listeners

//highlight a list when it is clicked
listsElement.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') { //if the targeted element is an li element
        //currentListId = e.target.dataset.listId;
        currentListId = e.target.id;
        //save();
        //displayTasks();

        console.log(currentListId);

        getTaskData(currentListId);

    }
})

//if we click on a task checkbox set task status to true and update the task count
tasksElement.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') { //if the targeted element is an input element
        //const currentList = lists.find(list => list.id === currentListId);
        //const currentTask = currentList.tasks.find(task => task.id === e.target.id);
        //currentTask.status = e.target.checked;
        //save();

        currentTaskID = e.target.id;

        taskStatus = e.target.checked;

        saveCompleted(currentTaskID, taskStatus);

        //getTaskCount(currentListId);
    }
})

//Delete all completed tasks
deleteTasksBtn.addEventListener('click', e => {
    //const currentList = lists.find(list => list.id === currentListId);
    //currentList.tasks = currentList.tasks.filter(task => !task.status);
    //save();
    //displayTasks();
    if (currentListId == null){

        alert("Please select a list");
        return
    }
        
    saveTaskDeletion(currentListId);
    

})

//Delete a list when delete list button is clicked
deleteListBtn.addEventListener('click', e => {
    //lists = lists.filter(list => list.id !== currentListId); //Return a new list without the deleted list (the one that is currently selected)
    if (currentListId == null){

        alert("Please select a list");
        return
    }


    saveListDeletion(currentListId);
    currentListId = null; //Set id to null since we no longer have a currently selected list
    //save();
    //displayTasks();
    getListData();
})

listForm.addEventListener('submit', e => {
    e.preventDefault(); //stop page from refreshing when we submit form
    const listName = listInput.value;
    
    //if list name is empty prompt user to enter one
    if (!listName) {
        alert("Please fill out the list name");
        return
    }

    //create a new list object and push it into our list storage
    const newList = new List(listName);
    listInput.value = null; //clears input box
    lists.push(newList);
    //save();
    saveNewList(newList.id, newList.title);
    //displayTasks();
    clearElement(listsElement);
})

taskForm.addEventListener('submit', e => {
    e.preventDefault(); //stop page from refreshing when we submit form

    if (currentListId == null){

        alert("Please select a list");
        return
    }

    const taskText = taskInput.value;
    
    if (!taskText) {
        alert("Please fill out task");
        return
    }

    //Create a new task object ans push it into the the currently selected list
    const newTask = new Task(taskText);
    taskInput.value = null;
    //const currentList = lists.find(list => list.id === currentListId);
    //currentList.tasks.push(newTask);
    //save();
    //displayTasks();
    saveNewTask(newTask.id, newTask.text, newTask.status);
   //getTaskData(currentListId);
})

//List and Task Object Constructors
function List(name) {
    this.id = Date.now().toString();
    this.title = name;
    this.tasks = [];
}

function Task(text) {
    this.id = Date.now().toString();
    this.text = text;
    this.status = false;
}

//Functions

//Saves our lists into local storage so they don't disappear when page is refreshed
function save() {
    localStorage.setItem(LIST_KEY, JSON.stringify(lists)); //save list to local storage
    localStorage.setItem(CURRENT_LIST_ID_KEY, currentListId);

}
async function saveListDeletion(listToDelete) {

    const listData = {listToDelete};

    const options = {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(listData),
    }

    await fetch('/lists', options);

    //getListData();
    //getTaskData(currentListId);

} 
async function saveNewList(newListID, newListTitle) {

    const newListData = {newListID, newListTitle};

    const options = {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newListData),
    }

    await fetch('/lists', options);

    getListData();
    //getTaskData(currentListId);

}
async function saveNewTask(newTaskID, newTaskTitle, taskStatus) {

    const newTaskData = {newTaskID, newTaskTitle, taskStatus, currentListId};

    const options = {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTaskData),
    }

    await fetch('/lists', options);

    getTaskData(currentListId);

}
async function saveTaskDeletion(taskDeletionList){
    
    const listData = {taskDeletionList};

    const options = {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(listData),
    }

    await fetch('/lists', options);

    getTaskData(currentListId);

}
function saveCompleted(taskID, statusChange){

    const changeData = {taskID, statusChange};

    const options = {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(changeData),
    }

    fetch('/lists', options);
}

function displayTasks() { 
    clearElement(listsElement);
    addList();

    const currentList = lists.find(list => list.id === currentListId); 
    
    if (currentListId == null) { //If we don't have a list selected
        tasksListElement.style.display = 'none'; 
    } else { //display tasks element with current list info
        tasksListElement.style.display = ''; 
        taskListTitle.innerText = currentListId.title;
        //getTaskCount(currentListId);
        clearElement(tasksElement);
        addTask(currentList);
    }
}

//Add tasks to a selected list
function addTask(currentList) { 
    currentList.tasks.forEach(task => { //for every task in the currently selected list
        const taskElement = document.importNode(taskOutline.content, true); //task element contains all of the information the html template has
        const checkbox = taskElement.querySelector('input');
        checkbox.id = task.id; 
        checkbox.checked = task.status; 
        const label = taskElement.querySelector('label');
        label.htmlFor = task.id; 
        label.append(task.text);
        tasksElement.appendChild(taskElement); //add new task element to the list of tasks
    })
}

//get the number of unfinished tasks
async function getTaskCount (currentListId) { 
    //const unfinishedTasks = currentList.tasks.filter(task => !task.status).length; //get the length of the list of tasks that are not complete
    //const taskText = unfinishedTasks === 1 ? "task" : "tasks";
    //tasksCounter.innerText = `${unfinishedTasks} ${taskText} remaining`;

    const taskData = { currentListId };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData),
    }

    const response = await fetch('/taskdata', options);
    const data = await response.json();
    var uncompletedCount = 0;


    for (item of data) {
        if (item.Complete == 0){
            uncompletedCount++;
        }
    }

    const taskText = uncompletedCount === 1 ? "task" : "tasks";

    tasksCounter.innerText = `${uncompletedCount} ${taskText} remaining`;
}

//Add a new list
function addList() {
    lists.forEach(list => {
        //create a list element of the form <li class="list-name">list title</li>
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.title;

        if (list.id === currentListId) {
            listElement.classList.add('active');
        }

        listsElement.appendChild(listElement); //add the new list to the list of lists
    })
}

//remove all the children of an element
function clearElement(element) {
    while(element.firstChild) { 
        element.removeChild(element.firstChild)
    }
}

//displayTasks();