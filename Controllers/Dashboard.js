// Count total pets
export const countPets = async (req, res) => {
    const sql = 'SELECT COUNT(*) AS totalPets FROM pet';
    req.db.query(sql, (err, result) => {
      if (err) {
        console.error('Error counting pets:', err);
        return res.status(500).json({ message: 'Error inside server' });
      }
      res.json(result[0]); // Assuming result[0] contains the count
    });
  };
  
  // Count total contacts
  export const countContact = async (req, res) => {
    const sql = 'SELECT COUNT(*) AS totalMessages FROM contact';
    req.db.query(sql, (err, result) => {
      if (err) {
        console.error('Error counting messages:', err);
        return res.status(500).json({ message: 'Error inside server' });
      }
      res.json(result[0]); // Assuming result[0] contains the count
    });
  };
  
  // Count total users
  export const countUsers = async (req, res) => {
    const sql = 'SELECT COUNT(*) AS totalUsers FROM user';
    req.db.query(sql, (err, result) => {
      if (err) {
        console.error('Error counting users:', err);
        return res.status(500).json({ message: 'Error inside server' });
      }
      res.json(result[0]); // Assuming result[0] contains the count
    });
  };
  
  // Count total adoption requests
  export const countAdoptions = async (req, res) => {
    const sql = 'SELECT COUNT(*) AS totalAdoptions FROM adoption';
    req.db.query(sql, (err, result) => {
      if (err) {
        console.error('Error counting adoptions:', err);
        return res.status(500).json({ message: 'Error inside server' });
      }
      res.json(result[0]); // Assuming result[0] contains the count
    });
  };
  