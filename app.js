const inquirer = require("inquirer");
const cTable = require('console.table');
const db =  require('./db/connection');
const figlet = require('figlet');

const runDatabase = () => {
    return inquirer.prompt ([
        {
            type: 'list',
            message: 'What do you need to do?',
            name: 'start',
            choices: ['Add an employee', 
                    'Remove an employee', 
                    'Update employee role', 
                    'View by department', 
                    'View ALL employees', 
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
        } else if (data.start == 'View by department') {
            db.query (`SELECT employees.first_name, employees.last_name, department.name 
                        AS Department FROM employees 
                        JOIN roles ON employees.role_id = roles.id 
                        JOIN department ON roles.department_id = department.id 
                        ORDER BY employees.id;`)
        }
    })
}

function addEmployee() {
    console.log('add employee here')
}

function removeEmployee() {
    console.log('remove an employee')
}

function updateEmployeeRole() {
    console.log('update employee here')
}



runDatabase()


// validate: UserInput => {
//     if (UserInput) {
//       return true;
//     } else {
//       console.log('Please enter your Github username.');
//       return false;
//     }
//   }