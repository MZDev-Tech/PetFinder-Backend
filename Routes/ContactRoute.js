import express from 'express'
import {getAllContact,addContact} from '../Controllers/Contact.js'


const router = express.Router();

// Define routes
router.get('/getContact',getAllContact);
router.post('/add',addContact);


export default router;
