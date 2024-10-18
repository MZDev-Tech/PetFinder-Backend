import mysql from 'mysql'
import multer from 'multer'
import express from 'express'
import cors from 'cors'
import path from 'path'
import {FilePathToURL} from 'url'
import bcrypt from 'bcrypt'
import jwt from 'jwtwebtoken'
import dotenv from 'dotenv'

dotenv.config();



const app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const file=FilePathToURL(import.meta.url);
const directory=path.dirname(file);
app.use('upload',express.static(path.join(directory,'upload')));

const upload=multer({
dir:'upload',
});

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'pets',
});
app.use((req,res,next)=>{
    req.db=db;
    next();
})
//Curd operations

export const getData=(req,res)=>{
    const sql="select * from user";
    req.db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json(err);
        }
        return res.json(result);

    })
    
}

//add data
export const addData=async(req,res)=>{
    const{name,email,password}=req.body;
    const image=req.file?req.body.file:null;

    try{
        const hashPassword=await bcrypt.hash(password,10);
        const sql="insert into user (name,email,password,image) values(?,?,?,?)";
        const values=[name,email,hashPassword]
        req.db.query(sql,values,(err,result)=>{
            if(err){
                return res.status(500).json(err);
            }
            return res.json(result);
        })

    }catch(err){
        return res.status(500).json(err);
    }
}
//login user

export const userLogin=(req,res)=>{
    const {name,email,password}=req.body;

const sql="select * from user where email = ?";
req.db.query(sql,[email],async(err,result)=>{
    if(err){
        return res.status(500).json(err);
    }if(result.length==0){
        return res.status(404).json({message:'user not found'});
    }
    const user= result[0];
    
        const isPasswordValid=await bcrypt.compare(password,user.password);
         if(!isPasswordValid){
            return res.status(401).json({message:'password not match'});
         }
         //generate jwt token
         const token=jwt.sign({id:user.id,name:user.name,email:user.email},JWT_SECRET_KEY,{expiresIn:'1d'});
         res.json({message:'token generate successfully',token});
})

}



//get data based on id

export const getDataById=(req,res)=>{
    const{id}=params.id;
    const sql="select * from user where id=?";
    req.db.query(sql,id,(err,result)=>{
        if(err){
            return res.status(500).json(err);
        }
        return res.json(result);
    })

}

//update data

export const updateData=(req,res)=>{
    const{id}=params.id;
    const{name,email,password}=req.body;
    const newImage=req.file?req.body.file:null;

const ImageQuery="select image from user where id=?";
req.db.query(ImageQuery,id,(err,result)=>{
    if(err){
        return res.status(500).json(err);
    }
    currentImage=result[0]?.image;
    imageToUse= newImage || currentImage;
    const sql="update user set name=?, email=?,password=?,image=? where id=?";
    const values=[
        name,email,password,id
    ]
    req.db.query(sql,values,(err,result)=>{
        if(err){
            return res.status(500).json(err);
        }
        return res.json(result);
    })
})
}

export const deleteData=(req,res)=>{
    const sql="delete from user where id=?";
    req.db.query(sql,[req.params.id],(err,result)=>{
        if(err){
            return res.status(500).json(err);
        }
        res.json(result);
    })
}

export const singleData=(req,res)=>{
    const sql="select * from user where id=?";
    req.db.query(sql,[req.params.id],(err,result)=>{
        if(err){
            return res.status(500).json(err);
        }
        res.json(result[0]);
    })
}