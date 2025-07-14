const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/employeeDB',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('MongoDB connected');
}).catch(err=>{
    console.error('MongoDB connection error:',err);
});

const employeeSchema = new mongoose.Schema({
    empId:{
        type:Number,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    department:String,
    designation:String,
    salary:Number
});

const Employee = mongoose.model('Employee',employeeSchema);

app.post('/add',async (req,res)=>{
    try{
        const newEmployee= new Employee(req.body);
        const result = await newEmployee.save();
        res.json({message:'Employee added',result});
    }catch (error){
        res.status(500).json({error});
    }
});

app.get('/employee/:empId',async(req,res)=>{
    try{
        const employee = await Employee.findOne({empId:req.params.rollNo});
        res.json(employee);
    }catch(error){
        res.status(500).json({error});
    }
});

app.put('/update/:empId',async(req,res)=>{
    try{
        const updated = await Employee.findOneAndUpdate(
            {empId:req.params.empId},
            req.body,
            {new:true}
        );
        res.json({message:'Employee Updated',updated});
    }catch(error){
        res.status(500).json({error});
    }
});

app.delete('/delete/:empId',async(req,res)=>{
    try{
        const deleted = await Employee.findOneAndDelete({empId:req.params.empId});
        res.json({message:'Employee deleted',deleted});
    }catch (error){
        res.status(500).json({error});
    }
});

app.listen(3000,(req,res)=>{
    console.log('Server running on http://localhost:3000');
});
