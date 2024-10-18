import express from 'express'
import {countPets,countContact,countUsers,countAdoptions} from '../Controllers/Dashboard.js'


const router = express.Router();

// Define routes
router.get('/totalPets',countPets);
router.get('/totalUsers',countUsers);
router.get('/totalContact',countContact);
router.get('/totalAdoptions',countAdoptions);



export default router;
