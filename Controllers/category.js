import multer from 'multer'


// Initialize multer for file uploads
const upload = multer({
dest:'uploads/',
});


//Curd operations for category table
export const getAllCategories=(req,res)=>{
  const sql = "SELECT * FROM categories";
  req.db.query(sql,(err,result)=>{
    if(err){
      return res.status(500).json({Message:'Error Inside Server'});
    }
    res.json(result);
  });
};

// Add a new category
export const addCategory=(req,res)=>{
const sql="INSERT INTO categories(name,detail,image) VALUES(?,?,?)";
const Values=[
  req.body.name,
  req.body.detail,
  req.file ? req.file.filename:null,
];
 req.db.query(sql,Values, (err,result)=>{
if(err){
  return res.status(500).json(err);
}
res.json(result);
 });

};

//fetch & update category based on clicked id
export const getCategoryById=(req,res)=>{
const sql="SELECT * FROM categories where id=?";
req.db.query(sql,[req.params.id],(err,result)=>{
  if(err){
    return res.status(500).json(err);
  }
  res.json(result[0]);
});
};

// Update category by ID
export const updateCategory = (req, res) => {
  const { id } = req.params;
  const { name, detail } = req.body;
  const newImage = req.file ? req.file.filename : null;

  const getCurrentImageQuery = "SELECT image FROM categories WHERE id = ?";
  req.db.query(getCurrentImageQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error while fetching current image' });
    }

    const currentImage = result[0]?.image;
    const imageToUse = newImage || currentImage;

    const sql = "UPDATE categories SET name = ?, detail = ?, image = ? WHERE id = ?";
    const Values = [name, detail, imageToUse, id];
    req.db.query(sql, Values, (err, result) => {
      if (err) {
        console.error('Error updating category:', err);
        return res.status(500).json({ message: 'Error updating category' });
      }
      res.json({ message: 'Category updated successfully' });
    });
  });
};


//Delete category
export const deleteCategory=(req,res)=>{
const {id}=req.params;
const sql="DELETE FROM categories WHERE id=?";
req.db.query(sql,[id],(err,result)=>{
  if(err){
    return res.status(500).json(err);
  }
  res.json({ message: 'Category deleted successfully.' });
});
};