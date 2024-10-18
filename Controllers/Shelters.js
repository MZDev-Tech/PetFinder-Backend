import multer from 'multer'


// Initialize multer for file uploads
const upload = multer({
dest:'uploads/',
});


// CRUD operations for shelters
export const getAllShelters= (req, res) => {
    const sql = "SELECT * FROM shelters";
    req.db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({ Message: 'Error inside server' });
      }
      res.json(result);
    });
  };
  
  //add Shelter code
  export const addShelters= (req, res) => {
    const sql = "INSERT INTO shelters (name, location, detail, image, link) VALUES (?, ?, ?,?,?)";
    const Values = [
      req.body.name,
      req.body.location,
      req.body.detail,
      req.file ? req.file.filename : null,
      req.body.link
  
    ];
  
    req.db.query(sql, Values, (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(result);
    });
  };
  
  
  //fetch & update shelters based on clicked id
  export const getSheltersById = (req, res) => {
    const sql = "SELECT * FROM shelters WHERE id = ?";
    req.db.query(sql, [req.params.id], (err, result) => {
      if (err) {
        return res.status(500).json( err );
      }
      res.json(result[0]); 
    });
  };
  
  export const updateShelters = (req, res) => {
    const { id } = req.params;
    const { name, location, detail, link } = req.body;
    const newImage = req.file ? req.file.filename : null; 
  
    // Fetch the current image filename
    const getCurrentImageQuery = "SELECT image FROM shelters WHERE id = ?";
    req.db.query(getCurrentImageQuery, [id], (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
  
      const currentImage = result[0]?.image;
  
      // Determine the image to be used
      const imageToUse = newImage || currentImage;
  
      // Update the shelter
      const updateQuery = `
        UPDATE shelters SET name = ?, location = ?, detail = ?, link = ?, image = ? WHERE id = ?`;
      const values = [name, location, detail, link, imageToUse, id];
  
      req.db.query(updateQuery, values, (err) => {
        if (err) {
          return res.status(500).json(err);
        }
        res.json({ message: 'Shelters updated successfully' });
      });
    });
  };
  
  
  //delete shelters based on id
  export const deleteShelters = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM shelters WHERE id = ?";
    req.db.query(sql, [id], (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({ message: 'Shelters deleted successfully.' });
    });
  };
  
  //view individiual shelters based on id
  export const singleShelter = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM shelters WHERE id = ?";
    req.db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching pet details' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(result[0]); 
    });
};
  
  