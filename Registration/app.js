// app.js
const express = require("express");
const app = express();

const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const saltRounds = 10;

function removeDuplicates(arr) {
  return Array.from(new Set(arr));
}


// parse body
const bodyparser=require("body-parser");
// cookie body
const cookieParser= require("cookie-parser");
// create session to keep user log in 
const session =require("express-session");
const nodemon = require("nodemon");

// Database configuration
const db = new Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "users_books",
});

app.use(bodyparser.json())
app.use(express.json());
app.use(cors({
  origin:"http://localhost:3000",
  methods: ("GET" ,"POST", "PUT"),
  credentials: true
}));

app.use(cookieParser())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser())
 

app.use(session({
  key:"userid",
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie:{
    secure:false,
    expires:1000 * 60 *  60 * 24,
  }
}))

// app.get("/",
//  (req ,res)=>{
//   res.send("hey")
//  })



app.post("/signup", async (request, response) => {
  const { username, password } = request.body;
  console.log(username + password)
  request.session.user = request.body.username;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.query(
      `INSERT INTO users (username, password) VALUES ($1, $2)`,
      [username, hashedPassword]
    );
  
    response.json({ success: true, message: "User signed up successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: "Internal server error" });
  }
});


// app.post("/reviews", async (req, response) => {
//   const userId = req.session.userId;
//   const { reviews,bookId} = req.body;
//   try {
//     await db.query(
//       `INSERT INTO reviewsList (user_id,reviews,book_id) VALUES ($1, $2)`,
//       [userId,reviews,bookId]
//     );
  
//     response.json({ success: true, message: "reviewed successfully" });
//   } catch (error) {
//     console.error(error);
//     response.status(500).json({ success: false, message: "Internal server error" });
//   }
// });

app.get("/login", (request, response) => {
  if (!request.session.user) {
    response.send({ loggedIn: true, user: request.session.user });
  } else {
    response.send({ loggedIn: false });
  }
});

app.get("/",(request,response)=>{
  // localStorage.getItem("favs");
  if(request.session.username){
    console.log("heyo")
    return response.json({valid:true, username:request.session.username})
  }else{
    return response.json({valid:false})
  }
})

app.post("/login", async (request, response) => {
  const { username, password } = request.body;

  try {                                                                                                                                      
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );


    if (result.rows.length > 0) {
      const match = await bcrypt.compare(password, result.rows[0].password);

      if (match) {
        // save user in the session
        request.session.username = result.rows[0].username;
        console.log(result)
        request.session.userId = result.rows[0].id;
        console.log(request.session.userId,"user id")
        console.log(request.session.username)
        response.json({ success: true, message: "Login successful", user:result.rows[0] });
      } else {
        response.status(401).json({ success: false, message: "Wrong password" });
      }
    } else {
      response.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: "Internal server error" });
  }
});
// backend 
app.post("/favorites", async (req, res) => {
  const { bookId, isFavorite } = req.body;
  const  userId = req.session.userId;

  console.log("req.session",req.params) // Assuming you have a logged-in user in the session
  console.log("added to favorite ")
  console.log("UserID",userId)
  console.log("bookId",bookId)


  try {
    if (isFavorite && userId) {
      console.log("yeah")
      // Add the book to favorites
       // query the database 
       const existingData=await db.query('SELECT * FROM favorites WHERE user_id=$1 AND book_id= $2', [userId, bookId])

    //  
       if(existingData.rows.length === 0){
        console.log("existingDataRows",existingData.rows.length)

        // if !book.id is already in favorites where  user_id=userId and book_id=bookId then return
            await db.query(
          
            "INSERT INTO favorites (user_id, book_id) VALUES ($1, $2)",
            [userId, bookId]
          );
      }
    } else {
      console.log("remove")
      // Remove the book from favorites
      await db.query(
        "DELETE FROM favorites WHERE user_id = $1 AND book_id = $2",
        [userId, bookId]
      );
    }

    res.json({ success: true, message: "Favorite toggled successfully" });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
// function removeDuplicatess() {
//   return Array.from(new Set());
// }

app.get("/displayfavorites", async (req, res) => {
  const userId = req.session.userId 
  try {    

    const favorite = await db.query(
      "SELECT * FROM favorites WHERE user_id = $1",
      [userId]
    );
    res.json({ success: true, favorites:favorite.rows});
    console.log("favo",favorite)
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error"});
  }
});


app.get("/likedBooks", async (req, res) => {
  // const userId = req.session.userId 
  try {    
    // const {bookId} = req.body;

    const likedBooks = await db.query(
      "SELECT book_id FROM favorites ",
      []
    );
    function findMostOccurringElements(arr) {
      // Create an object to store the count of each element
      const countMap = {};
    
      // Iterate through the array and count occurrences
      arr.forEach(item => {
        const key = item.book_id;
        countMap[key] = (countMap[key] || 0) + 1;
      });
    
      // Find elements with more than one occurrence
      const mostOccurringElements = Object.keys(countMap).filter(key => countMap[key] > 1);
    
      return mostOccurringElements;
    }
    res.json({ success: true, books:findMostOccurringElements(likedBooks.rows)});
    console.log("most liked",findMostOccurringElements(likedBooks.rows));
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error"});
  }
});

// app.use("/reviews", reviewsHandler);

// app.post("/reviews", async (req, res) => {
// // function reviewsHandler(req, res) {
//   const { bookId, comment } = req.body;
//   const userId = req.session.userId;

// //   if (req.method === "POST") {
//     // Insert rating and comments in the database
//     db.query('INSERT INTO reviews(user_id, book_id,comment) VALUES($1, $2, $3)', [userId, bookId,comment])
//     .then(() => {
//       res.json({ success: true, message: "Review added successfully" });
           // Move the SELECT query here
  //     db.query("SELECT * FROM reviews WHERE book_id = $1", [bookId])
  //   .then((result) => {
  //     res.json({ success: true, reviews: result.rows });
  //     console.log("review", result.rows);
  //  })
//     .catch((error) => {
//      console.error(error);
//      res.status(500).json({ success: false, message: "Internal server error" });
//    });
// })
  // }else{
  //   console.log("Method not allowed");
  // }

app.post("/reviews/:bookId", async (request, res) => {
    const { bookId,newReview } = request.body;
    const userId = request.session.userId;
    console.log("userID creator",userId )
  
    const {content,rating}=newReview;
    console.log("content",content + "book",bookId)
    try {
      // Insert rating and comments in the database
      const result= await db.query('INSERT INTO reviewsList(user_id, book_id,rating, content) VALUES($1, $2, $3, $4)', [userId, bookId, rating,content]);
      console.log("result",result)
      console.log("id",userId)
  
      // Move the SELECT query here
      const results = await db.query("SELECT * FROM reviewsList WHERE user_id = $1 AND book_id = $2", [request.session.userId, bookId]);

      res.json({ success: true, message: "Review added successfully", reviews: results.rows });
      console.log("Review", results.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
    })


    app.get("/reviews/:bookId", async (req, res) => {
      const { bookId } = req.params;
    
      try {
        // 1. Get user ID from session (assuming it's stored there)
        const userId = req.session.userId;
    
        // 2. Query for reviews of the specific book
        const reviews = await db.query("SELECT * FROM reviewsList WHERE book_id = $1", [bookId]);
    
        // 3. Check if any reviews found
        if (!reviews.rows.length) {
          return res.json({ success: true, message: "No reviews found for this book", reviews: [] });
        }
    
        // 4. Prepare an array to store user information
        const userInfos = [];
    
        // 5. Loop through each review and fetch user details (separate query)
        for (const review of reviews.rows) {
          const userInfo = await db.query("SELECT username FROM users WHERE id = $1", [review.user_id]);
          userInfos.push(userInfo.rows[0]); // Assuming only one user per ID
          console.log(userInfo.rows[0], "is the user info");
        }
    
        // 6. Combine review and user data
        const combinedReviews = reviews.rows.map((review, index) => {
          return { ...review, ...userInfos[index] };
        });
    
        // 7. Send successful response with combined data
        res.json({ success: true, message: "Reviews retrieved successfully", reviews: combinedReviews });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    });

    
  app.post('/logout', (req, res) => {
    // Clear the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error during logout:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).send('Logout successful');
      }
    });
  });

  app.put('/update-profile',async  (req, res) => {
    // get user id 
    const userId = req.session.userId;
    const { username, password } = req.body;
    try{
      const hashedPassword = await bcrypt.hash(password, saltRounds);
          // Update the user's profile
     await db.query("UPDATE users SET username = $1 , password = $2  WHERE id = $3", [username, hashedPassword, userId])
 
    req.session.username = username;
    // console.log(username,"username")
    req.session.password= password;
    console.log("username",username)
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
  

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
