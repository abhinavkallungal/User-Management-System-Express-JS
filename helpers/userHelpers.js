const db= require('../config/connection');
const collections= require('../config/collections')
const bcrypt = require("bcrypt");
var objectId=require('mongodb').ObjectID
 
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
                        message:"Please enter a valid email address.",
                        error : true
                    }
                    reject(err)
    
                }else{
                    
                    
                    resolve({error:false})
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
                    message:"Password should contain atleast one number or one special character",
                    error : true
                }
                reject(err)
            }else{
                console.log("3");

                resolve({error:false})

            }
        })

    },

    checkEmailExist:(email)=>{
        return new Promise (async(resolve,reject)=>{
            await db.get().collection(collections.USER_COLLECTIONS).findOne({email:email}).then((response)=>{
                if(response===null){
                    resolve({error:false})
                }else{
                    reject({error:true,message:"Email alrady Exist",id:response._id})
                }
            }).catch((err)=>{
                console.log(err);
            })
        })
    },
  


    
    signUp:(data)=>{
        return new Promise(async(resolve,reject)=>{
            data.password = await bcrypt.hash(data.password,10);
            console.log(data);
            db.get().collection(collections.USER_COLLECTIONS).insertOne({email:data.email,password:data.password,status:"Active"})
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
             
             if(user){
                bcrypt.compare(data.password,user.password).then((logedIn)=>{
                    if(logedIn){
                        resolve({logedIn,user})
                    }else{
                        reject({message:"Invalid Emalil or Password",logedIn})
                    }
                }).catch((err)=>{
                    reject({message:"Invalid Emalil or Password",logedIn:false})
                })
             }else{
                reject({message:"Invalid Emalil or Password",logedIn:false})
             }
        })
    },

    getUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users = await db.get().collection(collections.USER_COLLECTIONS).find().toArray()
            if(users.length===0){
                reject({message:"users not found"});
            }else{
                console.log("test");
                resolve(users);
            }
        })
    },
    deleteUser:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTIONS).remove({_id:objectId(id)}).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err);
            })
        })
    },
    getUser:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTIONS).findOne({_id:objectId(id)}).then((user)=>{
                resolve(user)
            }).catch((err)=>{
                reject(err)
            })
        })
    },
    editUser:(details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTIONS).updateOne({ _id: objectId(details.id) }, {
                $set: {
                    email: details.email,
                    status: details.status
                }
            }).then((response) => {
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        })
    },
    checkStatus:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTIONS).findOne({_id:objectId(id)}).then((user)=>{
                resolve(user)
            }).catch((err)=>{
                reject(err)
            })
        })
    }
}