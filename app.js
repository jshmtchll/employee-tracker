const inquirer = require("inquirer");
const cTable = require('console.table');
const db =  require('./db/connection');
const figlet = require('figlet');

console.log(figlet.textSync('Employee Tracker', {
    font: 'slant',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
}));

const runDatabase = () => {


    
    return inquirer.prompt ([
        {
            
            type: 'list',
            message: 'What do you need to do?',
            name: 'start',
            choices: ['Add an employee', 
                    'Remove an employee', 
                    'Update employee role', 
                    'View ALL departments', //
                    'View ALL employees', //
                    'View ALL roles', //
                    'END']
        }
    ])
    .then (data => {
        if( data.start == 'Add an employee') {
            addEmployee()
        } else if (data.start == 'Remove an employee') {
            removeEmployee()
        } else if (data.start == 'Update employee role') {
            updateEmployeeRole()

                        //----------------VIEW ALL EMPLOYEES----------------------//
        } else if (data.start == 'View ALL employees') {
            db.query (`SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) 
                        AS Manager FROM employees 
                        INNER JOIN roles on roles.id = employees.role_id 
                        INNER JOIN department on department.id = roles.department_id 
                        LEFT JOIN employees e on employees.manager_id = e.id;`,
                        function (err,res) {
                            if (err) throw err
                            console.table(res)
                            runDatabase()
                        })
                    
            //--------------VIEW EMPLOYEE BY DEPT----------------//
        } else if (data.start == 'View ALL departments') {
            db.query (`SELECT employees.first_name, employees.last_name, department.name 
                        AS Department FROM employees 
                        JOIN roles ON employees.role_id = roles.id 
                        JOIN department ON roles.department_id = department.id 
                        ORDER BY employees.id;`,
                        function(err,res) {
                            if(err) throw err
                            console.table(res)
                            runDatabase();
                        })

            //----------VIEW EMPLOYEE BY ROLE-----------//
        } else if (data.start == 'View ALL roles') {
            db.query(`SELECT employees.first_name, employees.last_name, roles.title 
                    AS Title FROM employees 
                    JOIN roles ON employees.role_id = roles.id;`,
            function(err,res) {
                if (err) throw err
                console.table(res)
                runDatabase()
            })
        }
    })

    
}

function addEmployee() {
    console.log(figlet.textSync('Add Employee', {
        font: 'slant',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }));

    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the employees first name? (required)',
            validate: first_name => {
                if (first_name) {
                  return true;
                } else {
                  console.log('Please enter a first name.');
                  return false;
                }
              }
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the employees last name? (required)',
            validate: first_name => {
                if (first_name) {
                  return true;
                } else {
                  console.log('Please enter a last name.');
                  return false;
                }
              }
        },
    ])
}

function removeEmployee() {
    console.log(figlet.textSync('Remove Employee', {
        font: 'slant',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }));
}

function updateEmployeeRole() {
    console.log(figlet.textSync('Update Employee', {
        font: 'slant',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }));
}


runDatabase()


validate: UserInput => {
    if (UserInput) {
      return true;
    } else {
      console.log('Please enter your Github username.');
      return false;
    }
  }