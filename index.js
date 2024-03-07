const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors"); 
const path = require('path'); // Import the path module
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
const con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'ezhila47',
    database:'delivery'
})
app.use(express.urlencoded({ extended: true }));

con.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("connected to a database");
    }
});

  app.get('/inventory', (req, res) => {
    const query = 'SELECT * FROM inventory';

    // Execute the query
    con.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        // Send the results as JSON
        res.json(results);
    });
});
app.get('/reports', (req, res) => {
    const query = 'SELECT * FROM reports';

    // Execute the query
    con.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        // Send the results as JSON
        res.json(results);
    });
});

// app.put("/inventory/:id", (req, res) => {
//     const itemId = req.params.id;
//     const updateData = req.body;

//     // Update inventory item
//     const updateSql = "UPDATE inventory SET ? WHERE id = ?";
//     con.query(updateSql, [updateData, itemId], (err, result) => {
//         if (err) {
//             console.error("Error updating inventory:", err);
//             res.status(500).json({ error: "Internal server error" });
//         } else {
//             // Move item to reports
//             const moveSql = "INSERT INTO reports SELECT name, category, damaged, quantity, CURDATE(), ? FROM inventory WHERE id = ?";
//             con.query(moveSql, ['Damaged', itemId], (err, result) => {
//                 if (err) {
//                     console.error("Error moving item to reports:", err);
//                     res.status(500).json({ error: "Internal server error" });
//                 } else {
//                     // Remove item from inventory
//                     const deleteSql = "DELETE FROM inventory WHERE id = ?";
//                     con.query(deleteSql, itemId, (err, result) => {
//                         if (err) {
//                             console.error("Error removing item from inventory:", err);
//                             res.status(500).json({ error: "Internal server error" });
//                         } else {
//                             res.status(200).json({ message: "Inventory updated successfully" });
//                         }
//                     });
//                 }
//             });
//         }
//     });
// });

app.post("/update-data", (req, res) => {
    const { id } = req.body;
    // Query to select the item from the inventory table
    const selectQuery = `SELECT * FROM inventory WHERE id = ${id}`;
    con.query(selectQuery, (err, result) => {
        if (err) {
            console.error("Error selecting item from inventory:", err);
            res.status(500).json({ error: "Error selecting item from inventory" });
        } else {
            const inventoryItem = result[0];
            // Query to insert the item into the reports table
            const insertQuery = `INSERT INTO reports (name, category, damaged, quantity, delivered_date, damage_status) VALUES (?, ?, ?, ?, NOW(), ?)`;
            const values = [inventoryItem.name, inventoryItem.category, inventoryItem.damaged, inventoryItem.quantity, inventoryItem.damaged ? "Damaged" : "Not Damaged"];
            con.query(insertQuery, values, (err, result) => {
                if (err) {
                    console.error("Error inserting item into reports:", err);
                    res.status(500).json({ error: "Error inserting item into reports" });
                } else {
                    // Query to delete the item from the inventory table
                    const deleteQuery = `DELETE FROM inventory WHERE id = ${id}`;
                    con.query(deleteQuery, (err, result) => {
                        if (err) {
                            console.error("Error deleting item from inventory:", err);
                            res.status(500).json({ error: "Error deleting item from inventory" });
                        } else {
                            res.status(200).json({ message: "Data updated successfully" });
                        }
                    });
                }
            });
        }
    });
});
// app.post('/addTask/:id', (req, res) => {
//     const id = req.params.id;
  
//     // Query the inventory table based on the id parameter
//     const query = 'SELECT name, category, quantity FROM inventory WHERE id = ?';
//     con.query(query, [id], (error, results) => {
//       if (error) {
//         console.error('Error querying inventory:', error);
//         res.status(500).json({ error: 'Internal server error' });
//         return;
//       }
  
//       if (results.length === 0) {
//         // If no inventory item with the specified id is found, return a 404 error
//         res.status(404).json({ error: 'Inventory item not found' });
//         return;
//       }
  
//       // Insert the retrieved data into the task table
//       const taskData = results[0]; // Assuming only one result is expected
//       const insertQuery = 'INSERT INTO task (name, category, quantity) VALUES (?, ?, ?)';
//       con.query(insertQuery, [taskData.name, taskData.category, taskData.quantity], (err) => {
//         if (err) {
//           console.error('Error inserting data into task table:', err);
//           res.status(500).json({ error: 'Internal server error' });
//           return;
//         }
  
//         // If insertion is successful, send a success response
//         res.status(200).json({ message: 'Data added to task table successfully' });
//       });
//     });
//   });

app.post('/addTask', (req, res) => {
    const { id } = req.body;
  
    // Query the inventory table based on the id parameter
    const query = 'SELECT name, category, quantity FROM inventory WHERE id = ?';
    con.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error querying inventory:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      if (results.length === 0) {
        // If no inventory item with the specified id is found, return a 404 error
        res.status(404).json({ error: 'Inventory item not found' });
        return;
      }
  
      // Insert the retrieved data into the task table
      const taskData = results[0]; // Assuming only one result is expected
      const insertQuery = 'INSERT INTO task (name, category, quantity) VALUES (?, ?, ?)';
      con.query(insertQuery, [taskData.name, taskData.category, taskData.quantity], (err) => {
        if (err) {
          console.error('Error inserting data into task table:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
  
        // If insertion is successful, send a success response
        res.status(200).json({ message: 'Data added to task table successfully' });
      });
    });
  });


  app.get('/tasks', (req, res) => {
    // SQL query to select all rows from the task table
    const query = 'SELECT * FROM task';
  
    // Execute the query
    con.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      // Send the fetched data as JSON response
      res.json(results);
    });
  });

  app.post('/process-task', (req, res) => {
    const { name } = req.body;
  
    // Query to find the task by name
    const findTaskQuery = 'SELECT * FROM task WHERE name = ?';
  
    // Execute the query to find the task
    con.query(findTaskQuery, [name], (err, tasks) => {
      if (err) {
        console.error('Error finding task:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      // If no task found with the given name, return a 404 error
      if (tasks.length === 0) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
  
      const task = tasks[0]; // Assuming only one task is expected
  
      // Query to find the corresponding item in the inventory
      const findInventoryItemQuery = 'SELECT * FROM inventory WHERE name = ?';
  
      // Execute the query to find the inventory item
      con.query(findInventoryItemQuery, [name], (err, inventoryItems) => {
        if (err) {
          console.error('Error finding inventory item:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
  
        // If no inventory item found with the given name, return a 404 error
        if (inventoryItems.length === 0) {
          res.status(404).json({ error: 'Inventory item not found' });
          return;
        }
  
        const inventoryItem = inventoryItems[0]; // Assuming only one inventory item is expected
  
        // Insert the relevant data into the reports table
        const insertReportQuery = `
            INSERT INTO reports (name, category, damaged, quantity, delivered_date, damage_status) 
            VALUES (?, ?, ?, ?, CURDATE(), ?)
          `;
        const { name, category, damaged, quantity } = inventoryItem;
        const damageStatus = damaged ? 'Damaged' : 'Not Damaged';
  
        // Execute the query to insert data into the reports table
        con.query(insertReportQuery, [name, category, damaged, quantity, damageStatus], (err) => {
          if (err) {
            console.error('Error inserting data into reports:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
          }
  
          // Delete the task from the task table
          const deleteTaskQuery = 'DELETE FROM task WHERE name = ?';
  
          // Execute the query to delete the task
          con.query(deleteTaskQuery, [name], (err) => {
            if (err) {
              console.error('Error deleting task:', err);
              res.status(500).json({ error: 'Internal server error' });
              return;
            }
  
            // Delete the inventory item from the inventory table
            const deleteInventoryItemQuery = 'DELETE FROM inventory WHERE name = ?';
  
            // Execute the query to delete the inventory item
            con.query(deleteInventoryItemQuery, [name], (err) => {
              if (err) {
                console.error('Error deleting inventory item:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
              }
  
              res.status(200).json({ message: 'Task processed successfully' });
            });
          });
        });
      });
    });
  });
  app.post('/submit-form', (req, res) => {
    const { name, category, damaged, perishable, expiryDate, quantity } = req.body;
  
    // Insert data into the inventory table
    const insertQuery = `INSERT INTO inventory (name, category, damaged, perishable, expiryDate, quantity) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [name, category, damaged, perishable, expiryDate, quantity];
  
    con.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting data into inventory table:', err);
        res.status(500).send('Internal server error');
        return;
      }
      console.log('Data inserted into inventory table:', result);
      res.status(200).send('Data added to inventory table successfully');
    });
  });
  
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



