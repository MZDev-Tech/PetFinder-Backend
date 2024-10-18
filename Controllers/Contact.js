import { MulterError } from "multer";

// CRUD operations for Contact
export const getAllContact = (req, res) => {
    const sql = "SELECT * FROM contact";
    req.db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json(MulterError);
      }
      res.json(result);
    });
  };
  
  //add contact code
  export const addContact = (req, res) => {
    const sql = "INSERT INTO contact (name, email,phone,message) VALUES (?, ?, ?,?)";
    const Values = [
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.message,
  
    ];

    req.db.query(sql, Values, (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(result);
    });
  };