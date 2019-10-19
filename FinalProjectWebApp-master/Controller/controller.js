const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const passport = require("passport");
const models = require('../models');
const app = require('../app');

const user = mongoose.model('user', models.UserSchema, "Users");

const staff = mongoose.model("staff", models.StaffSchema, "Users");

const save = mongoose.model('saveProfile', models.SignUpSchema,"Users");

const signUp = mongoose.model('signUp', models.SignUpSchema);

const signUpUser = (req, res) =>{   
    
    const newUsername = req.body.username;
    const newPassword = req.body.password;
    const newFullName = req.body.fullName;
    const newEmail = req.body.email;
    const newContactNumber = req.body.contactNumber;
    const newBillingAddress = req.body.billingAddress;
    const newDeliveryAddress = req.body.deliveryAddress;
    const newUserType = "User";

    let newUser = new user({
        _id: new mongoose.Types.ObjectId(),
        username: newUsername,
        password: newPassword,
        userType: newUserType,
        fullName: newFullName,
        email: newEmail,
        contactNumber: newContactNumber,
        billingAddress: newBillingAddress,
        deliveryAddress: newDeliveryAddress,
    });
    
    bcrypt.genSalt(10,function(err, salt){
        bcrypt.hash(newUser.password, salt,null, function(err, hash){
            if(err){
                console.log(err);
            }
            newUser.password = hash;
            console.log(newUser);
            newUser.save(function(err){
                if(err){
                    console.log(err);
                    return;
                }else{
                   res.redirect('/'); //{user: newUser},
                }
            })
        })
    });
    
};
const login = (req,res,next)=>{
    passport.authenticate('local', function(err, user, info){
        if(err) {
            return next(err);
        }
        if(!user){ 
            return res.redirect('/login');
        }
        req.logIn(user, {session:true }, function(err){
            if(err) {return next(err)};
            return res.redirect('/'); 
        });
    })(req,res,next);
}

const activeUser = async (req,res) => {
    try{
        let currUser = await user.findById(req.session.passport.user);
        return currUser;
        }
    catch(err){
        return;
    }
    
}

const saveProfile = async (req,res)=>{
    
    const newUsername = req.body.username;
    const newPassword = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if(newPassword != confirmPassword){res.redirect("/profile")}
    const newFullName = req.body.fullName;
    const newEmail = req.body.email;
    const newContactNumber = req.body.contactNumber;
    const newBillingAddress = req.body.billingAddress;
    const newDeliveryAddress = req.body.deliveryAddress;
    const newUserType = "User";
    
    bcrypt.genSalt(10,function(err, salt){
        bcrypt.hash(newPassword, salt,null, async function(err, hash){
            if(err){
                console.log(err);
            }
            var query = req.session.passport.user
            var oldDetails = await save.findById(query);
            console.log("THIS IS THE OLD DETAILS: " + oldDetails);
            await save.updateOne(oldDetails, {username: oldDetails.username, 
                password: hash,
                userType: oldDetails.userType,
                fullName: newFullName, 
                email: newEmail,
                contactNumber: newContactNumber,
                billingAddress: newBillingAddress,
                deliveryAddress: newDeliveryAddress});
                var newDetails = await save.findById(query);
            let tempUser = await activeUser(req,res);
            console.log("active user post update: " + tempUser);
        })
        
    });
    return 1;
};


const findStaffAccounts = async (req, res)=>{
    staffFound = await staff.find({userType: "Staff"});
    console.log(staffFound);
    return staffFound;
}

//const Product = mongoose.model('product', models.productSchema);
module.exports = {
    signUpUser, login, activeUser, saveProfile, findStaffAccounts
}