const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// user creation 

const UserSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    userType:{
        type:String,
        required: true
    },
    fullName:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    contactNumber:{
        type:String,
        required: true
    },
    billingAddress:{
        type:String,
        required: true
    },
    deliveryAddress:{
        type:String,
        required: true
    },
});

// user signup 

const SignUpSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username:{
        type:String,
        required:"Enter a username",
    },
    password:{
        type:String,
        required:"Enter a password",
    },
    userType:{
        type:String,
        required: false
    },
    fullName:{
        type:String,
        required: "Enter your full name"
    },
    email:{
        type:String,
        required: "Enter your email address"
    },
    contactNumber:{
        type:String,
        required: "Enter your contact number"
    },
    billingAddress:{
        type:String,
        required: "Enter your billing address"
    },
    deliveryAddress:{
        type:String,
        required: "Enter your deliver address"
    },
});

const StaffSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required: true
    },
    fullName:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    workNumber:{
        type:String,
        required: true
    },
    mobileNumber:{
        type:String,
        required: true
    },
    address:{
        type:String,
        required: true
    }
});

var ProductSchema = new Schema({
   
    image:{
        type:String,
        required: 'Upload an image',
    },
    name:{
        type: String,
        required: 'Enter the name of the product',
    },
    price:{
        type: Number,
        required: 'Enter the price of the product',
    },
    description:{
        type: String,
        required: 'Enter description of the product'
    },
    category:{
        type: String,
        required: 'Enter a category of the product'
    }

}); 
module.exports = mongoose.model('products', ProductSchema);

function Cart(oldCart){
    this.items =oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.name = oldCart.name;
    this.add = function(item, id){
        var storedItem= this.items[id];
        if (!storedItem){
            storedItem= this.items[id] = {item: item, qty:0, price:0, name: item.name};
        }
        storedItem.qty++;
        storedItem.price= storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };
    this.generateArray = function(){
         var arr = [];
         for( var id in this.items){
             arr.push(this.items[id])
         }
         return arr;
    };
};

module.exports = {
    ProductSchema, SignUpSchema, UserSchema, StaffSchema, Cart
}