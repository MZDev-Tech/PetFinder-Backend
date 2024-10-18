import express from 'express'
import {getAllShelters,addShelters,getSheltersById,updateShelters,deleteShelters,singleShelter} from '../Controllers/Shelters.js'
import multer from 'multer'


// Initialize multer for file uploads
const upload=multer({
dest:'uploads/',
});

const router = express.Router();

// Define routes
router.get('/getShelters',getAllShelters);
router.post('/add',upload.single('image'),addShelters);
router.get('/:id',getSheltersById);
router.put('/update/:id', upload.single('image'), updateShelters);
router.delete('/:id', deleteShelters);
router.get('/singleShelter/:id', singleShelter);


export default router;
