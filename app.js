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
            choices: ['Add an employee', //
                    'Remove an employee', //
                    'Update employee role', //
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
        } else if (data.start == 'END') {
            console.log('Press CTRL + C to EXIT')
            return data;
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
            name: 'firstName',
            message: 'What is the employees first name? (required)',
            validate: firstName => {
                if (firstName) {
                  return true;
                } else {
                  console.log('Please enter a first name.');
                  return false;
                }
              }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employees last name? (required)',
            validate: lastName => {
                if (lastName) {
                  return true;
                } else {
                  console.log('Please enter a last name.');
                  return false;
                }
              }
        },
        {
            type: 'list',
            name: 'roleId',
            message: "What's the employees role ID? (required)",
            choices: ['1', '2', '3', '4', '5', '6', '7', '8']
        },
        {
            type: 'list',
            name: 'managerId',
            message: "What's the employees manager ID? (required)",
            choices: ['1', '4', '11', 'null']
        }
    ])
    .then(data => {
        const sql = `INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES (?, ?, ?, ?)`
        const params = [data.firstName, data.lastName, data.managerId, data.roleId]

        db.query(sql, params, (err, result) => {
            if (err) throw err
            console.log('✓ Employee has been added successfully ✓')
            console.table(data)
            runDatabase();
        })
    })
}

function removeEmployee() {
    console.log(figlet.textSync('Remove Employee', {
        font: 'slant',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }));

    inquirer.prompt([
        {
            type: 'input',
            name: 'deleteEmployee',
            message: 'Input the ID of the employee you want to delete. (Required)',
            validate: deleteEmployee => {
                if (deleteEmployee) {
                  return true;
                } else {
                  console.log('Please enter a valid ID.');
                  return false;
                }
              }
        }
    ])
    .then(data => {
        const sql = `DELETE FROM employees WHERE id = ?`
        const params = [data.deleteEmployee]

        db.query(sql, params, (err, result) => {
            if (err) throw err;
            console.log('✘ Employee has been yeeted! ✘')
            console.table(data)
            runDatabase()
        })
    })
}

function updateEmployeeRole() {
    console.log(figlet.textSync('Update Employee', {
        font: 'slant',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }));

    inquirer.prompt([
        {
            type: 'input',
            name:'employeeId',
            message: "What's the employees ID you want to update? (Required)",
            validate: employeeId => {
                if (employeeId) {
                  return true;
                } else {
                  console.log('Please enter a valid ID.');
                  return false;
                }
              }
        
        },
        {
            type: 'list',
            name: 'roleId',
            message: "What would you like their new role ID to be?",
            choices: ['1', '2', '3', '4', '5', '6', '7', '8']
        }
    ])
    .then(data => {
        const sql = `UPDATE employees SET role_id = ? WHERE id = ?`
        const params = [data.roleId, data.employeeId]

        db.query(sql, params, (err, result) => {
            if(err) throw err
            console.log('✓ Employee has been updated! ✓')
            console.table(data)
            runDatabase()

        })

    })
}


runDatabase()


// validate: UserInput => {
//     if (UserInput) {
//       return true;
//     } else {
//       console.log('');
//       return false;
//     }
//   }