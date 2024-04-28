  import express from "express";
  import mysql2 from "mysql2";
  import cors from "cors";


  const app = express();
  app.use(cors());
  app.use(express.json());

  const db = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "Anshul@123",
    database: "test",
  });

  app.get("/", (req, res) => {
    res.json("hello");
  });

  // Routes for Books
  /*app.get("/books", (req, res) => {
    const q = "CALL get_book()"; // Call the stored procedure

    db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      return res.json(data[0]); // Stored procedure results are returned as the first element of the result array
    });
  });
  */

  // STORED PROCEDURE
  app.get("/books", (req, res) => {
    // Call the stored procedure to get all books data
    const getAllBooksQuery = "CALL get_book()";
  
    db.query(getAllBooksQuery, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      // Filter the retrieved data based on query parameters
      const { title, author, startDate, endDate, available } = req.query;
      let filteredBooks = data[0]; // Assuming the result is returned as the first element of the result array
  
      if (available === 'true') {
        filteredBooks = filteredBooks.filter(book => book.quantity_available > 0);
      }
      if (title) {
        filteredBooks = filteredBooks.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
      }
      if (author) {
        filteredBooks = filteredBooks.filter(book => book.authorid === Number(author));
      }
      if (startDate) {
        filteredBooks = filteredBooks.filter(book => new Date(book.publication_date) >= new Date(startDate));
      }
      if (endDate) {
        filteredBooks = filteredBooks.filter(book => new Date(book.publication_date) <= new Date(endDate));
      }
      // Additional filtering logic for other fields if needed
  
      return res.json(filteredBooks);
    });
  });
  

// PREPARED STATEMENT
  app.post("/books", (req, res) => {
    const q = "INSERT INTO books (`title`, `authorid`, `category_id`, `ISBN`, `publication_date`, `quantity_available`) VALUES (?, ?, ?, ?, ?, ?)";

    const values = [
      req.body.title,
      req.body.authorid, // Changed from req.body.author_id to req.body.authorid
      req.body.category_id,
      req.body.ISBN,
      req.body.publication_date,
      req.body.quantity_available,
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
  });
  
  /*app.post("/books", (req, res) => {
    const q = "CALL addBook(?, ?, ?, ?, ?, ?)"; // Call the stored procedure

    const values = [
      req.body.title,
      req.body.authorid,
      req.body.category_id,
      req.body.ISBN,
      req.body.publication_date,
      req.body.quantity_available
    ];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error('Error adding book:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      return res.json(data);
    });
  });
  */
// STORED PROCEDURE
  app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;

    const q = "CALL delete_book(?)"; // Call the stored procedure

    db.query(q, [bookId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Book has been deleted.");
    });
});

// STORED PROCEDURE
app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;

  const q = "CALL update_book(?, ?, ?, ?, ?, ?, ?)"; // Call the stored procedure

  const values = [
      bookId,
      req.body.title,
      req.body.authorid,
      req.body.category_id,
      req.body.ISBN,
      req.body.publication_date,
      req.body.quantity_available
  ];

  db.query(q, values, (err, data) => {
      if (err) return res.json(err);
      return res.json("Book has been updated.");
  });
});


  // Routes for Authors
  // Routes for Authors
  // STORED PROCEDURE
  app.get("/author", (req, res) => {
    const q = "CALL get_authors()";
  
    db.query(q, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      return res.json(data[0]);
    });
  });
  
    // PREPARED STATEMENT
    app.post("/author", (req, res) => {
      const q = "INSERT INTO author (`author_name`, `nationality`, `birth_date`) VALUES (?, ?, ?)";
      
      const values = [
        req.body.author_name,
        req.body.nationality,
        req.body.birth_date,
      ];
      
      db.query(q, values, (err, data) => {
        if (err) return res.send(err);
        const authorId = data.insertId; // Get the ID of the newly inserted author
        return res.json({ message: "Author added successfully", author_id: authorId });
      });
    });
    
   // Update the route to use the stored procedure
/*app.post("/author", (req, res) => {
  const q = "CALL add_author(?, ?, ?)";
  
  const values = [
    req.body.author_name,
    req.body.nationality,
    req.body.birth_date,
  ];
  
  db.query(q, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    const authorId = data[0][0].author_id;
    return res.json({ message: "Author added successfully", author_id: authorId });
  });
});
*/

    // PREPARED STATEMENT
    app.put("/author/:id", (req, res) => {
      const authorId = req.params.id;
    
      const q = "UPDATE author SET `author_name` = ?, `nationality` = ?, `birth_date` = ? WHERE author_id = ?";
    
      const values = [
        req.body.author_name,
        req.body.nationality,
        req.body.birth_date,
        authorId
      ];
    
      db.query(q, values, (err, data) => {
        if (err) return res.json(err);
        return res.json("Author has been updated.");
      });
    });
    /*
    app.put("/author/:id", (req, res) => {
      const authorId = req.params.id;
    
      const q = "CALL update_author(?, ?, ?, ?)";
    
      const values = [
        authorId,
        req.body.author_name,
        req.body.nationality,
        req.body.birth_date
      ];
    
      db.query(q, values, (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        return res.json(data[0]); // Assuming the stored procedure returns a message
      });
  });
  */
  
    // STORED PROCEDURE
  app.delete("/author/:id", (req, res) => {
    const authorId = req.params.id;

    const q = "CALL delete_author(?)";

    db.query(q, [authorId], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.json(data[0][0].message);
    });
});

    
// STORED PROCEDURE
  // Routes for Categories
  // Routes for Categories
  app.get("/categories", (req, res) => {
    const q = "CALL get_categories()"; // Call the stored procedure
    // I have an index on category name, so I can use the following query to get the category with the specified name
    db.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.json(data[0]); // Assuming the result is returned as the first result set
    });
});

/*app.post("/categories", (req, res) => {
  const q = "CALL add_category(?, ?)";
  
  const values = [
      req.body.category_name,
      req.body.description,
  ];
  
  db.query(q, values, (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      return res.json({ message: 'Category added successfully' });
  });
});
*/
    // PREPARED STATEMENT
app.post("/categories", (req, res) => {
  const q = "INSERT INTO categories (`category_name`, `description`) VALUES (?, ?)";

  const values = [
    req.body.category_name,
    req.body.description,
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

/*
app.put("/categories/:id", (req, res) => {
  const categoryId = req.params.id;
  
  const q = "CALL update_category(?, ?, ?)";
  
  const values = [
      categoryId,
      req.body.category_name,
      req.body.description
  ];
  
  db.query(q, values, (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      return res.json({ message: 'Category has been updated.' });
  });
});

    
app.delete("/categories/:id", (req, res) => {
  const categoryId = req.params.id;
  
  const q = "CALL delete_category(?)";
  
  db.query(q, [categoryId], (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      return res.json({ message: 'Category has been deleted.' });
  });
});
*/
    // PREPARED STATEMENT
app.put("/categories/:id", (req, res) => {
  const categoryId = req.params.id;

  const q = "UPDATE categories SET `category_name` = ?, `description` = ? WHERE category_id = ?";

  const values = [
    req.body.category_name,
    req.body.description,
    categoryId
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("Category has been updated.");
  });
});

    // PREPARED STATEMENT

app.delete("/categories/:id", (req, res) => {
  const categoryId = req.params.id;

  const q = "DELETE FROM categories WHERE category_id = ?";

  db.query(q, [categoryId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Category has been deleted.");
  });
});
    // STORED PROCEDURE
    // Routes for Borrowers
    app.get("/borrowers", (req, res) => {
      const q = "CALL get_borrowers()"; // Call the stored procedure
      db.query(q, (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        return res.json(data[0]); // Assuming the result is returned as the first result set
      });
    });
    // STORED PROCEDURE
    
    app.post("/borrowers", (req, res) => {
      const q = "CALL add_borrower(?, ?)";
      
      const values = [
          req.body.borrower_name,
          req.body.email,
      ];
      
      db.query(q, values, (err, data) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Internal server error' });
          }
          return res.json(data[1]); // Assuming the result is returned as the second result set
      });
  });
  
    // STORED PROCEDURE
  app.put("/borrowers/:id", (req, res) => {
    const borrowerId = req.params.id;
    const { borrower_name, email } = req.body; // Destructure borrower_name and email
    
    const q = "CALL update_borrower(?, ?, ?)";
    
    const values = [
        borrowerId,
        borrower_name,
        email
    ];
    
    db.query(q, values, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.json(data[1]); // Assuming the result is returned as the second result set
    });
});
// STORED PROCEDURE
    
app.delete("/borrowers/:id", (req, res) => {
  const borrowerId = req.params.id;
  
  const q = "CALL delete_borrower(?)";
  
  db.query(q, [borrowerId], (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      
      const rowsAffected = data.affectedRows;
      if (rowsAffected > 0) {
          return res.json("Borrower has been deleted.");
      } else {
          return res.status(404).json({ error: 'Borrower not found.' });
      }
  });
});


    

  app.listen(8800, () => {
    console.log("Connected to backend.");
  }); 

