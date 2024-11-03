const asyncHandler = require('express-async-handler');
const Contact = require('../Models/contactModel');

//@desc Get all contacts
//@route Get /api/contacts
//@access private

const getContacts = asyncHandler( async (req, res)=>{
    const contacts = await Contact.find({user_id : req.user.id});
    res.status(200).json(contacts);
});

//@desc Get a single contact
//@routes GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    res.status(200).json(contact);
})

//@desc Create new contact
//@routes POST /api/contacts
//@access public
const postContact = asyncHandler(async (req, res)=>{
    console.log(req.body);
    const {name , email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatary");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id : req.user.id,
    });

    res.status(201).json(contact);
})

//@desc Update a single contact
//@routes PUT /api/contacts/:id
//@access public
const updateContact = asyncHandler(async(req, res)=>{
    //first of all we have to get the contact
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    //check if the user itself is trying to update the contact
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("Access Forbidden");

    }
    const updateContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true}
    );
    res.status(200).json(updateContact);
})

//@desc Delete a single contact
//@routes delete /api/contacts/:id
//@access public
const deleteContact = asyncHandler(async (req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    //check if the user itself is trying to update the contact
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("Access Forbidden");
    }
    await Contact.deleteOne({_id: req.params.id});
    res.status(200).json(contact);
})

module.exports = {getContacts, getContact, postContact, updateContact, deleteContact};
