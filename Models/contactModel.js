const mongoose = require('mongoose');

//created schema
const contactSchema = mongoose.Schema({

    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
    },
    name:{
        type: String,
        required : [true, "Please add the contact name"],
    },
    email:{
        type: String,
        required : [true, "Please add the email"],
    },
    phone:{
        type: String,
        required : [true, "Please add the contact number"]
    }
},
{
    timestamps : true,
})

//Created model
const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;