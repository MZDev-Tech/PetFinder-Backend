import express from 'express'
import {getAllFeedback,addFeedback,getFeedbackById,updateFeedback,deleteFeedback,singleFeedback} from '../Controllers/Feedback.js'
import multer from 'multer'


// Initialize multer for file uploads
const upload=multer({
dest:'uploads/',
});

const router = express.Router();

// Define routes
router.get('/getFeedback',getAllFeedback);
router.post('/add',upload.single('image'),addFeedback);
router.get('/:id',getFeedbackById);
router.put('/update/:id', upload.single('image'), updateFeedback);
router.delete('/:id', deleteFeedback);
router.get('/single/:id', singleFeedback);

export default router;
