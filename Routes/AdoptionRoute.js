import express from 'express'
import {getAllAdoption,addAdoption,getAdoptionById,updateAdoption,deleteAdoption,singleAdoption,trackYourOrder,sendPayment,getAdoptionByOrderNumber,getSessionDetails } from '../Controllers/Adoption.js'
import multer from 'multer'


// Initialize multer for file uploads
const upload=multer({
dest:'uploads/',
});

const router = express.Router();

// Define routes
router.get('/getAdoption',getAllAdoption);
router.post('/add',upload.single('image'),addAdoption);
router.post('/track',trackYourOrder);
router.get('/:id',getAdoptionById);
router.put('/update/:id', updateAdoption);
router.delete('/:id', deleteAdoption);
router.get('/singleAdoption/:id', singleAdoption);
router.post('/create-checkout-session',sendPayment );
router.get('/get-session/:session_id', getSessionDetails);
router.get('/get/:orderNumber', getAdoptionByOrderNumber);



export default router;
