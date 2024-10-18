import express from 'express'
import {getAllUser,addUser,getUserById,updateUser,deleteUser,loginUser,verifyToken} from '../Controllers/User.js'


const router = express.Router();

// Define routes
router.get('/getUser',getAllUser);
router.post('/add',addUser);
router.get('/:id',getUserById);
router.put('/update/:id',  updateUser);
router.delete('/:id', deleteUser);
router.post('/login', loginUser);  
router.post('/verify-token',verifyToken); 
 
export default router;
