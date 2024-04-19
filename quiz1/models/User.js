const mongoose=require('mongoose');

const UserSchema =new mongoose.Schema({
name: String,
email: String,
password: String,
admin:{type: Boolean, default:false},
createdAt:{
    type:Date,
    default: Date.now
},

});
const Users=mongoose.model('Users', UserSchema);
module.exports=Users;