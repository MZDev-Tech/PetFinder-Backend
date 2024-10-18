import multer from 'multer'

const upload = multer({
    dest:'uploads/',
    });

// CRUD operations for user feedback
export const getAllFeedback = (req, res) => {
    const sql = "SELECT * FROM feedback";
    req.db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({ Message: 'Error inside server' });
      }
      res.json(result);
    });
  };
  
  
  //add Feedback code
  export const addFeedback = (req, res) => {
    const sql = "INSERT INTO feedback (name, location, detail, image) VALUES (?, ?, ?,?)";
    const Values = [
      req.body.name,
      req.body.location,
      req.body.detail,
      req.file ? req.file.filename : null
  
    ];
  
    req.db.query(sql, Values, (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(result);
    });
  };
  
  
  //fetch & update Feedback based on clicked id
  export const getFeedbackById = (req, res) => {
    const sql = "SELECT * FROM feedback WHERE id = ?";
    req.db.query(sql, [req.params.id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error! Something Went wrong while fetching feedback' });
      }
      res.json(result[0]); 
    });
  };
  
  export const updateFeedback =  (req, res) => {
    const { id } = req.params;
    const { name, location, detail } = req.body;
    const newImage = req.file ? req.file.filename : null; 
  
    // Fetch the current image filename
    const getCurrentImageQuery = "SELECT image FROM feedback WHERE id = ?";
    req.db.query(getCurrentImageQuery, [id], (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
  
      const currentImage = result[0]?.image;
        const imageToUse = newImage || currentImage;
  
      // Update the feedback
      const updateQuery = `UPDATE feedback SET name = ?, location = ?, detail = ?, image = ? WHERE id = ?`;
      const values = [name, location, detail, imageToUse, id];
  
      req.db.query(updateQuery, values, (err) => {
        if (err) {
          return res.status(500).json(err);
        }
        res.json({ message: 'feedback updated successfully' });
      });
    });
  };
  
  
  //delete feedback based on id
  export const deleteFeedback =  (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM feedback WHERE id = ?";
    req.db.query(sql, [id], (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({ message: 'feedback deleted successfully.' });
    });
  };
  
  //view individiual feedback based on id
 
export const singleFeedback = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM feedback WHERE id = ?";
    req.db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.length === 0) {
            return res.status(404).json(err);
        }
        res.json(result[0]); 
    });
};

  