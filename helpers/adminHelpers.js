const collections = require('../config/collections');
const db = require('../config/connection');
const bcrypt = require('bcrypt')


module.exports={
    login:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collections.ADMIN_COLLECTIONS)
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
}