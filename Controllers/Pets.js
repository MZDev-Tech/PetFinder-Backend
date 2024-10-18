import multer from 'multer'

// Initialize multer for file uploads
const upload = multer({
    dest: 'uploads/',
});


// CRUD operations for Pets
export const getAllPets = (req, res) => {
    const sql = "SELECT * FROM pet";
    req.db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ Message: 'Error inside server' });
        }
        res.json(result);
    });
};

//add pets code
export const addPets = (req, res) => {
    const sql = "INSERT INTO pet (pet, category, age, price, breed, gender, health, size, color, location, publish_date, energylevel, friendliness, ease_of_training, vendor, status, detail, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const Values = [
        req.body.pet,
        req.body.category,
        req.body.age,
        req.body.price,
        req.body.breed,
        req.body.gender,
        req.body.health,
        req.body.size,
        req.body.color,
        req.body.location,
        req.body.publish_date,
        req.body.energylevel,
        req.body.friendliness,
        req.body.ease_of_training,
        req.body.vendor,
        req.body.status,
        req.body.detail,
        req.file ? req.file.filename : null
    ];

    req.db.query(sql, Values, (err, result) => {
        if (err) {
            console.error('Error during database insert:', err);
            return res.status(500).json(err);
        }
        res.json(result);
    });
};



//fetch & update pet based on clicked id
export const getPetsById = (req, res) => {
    const sql = "SELECT * FROM pet WHERE id = ?";
    req.db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result[0]);
    });
};

//update pet based on clicked id

export const updatePets = (req, res) => {
    const { id } = req.params;
    const { pet, category, age, price, breed, gender, health, size, color, location, publish_date, energylevel, friendliness, ease_of_training, vendor, status, detail } = req.body;
    const newImage = req.file ? req.file.filename : null;

    const getCurrentImageQuery = "SELECT image FROM pet WHERE id = ?";
    req.db.query(getCurrentImageQuery, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        const currentImage = result[0]?.image;
        // Determine the image to be used
        const imageToUse = newImage || currentImage;

        // Update the pet
        const updateQuery = `
        UPDATE pet SET pet=?,	category=?,	age=?,	price=?,	breed=?,	gender=?,	health=?,	size=?,	color=?,	location=?,	publish_date=?,	energylevel=?,	friendliness=?,	ease_of_training=?,	vendor=?,	status=?,	detail=?, image=? WHERE id = ?`;
        const values = [pet, category, age, price, breed, gender, health, size, color, location, publish_date, energylevel, friendliness, ease_of_training, vendor, status, detail, imageToUse, id];

        req.db.query(updateQuery, values, (err) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json({ message: 'Pets updated successfully' });
        });
    });
};


//delete pets based on id
export const deletePets = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM pet WHERE id = ?";
    req.db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: 'Pets deleted successfully.' });
    });
};

//view single pet detail based on id

export const singlePets = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM pet WHERE id = ?";
    req.db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(result[0]); 
    });
};
