// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Utilities
const cookieParser = require("cookie-parser");
const session = require('cookie-session');
const supabase = require("./supabaseClient");

// Optional: Redis for production session storage
// const RedisStore = require("connect-redis")(session);
// const { createClient } = require("redis");
// let redisClient = createClient({ url: process.env.REDIS_URL, legacyMode: true });
// redisClient.connect().catch(console.error);

// Load environment variables
// require("dotenv").config();

const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === "production";

// PostgreSQL configuration
const db = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
});

// Trust proxy when behind a proxy (e.g., on Render)
if (isProduction) {
  app.set("trust proxy", 1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000", // ✅ Dev frontend
      "http://localhost:3001", // ✅ Dev backend
      "https://capstone-project2-pt29.onrender.com", // ✅ Production frontend
      "https://front-end-4ytj.onrender.com",         // ✅ Production frontend (if different)
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    // Production: use Redis
    // store: new RedisStore({ client: redisClient }),
    key: "user",
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: isProduction, // true in production (HTTPS)
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, 
    },
  })
);


// if (error) {
//   // Check for specific errors (e.g., username conflict)
//   if (error.code === '23505') {
//     response.status(400).json({ success: false, message: "Username already exists" });
//   } else {
//     throw error; // Re-throw other errors for generic handling
//   }
// }
app.post("/signup", async (request, response) => {
  const { username, password } = request.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password: hashedPassword }])
      .select();

    if (error || !data || data.length === 0) {
      return response.status(400).json({
        success: false,
        message: "Signup failed. Username may already exist.",
      });
    }

    const user = data[0];
    request.session.user = { id: user.id, username: user.username };

    request.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return response.status(500).json({
          success: false,
          message: "Signup successful, but session could not be saved.",
        });
      }

      response.json({
        success: true,
        message: "User registered and logged in successfully.",
        user: request.session.user,
      });
    });
  } catch (error) {
    console.error("Signup error:", error);
    response.status(500).json({ success: false, message: "Server error during signup." });
  }
});

//     request.session.user = request.body.username;
//     response.json({ success: true, message: "User signed up successfully" });
//   } catch (error) {
//     console.error(error);
//     response
//       .status(500)
//       .json({ success: false, message: "Internal server error" });
//   }
// });
// await db.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, [
//   username,
//   hashedPassword,
// ]);

//     response.json({ success: true, message: "User signed up successfully" });
//   } catch (error) {
//     console.error(error);
//     response
//       .status(500)
//       .json({ success: false, message: "Internal server error" });
//   }
// });

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
  if (request.session.user) {
    response.send({ loggedIn: true, user: request.session.user });
  } else {
    response.send({ loggedIn: false });
  }
});

app.get("/isUserLoggedIn", (request, response) => {
  // localStorage.getItem("favs");
  console.log("request.session.user", request.session.user);
  if (request.session.user) {
    console.log("heyo");
    return response.json({
      valid: true,
      username: request.session.user.username,
    });
  } else {
    return response.json({ valid: false });
  }
});





app.post("/login", async (request, response) => {
  const { username, password } = request.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username);

    if (error || !data || data.length === 0) {
      return response.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const user = data[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return response.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    request.session.user = { id: user.id, username: user.username };

    request.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return response.status(500).json({
          success: false,
          message: "Login successful, but session could not be saved.",
        });
      }

      response.json({
        success: true,
        message: "Login successful.",
        user: request.session.user,
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    response.status(500).json({ success: false, message: "Server error during login." });
  }
});


// app.post("/login", async (request, response) => {
//   const { username, password } = request.body;

//   try {
//     const result = await db.query("SELECT * FROM users WHERE username = $1", [
//       username,
//     ]);

//     if (result.rows.length > 0) {
//       const match = await bcrypt.compare(password, result.rows[0].password);

//       if (match) {
//         // save user in the session
//         request.session.username = result.rows[0].username;
//         console.log(result);
//         request.session.userId = result.rows[0].id;
//         console.log(request.session.userId, "user id");
//         console.log(request.session.username);
//         response.json({
//           success: true,
//           message: "Login successful",
//           user: result.rows[0],
//         });
//       } else {
//         response
//           .status(401)
//           .json({ success: false, message: "Wrong password" });
//       }
//     } else {
//       response.status(404).json({ success: false, message: "User not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     response
//       .status(500)
//       .json({ success: false, message: "Internal server error" });
//   }
// });
// backend

// // POSTGRE SQL QUERY DOWN HERE:
// app.post("/favorites", async (req, res) => {
//   const { bookId, isFavorite } = req.body;
//   console.log(req.session.user, "checking userid");
//   const userId = req.session.user.id;

//   console.log("req.session", req.params);
//   console.log("added to favorite ");
//   console.log("UserID", userId);
//   console.log("bookId", bookId);
//   console.log("isFavorite", isFavorite);

//   if (!userId || !bookId) {
//     return res.status(400).json({ success: false, message: "Invalid data" });
//   }

//   try {
//     if (isFavorite) {
//       // Check if the book is already in favorites
//       const existingData = await db.query(
//         "SELECT * FROM favorites WHERE user_id = $1 AND book_id = $2",
//         [userId, bookId]
//       );

//       if (existingData.rows.length === 0) {
//         // Add the book to favorites
//         await db.query(
//           "INSERT INTO favorites (user_id, book_id) VALUES ($1, $2)",
//           [userId, bookId]
//         );
//         console.log("Book added to favorites");
//       } else {
//         console.log("Book already in favorites");
//       }
//     } else {
//       // Remove the book from favorites
//       await db.query(
//         "DELETE FROM favorites WHERE user_id = $1 AND book_id = $2",
//         [userId, bookId]
//       );
//       console.log("Book removed from favorites");
//     }

//     res.json({ success: true, message: "Favorite toggled successfully" });
//   } catch (error) {
//     console.error("Error toggling favorite:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });



// SUPABASE QUERY DOWN HERE: 
app.post("/favorites", async (req, res) => {
  const { bookId, isFavorite } = req.body;
  const userId = req.session?.user?.id;  // Safely checking for session and user object

  console.log("UserID:", userId);
  console.log("bookId:", bookId);
  console.log("isFavorite:", isFavorite);

  if (!userId || !bookId) {
    return res.status(400).json({ success: false, message: "Invalid request data" });
  }

  try {
    if (isFavorite) {
      // Check if favorite already exists
      const { data: favoritedata, error: selectError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId);

      if (selectError) throw selectError;

      if (favoritedata.length === 0) {
        // Add to favorites if it doesn't already exist
        const { data: insertData, error: insertError } = await supabase
          .from('favorites')
          .insert([{ user_id: userId, book_id: bookId }]);

        if (insertError) throw insertError;

        console.log("Added to favorites:", insertData);
      } else {
        console.log("Already in favorites.");
      }
    } else {
      // Remove the book from favorites
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('book_id', bookId);

      if (deleteError) throw deleteError;

      console.log("Removed from favorites.");
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
// POSTGRESQL QUERY 
// app.get("/displayfavorites", async (req, res) => {
//   const userId = req.session.user.id;
//   try {
//     const favorite = await db.query(
//       "SELECT * FROM favorites WHERE user_id = $1",
//       [userId]
//     );
//     res.json({ success: true, favorites: favorite.rows });
//     console.log("favo", favorite);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });

// SUPABASE
app.get("/displayfavorites", async (req, res) => {
  const userId = req.session.user.id;
  try {
    // Assuming `supabase` is already initialized
    const { data: favorite, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    res.json({ success: true, favorites: favorite });
    console.log("favo", favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});



// app.get("/likedBooks", async (req, res) => {
//   // const userId = req.session.user.id
//   try {
//     // const {bookId} = req.body;

//     const likedBooks = await db.query("SELECT book_id FROM favorites ", []);
//     function findMostOccurringElements(arr) {
//       // Create an object to store the count of each element
//       const countMap = {};

//       // Iterate through the array and count occurrences
//       arr.forEach((item) => {
//         const key = item.book_id;
//         countMap[key] = (countMap[key] || 0) + 1;
//       });

//       // Find elements with more than one occurrence
//       const mostOccurringElements = Object.keys(countMap).filter(
//         (key) => countMap[key] > 1
//       );

//       return mostOccurringElements;
//     }
//     res.json({
//       success: true,
//       books: findMostOccurringElements(likedBooks.rows),
//     });
//     console.log("most liked", findMostOccurringElements(likedBooks.rows));
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });


app.get("/likedBooks", async (req, res) => {
  try {
    // Fetch all book_ids from the 'favorites' table
    const { data: likedBooks, error } = await supabase
      .from('favorites')
      .select('book_id');

    if (error) {
      throw error;
    }

    function findMostOccurringElements(arr) {
      const countMap = {};

      // Count occurrences of each book_id
      arr.forEach((item) => {
        const key = item.book_id;
        countMap[key] = (countMap[key] || 0) + 1;
      });

      // Find book_ids with more than one occurrence
      const mostOccurringElements = Object.keys(countMap).filter(
        (key) => countMap[key] > 1
      );

      return mostOccurringElements;
    }

    res.json({
      success: true,
      books: findMostOccurringElements(likedBooks),
    });
    console.log("most liked", findMostOccurringElements(likedBooks));
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
  const { bookId, newReview } = request.body;
  const userId = request.session.user.id;
  console.log("userID creator", userId);

  const { content, rating } = newReview;
  console.log("content", content + "book", bookId);
  try {
    // Insert rating and comments in the database
    const result = await db.query(
      "INSERT INTO reviewsList(user_id, book_id,rating, content) VALUES($1, $2, $3, $4)",
      [userId, bookId, rating, content]
    );
    console.log("result", result);
    console.log("id", userId);

    // Move the SELECT query here
    const results = await db.query(
      "SELECT * FROM reviewsList WHERE user_id = $1 AND book_id = $2",
      [request.session.userId, bookId]
    );

    res.json({
      success: true,
      message: "Review added successfully",
      reviews: results.rows,
    });
    console.log("Review", results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/reviews/:bookId", async (req, res) => {
  const { bookId } = req.params;

  try {
    // 1. Get user ID from session (assuming it's stored there)
    const userId = req.session.user.id;

    // 2. Query for reviews of the specific book
    const reviews = await db.query(
      "SELECT * FROM reviewsList WHERE book_id = $1",
      [bookId]
    );

    // 3. Check if any reviews found
    if (!reviews.rows.length) {
      return res.json({
        success: true,
        message: "No reviews found for this book",
        reviews: [],
      });
    }

    // 4. Prepare an array to store user information
    const userInfos = [];

    // 5. Loop through each review and fetch user details (separate query)
    for (const review of reviews.rows) {
      const userInfo = await db.query(
        "SELECT username FROM users WHERE id = $1",
        [review.user_id]
      );
      userInfos.push(userInfo.rows[0]); // Assuming only one user per ID
      console.log(userInfo.rows[0], "is the user info");
    }

    // 6. Combine review and user data
    const combinedReviews = reviews.rows.map((review, index) => {
      return { ...review, ...userInfos[index] };
    });

    // 7. Send successful response with combined data
    res.json({
      success: true,
      message: "Reviews retrieved successfully",
      reviews: combinedReviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/logout", (req, res) => {
  // Clear the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.clearCookie("connect.sid"); // Clear the session cookie
      res.status(200).send("Logout successful");
    }
  });
});

app.put("/update-profile", async (req, res) => {
  // get user id
  const userId = req.session.userId;
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Update the user's profile
    await db.query(
      "UPDATE users SET username = $1 , password = $2  WHERE id = $3",
      [username, hashedPassword, userId]
    );

    req.session.username = username;
    // console.log(username,"username")
    req.session.password = password;
    console.log("username", username);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// const PORT = 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
