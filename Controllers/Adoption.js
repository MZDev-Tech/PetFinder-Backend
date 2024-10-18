// adoptionController.js
import multer from 'multer';
import Stripe from 'stripe';
import shortid from 'shortid'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.Stripe_Key);

// Initialize multer for file uploads
const upload = multer({
  dest: 'uploads/',
});

// CRUD operations for adoption
export const getAllAdoption = (req, res) => {
  const sql = "SELECT * FROM adoption";
  req.db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ Message: 'Error inside server' });
    }
    res.json(result);
  });
};

// Fetch a single adoption record by orderNumber
export const getAdoptionByOrderNumber = (req, res) => {
  const { orderNumber } = req.params;  
  const sql = "SELECT * FROM adoption WHERE orderNumber = ?";  
  req.db.query(sql, [orderNumber], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error inside server' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Adoption record not found' });  
    }
    res.json(result[0]);  
  });
};


// Create PaymentIntent
export const sendPayment = async (req, res) => {
  const { adoptionData } = req.body;
  console.log('image for adopation',adoptionData.image);

  if (!adoptionData) {
    return res.status(400).json({ error: 'No adoption data found' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'pkr',  
            product_data: {
              name: `Adopted Pet: ${adoptionData.pet}`,   // Pet name 
              description:`Pet Category: ${ adoptionData.category}`,  // Category of the pet 
              images: [adoptionData.image], // Pet image URL to display on top
            },
            unit_amount: adoptionData.payment_amount * 100, // Stripe expects the amount in cents (multiply by 100)
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}', // Pass the session ID to the success page
      cancel_url: 'http://localhost:3000/cancel',
      metadata: {
        adoptionData: JSON.stringify(adoptionData), // Add adoption data here
      },

    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session", error);
    res.status(500).json({ error: 'Something went wrong creating the session' });
  }
};


export const getSessionDetails = async (req, res) => {
  const { session_id } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.json(session);
  } catch (error) {
    console.error('Error retrieving Stripe session', error);
    res.status(500).json({ error: 'Failed to retrieve Stripe session' });
  }
};


export const addAdoption = async (req, res) => {
  const { adoptionData, payment_id, payment_amount } = req.body; // Accept user_id from the request

  // Basic validation
  if (!adoptionData || !payment_id || !payment_amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const ImageName = adoptionData.image.split('/').pop(); // Extract just the image name
  const orderNumber = `ADOPT-${shortid.generate()}`; // Generate a unique order number

  // Check if an adoption with the same payment_id already exists
  const checkQuery = 'SELECT * FROM adoption WHERE payment_id = ?';
  req.db.query(checkQuery, [payment_id], (err, results) => {
    if (err) {
      console.error('Error checking for duplicate adoption', err);
      return res.status(500).json({ error: 'Failed to check for duplicate adoption' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Adoption request for this session has already been processed' });
    }

    const sql = `
      INSERT INTO adoption 
      (user_id, pet, category, fee, user, email, contact, city, shippingAddress, previous_pet, experience, house, petspace, payment_id, payment_amount, payment_currency, delivery_status, image, orderNumber) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      adoptionData.user_id,
      adoptionData.pet,
      adoptionData.category,
      adoptionData.fee,
      adoptionData.user,
      adoptionData.email,
      adoptionData.contact,
      adoptionData.city,
      adoptionData.shippingAddress,
      adoptionData.previousPet,
      adoptionData.experience,
      adoptionData.house,
      adoptionData.petSpace,
      payment_id,
      payment_amount,
      'Pkr', // Assuming the currency is always Pkr
      'Pending', // Delivery status
      ImageName,
      orderNumber,
    ];

    console.log("SQL Query:", sql);
    console.log("Values:", values);

    req.db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error saving adoption data', err);
        return res.status(500).json({ error: 'Failed to save adoption data' });
      }
      res.json({ message: 'Adoption saved successfully', orderNumber, result });

      console.log(result);
    });
  });
};




export const getAdoptionById = (req, res) => {
  const sql = "SELECT * FROM adoption WHERE id = ?";
  req.db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result[0]);
  });
};

export const updateAdoption = (req, res) => {
  const { id } = req.params;
  const { delivery_status } = req.body;

  const updateQuery = `UPDATE adoption SET delivery_status = ? WHERE id = ?`;
  const values = [delivery_status, id];

  req.db.query(updateQuery, values, (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({ message: 'Delivery Status updated successfully' });
  });
};

export const deleteAdoption = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM adoption WHERE id = ?";
  req.db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({ message: 'Adoption Request deleted successfully.' });
  });
};

export const singleAdoption = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM adoption WHERE id = ?";
  req.db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching pet adoption details' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }
    res.json(result[0]);
  });
};


export const trackYourOrder = (req, res) => {
  const { orderNumber, contact } = req.body;

  if (!orderNumber || !contact) {
    return res.status(400).json({ message: 'Order number and contact are required to proceed' });
  }


  const sql = "SELECT * FROM adoption WHERE orderNumber = ? AND contact = ?";
  console.log('Executing SQL:', sql, [orderNumber, contact]);

  req.db.query(sql, [orderNumber, contact], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: 'Server Error' });
    }


    if (result.length > 0) {
      return res.status(200).json({ message: 'Order found', adoptionDetails: result[0] });
    } else {
      return res.status(404).json({ message: 'Order not found.' });
    }
  });
};

