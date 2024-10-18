import express from 'express'
import {getAllPets,addPets,getPetsById,updatePets,deletePets,singlePets} from '../Controllers/Pets.js'
import multer from 'multer'


// Initialize multer for file uploads
const upload=multer({
dest:'uploads/',
});

const router = express.Router();

// Define routes
router.get('/getPets',getAllPets);
router.post('/add',upload.single('image'),addPets);
router.get('/:id',getPetsById);
router.put('/update/:id', upload.single('image'), updatePets);
router.delete('/:id', deletePets);
router.get('/singlePet/:id', singlePets);


export default router;
