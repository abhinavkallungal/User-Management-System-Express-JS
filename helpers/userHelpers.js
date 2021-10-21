const db= require('../config/connection');
const collections= require('../config/collections')
const bcrypt = require("bcrypt");
 
module.exports={
    checkEmail:(email)=>{
        return new Promise ((resolve,reject)=>{
            let length=email.length;
    
            if(email==''|| length==null){
                 err={
                    message:'field is required',
                    error:true
                }
                reject(err)
    
            }else if(length <4){
                 err= {

                    message:'invalid format',
                    error : true
                }
                reject(err)
            }else{
                var regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
                if(!regex.test(email)){
                    err={
                        message:"invalid format ",
                        error : true
                    }
                    reject(err)
    
                }else{
                    
                    error=false;
                    resolve(error)
                }
            }
        })
    },
    checkPassword:(password)=>{
        return new Promise((resolve,reject)=>{
            var minNumberofChars = 6;
            var maxNumberofChars = 16;
            var regularExpression  = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
            if(password.length < minNumberofChars || password.length > maxNumberofChars){
                console.log("1");
                err={
                    message:"Your password must be at least 6 characters ",
                    error : true
                }
                reject(err)
            }else if(!regularExpression.test(password)) {
                console.log("2");
                err={
                    message:"password should contain atleast one number or one special character",
                    error : true
                }
                reject(err)
            }else{
                console.log("3");

                resolve({error:false})

            }
        })

    },
  


    
    
    signUp:(data)=>{
        console.log("test");
        return new Promise(async(resolve,reject)=>{
            data.password = await bcrypt.hash(data.password,10);
            console.log(data);
            db.get().collection(collections.USER_COLLECTIONS).insertOne({email:data.email,password:data.password,status:true})
            .then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        })
        
    },

    login:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collections.USER_COLLECTIONS)
             .findOne({ email:data.email });
             console.log("1");

             if(user){
                console.log("2");

                bcrypt.compare(data.password,user.password).then((status)=>{
                    if(status){
                        console.log("3");
                        resolve({status:status,user:user})
                    }else{
                        console.log("4");

                        reject({message:"Invalid Emalil or Password",status:status})
                    }
                }).catch((err)=>{
                    console.log("err",err);

                })
             }else{
                console.log("5");

                reject({message:"Invalid Emalil or Password",status:false})
             }
        })
    }
}