const express = require('express');
const router = express.Router();
const {getContacts, getContact, postContact, updateContact, deleteContact } = require('../controllers/contactController');
const validateToken = require('../middleware/validateTokenHandler');

//Validating all routes using the access jwt token
router.use(validateToken);
//GET ALL Contacts
router.route("/").get(getContacts);
//GET CONTACT ROUTE
router.route("/:id").get(getContact);
//POST ROUTE
router.route("/").post(postContact);
//PUT ROUTE
router.route("/:id").put(updateContact);
//DELETE ROUTE
router.route("/:id").delete(deleteContact);

module.exports = router;