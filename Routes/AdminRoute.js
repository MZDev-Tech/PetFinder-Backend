import express from 'express'
import {getAdmin,getAdminById,updateAdmin,adminLogin,Logout} from '../Controllers/Admin.js'
import multer from 'multer'
import { authenticateToken } from '../Middleware/authMiddleware.js'; // Import the middleware


// Initialize multer for file uploads
const upload=multer({
dest:'uploads/',
});

const router = express.Router();

// Define routes
router.get('/getAdmin',authenticateToken ,getAdmin);
router.get('/:id',authenticateToken, getAdminById);
router.put('/update/:id', upload.single('image'),authenticateToken , updateAdmin);
router.post('/adminLogin', adminLogin);
router.post('/logout', authenticateToken, Logout);


export default router;
