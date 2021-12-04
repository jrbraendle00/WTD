const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT ||3000; 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
var sql = require('mysql');
const { resolve } = require('path');
var config = sql.createPool({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b445599726c648',
    password: '18e985fb',
    database: 'heroku_d5fc58195132b53'
});

module.exports = config;

//GET ROUTES
app.get('/', function (req, res) {

    let username = req.cookies.username;

    if (username == null) {
        //res.sendFile(path.join(__dirname + '/public/login.html'));
        return res.redirect('/login');

    } else {
        console.log(username);
        return res.redirect('/lists');
    }


});

app.get('/login', function (req, res) {
    let username = req.cookies.username;


    if (username == ""){
        return res.redirect('/login');
    }
    if (username != null) {

        return res.redirect('/lists');
        

    }
    return res.sendFile(path.join(__dirname + '/public/login.html'));


});

app.get('/logout', function (req, res) {
    res.clearCookie("username");
    return res.redirect('/login');


});

app.get('/lists', function (req, res) {

    let username = req.cookies.username;

    if (username == null) {

        return res.redirect('/login');
        
    }

    return res.sendFile(path.join(__dirname + '/public/frontend.html'));

});

app.get('/newuser', function (req, res) {
    return res.sendFile(path.join(__dirname + '/public/newuser.html'));
});

app.get('/listdata', function(req, res) {
    var sql = "SELECT * FROM task_list WHERE Assoc_User='" + req.cookies.username + "'";
    
    config.query(sql, function (err, result) {
        if (err) throw err;
        res.json(result);
    });  
});


//POST ROUTES

//defualt homepage is the login screen
app.post('/taskdata', function(req, res) {

    const data = req.body;

    const taskListID = data.listID;

    var sql = "SELECT * FROM task WHERE Assoc_Task_List_ID='" + taskListID + "'";
    config.query(sql, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.post('/login', (req, res) => {

    var sql = "SELECT COUNT(*) FROM user WHERE username='" + req.body.username + "' AND password='" + req.body.password + "'";
    try {

        config.query(sql, function (err, result) {

            if (result[0]['COUNT(*)'] == 1) {
                console.log('valid user');

                res.cookie('username', req.body.username);

                return res.redirect('/lists');
                
            } else {
                console.log('invalid user');

                return res.redirect('/');
            }
        });

    } catch (error) {
        console.log(error);
    }

});

app.post('/newuser', async (req, res) => {

    if (req.body.username == ""){
        return res.redirect('/newuser');
    }
    var sql = "INSERT INTO user (username, password) VALUES ('" + req.body.username + "', '" + req.body.password + "')";

    try {
        config.query(sql, function (err, result) {
        });

    } catch (error) {

        console.log(error);
    }

    return res.redirect('/');
});


app.post('/lists', async (req, res) => {

    const data = req.body;

    console.log(data);
    try {
        if (JSON.stringify(data).includes('newListID')) {
            listID = data.newListID;
            listName = data.newListTitle;
            AssocUser = req.cookies.username;

            var sql = "INSERT INTO task_list (Task_List_ID, Task_List_Name, Assoc_User) VALUES ('" + listID + "', '" + listName + "', '" + AssocUser + "')";
            config.query(sql, function (err, result) {
                return res.end();
            });
        }

        if (JSON.stringify(data).includes('listToDelete')) {
            listID = data.listToDelete;

            var sql = "DELETE FROM task_list WHERE Task_List_ID='" + listID + "'";
            config.query(sql, function (err, result) {
                return res.end();
            });
        }

        if (JSON.stringify(data).includes('newTaskID')) {
            taskID = data.newTaskID;
            taskName = data.newTaskTitle;
            AssocListID = data.currentListId;
            complete = 0;

            if (data.taskStatus == false){
                complete = 0;
            } else {
                complete = 1;
            }

            var sql = "INSERT INTO task (Task_ID, Name, Complete, Assoc_Task_List_ID) VALUES ('" + taskID + "', '" + taskName + "', '" + complete + "', '" + AssocListID + "')";
            config.query(sql, function (err, result) {
                //console.log("task added to list: " + AssocListID);
                return res.end();
            });
        }

        
        if (JSON.stringify(data).includes('statusChange')) {
            taskID = data.taskID;
            complete = 0;

            if (data.statusChange == false){
                complete = 0;
            } else {
                complete = 1;
            }

            var sql = "UPDATE task SET Complete = '" + complete + "' WHERE Task_ID = '" + taskID + "'";
            console.log(sql);
            config.query(sql, function (err, result) {
                return res.end();
            });

        }

        
        if (JSON.stringify(data).includes('taskDeletionList')) {
            listID = data.taskDeletionList;

            var sql = "DELETE FROM task WHERE Assoc_Task_List_ID='" + listID + "' AND Complete = 1";
            config.query(sql, function (err, result) {
                return res.end();
            });
        }

    } catch (error) {
        console.log(error);
    }


});

app.listen(port);
console.log('Listening at port ' + port);