const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

// Connect to MongoDB
mongoose.set('strictQuery', true); // for prevent warning
mongoose.connect('mongodb://127.0.0.1:27017/employees', { useNewUrlParser: true })

// Create employee schema
const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  status: { type: Boolean, default: false }
})

const Employee = mongoose.model('Employee', employeeSchema)

// Create employee
app.post('/employee', (req, res) => {
  const newEmployee = new Employee(req.body)
  newEmployee.save((err, employee) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(201).send(employee)
    }
  })
})

// Get all employees
app.get('/employees', (req, res) => {
  Employee.find({status: false}, (err, employees) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(employees)
    }
  })
})

// Get employee by id
app.get('/employee/:id', (req, res) => {
    Employee.findById(req.params.id, (err, employee) => {
      if (err) {
        res.status(500).send(err)
      } else if (!employee) {
        res.status(404).send("Employee not found")
      } else {
        res.status(200).send(employee)
      }
    })
})

// update employee details(without email fields)
app.patch('/employee/:id', (req, res) => {
    // remove the email field from the request body
    delete req.body.email;

    Employee.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, (err, employee) => {
      if (err) {
        res.status(500).send(err)
      } else if (!employee) {
        res.status(404).send("Employee not found")
      } else {
        res.status(200).send(employee)
      }
    })
})

// block employee
app.patch('/employee/:id/block', (req, res) => {
    Employee.findByIdAndUpdate(req.params.id, {$set: {status: true}}, {new: true}, (err, employee) => {
        if (err) {
            res.status(500).send(err)
        } else if (!employee) {
            res.status(404).send("Employee not found")
        } else {
            res.status(200).send(employee)
        }
    })
})


// unblock employee
app.patch('/employee/:id/unblock', (req, res) => {
    Employee.findByIdAndUpdate(req.params.id, {$set: {status: false}}, {new: true}, (err, employee) => {
        if (err) {
            res.status(500).send(err)
        } else if (!employee) {
            res.status(404).send("Employee not found")
        } else {
            res.status(200).send(employee)
        }
    })
})

// Delete employee by id
app.delete('/employee/:id', (req, res) => {
    Employee.findByIdAndDelete(req.params.id, (err, employee) => {
        if (err) {
            res.status(500).send(err)
        } else if (!employee) {
            res.status(404).send("Employee not found")
        } else {
            res.status(200).send("Employee deleted successfully")
        }
    })
})

// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000')
})
