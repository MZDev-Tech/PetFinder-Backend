import express from 'express'
import {getAllCategories,addCategory,getCategoryById,updateCategory,deleteCategory} from '../Controllers/category.js'
import multer from 'multer'


// Initialize multer for file uploads
const upload=multer({
dest:'uploads/',
});

const router = express.Router();

// Define routes
router.get('/getcategory',getAllCategories);
router.post('/add',upload.single('image'),addCategory);
router.get('/:id',getCategoryById);
router.put('/update/:id', upload.single('image'), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
