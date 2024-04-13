// Task1: initiate app and run server at 3000

const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose');
const path=require('path');

const app = express();
const PORT = process.env.port;
const URI = process.env.uri;
console.log(URI);

app.listen(PORT, ()=>{
    console.log(`server running on port:${PORT}`);
})

//Express json Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
// Task2: create mongoDB connection 

const employee = require('./models/employeeModel');

async function run(){
    try {
        await mongoose.connect(URI);
        console.log("Connected to MongoDB using Mongoose!");
    } catch (error) {
        console.error("Connection error:", error);
    }
    
}

run();


//Task 2 : write api with error handling and appropriate api mentioned in the TODO below







//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist', async (req,res)=>{
    try {
        const employees = await employee.find();
        res.json(employees);
    } catch (error) {
        console.error("error getting employee list", error);
        res.status(500);
    }
})


//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id',async(req,res)=>{
    const empId = req.params.id;
   try {
    const employeDetail = await employee.findById(empId);
    if(!employeDetail){
        return res.status(404).json({error:'employee not found'});
    }
    res.json(employeDetail);
    
   } catch (error) {
    console.error('Error retrieving employee data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
   }

});



//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post('/api/employeelist', async(req,res)=>{
    try {
        const {name, location, position, salary} = req.body;
        if (!name || !location || !position || !salary) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newEmployee = new employee({
            name,
            location,
            position,
            salary
        });
        await newEmployee.save();
        res.status(201).json({success:true});

    } catch (error) {
        console.error('Error inserting employee data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})





//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete('/api/employeelist/:id', async(req,res)=>{
    const empId = req.params.id;
    try {
        const empDelete = await employee.deleteOne({_id: empId});
        if (empDelete.deletedCount === 0 ){
            return res.status(404).json({error: 'Employee not found'});
        }
        res.json({success:true})
    } catch (error) {
        onsole.error('Error deleting employee data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    } 
})



//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put('/api/employeelist', async(req,res)=>{
    const empId = req.body._id;
    try {
        const employeUpdate = await employee.findById(empId);

        if(!employeUpdate){
            return res.status(404).json({error: 'employee not found'});
        }

        employeUpdate.name = req.body.name || employeUpdate.name;
        employeUpdate.location = req.body.location || employeUpdate.location;
        employeUpdate.position = req.body.position || employeUpdate.position;
        employeUpdate.salary = req.body.salary || employeUpdate.salary;
        await employeUpdate.save();
        res.json({ success: true });

    } catch (error) {
        console.error('Error updating employee data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });  
    }
})

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});



