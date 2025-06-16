// app.js
// require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const app = express();
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// cookie parser
const cookieParser = require("cookie-parser");
// create session to keep user log in
const session = require("express-session");

// Import Supabase client (assuming supabaseClient.js correctly initializes it)
const supabase = require("./supabaseClient");

const port = process.env.PORT || 3001;

// Database configuration (for PostgreSQL, if you're still using it for some routes)
const db = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
});

// Test DB connection (optional, but good for debugging)
db.connect()
  .then(() => console.log('Connected to PostgreSQL database!'))
  .catch(err => console.error('Error connecting to PostgreSQL database', err));

const isProduction = process.env.NODE_ENV === "production"; // Correctly define production environment

// === Middleware Configuration - Order Matters! ===
// 1. Body Parsers (must come before routes and session)
app.use(express.json()); // To parse JSON bodies from client requests
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies (for forms)

// 2. Cookie Parser
app.use(cookieParser()); // To parse cookies

// 3. Trust Proxy (Crucial for sessions when deployed behind a proxy like Render)
// '1' trusts the first proxy hop (e.g., Render's load balancer)
app.set('trust proxy', 1);

// 4. CORS Configuration (must come before routes but after parsers for preflight requests)
app.use(
  cors({
    // Dynamically set origin based on environment
    origin: isProduction ? "https://front-end-4ytj.onrender.com" : "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"], // Correct syntax: array of strings
    credentials: true, // Allow cookies to be sent with cross-origin requests
  })
);

// 5. Session Middleware
app.use(
  session({
    // IMPORTANT: Use a strong, unique secret from environment variables
    secret: process.env.SESSION_SECRET,
    name: "user_sid", // Cookie name for the session ID (often 'connect.sid' by default)
    resave: false, // Don't save session if not modified (good practice)
    saveUninitialized: false, // Don't create session for unauthenticated users (good practice)
    cookie: {
      // Set 'secure' to true only in production (requires HTTPS)
      secure: isProduction,
      // 'httpOnly: true' prevents client-side JS from accessing the cookie (security)
      httpOnly: true,
      // 'sameSite: 'none'' is required for cross-site cookies with 'secure: true'
      // 'lax' is generally fine for same-site development
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 24 hours in milliseconds
    },
  })
);

// --- ROUTES ---

app.post("/signup", async (request, response) => {
  const { username, password } = request.body;
  console.log("Signup attempt for Username:", username);

  if (!username || !password) {
    return response.status(400).json({ success: false, message: "Username and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Using Supabase for user signup
    const { data: userData, error: supabaseError } = await supabase
      .from("users")
      .insert([{ username: username, password: hashedPassword }])
      .select(); // No .single() here, as insert returns an array

    if (supabaseError) {
      console.error("Supabase Signup Error:", supabaseError);
      // Check for unique constraint violation (username already exists)
      if (supabaseError.code === '23505') { // PostgreSQL unique violation error code
        return response.status(400).json({ success: false, message: "Username already exists." });
      }
      return response.status(500).json({ success: false, message: "Error during user signup." });
    }

    if (userData && userData.length > 0) {
      // Store the user object (the first element of the array) in the session
      request.session.user = userData[0];
      // Explicitly save the session after modifying it
      request.session.save((err) => {
        if (err) {
          console.error("Session save error after signup:", err);
          return response.status(500).json({ success: false, message: "Signup successful, but session could not be saved." });
        }
        response.json({ success: true, message: "User signed up successfully" });
      });
    } else {
      // This case should ideally not be hit with successful insert.
      response.status(400).json({ success: false, message: "Failed to create user account." });
    }
  } catch (error) {
    console.error("Internal server error during signup:", error);
    response.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Checks if user is logged in (for initial client-side check)
app.get("/isUserLoggedIn", (request, response) => {
  console.log("Checking session for user in /isUserLoggedIn:", request.session.user);
  if (request.session.user) {
    return response.json({
      valid: true,
      username: request.session.user.username,
      id: request.session.user.id // Include ID for client-side use if needed
    });
  } else {
    return response.json({ valid: false });
  }
});

// User login route
app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  console.log("Login attempt for Username:", username);

  if (!username || !password) {
    return response.status(400).json({ success: false, message: "Username and password are required." });
  }

  try {
    // Using Supabase to fetch user
    const { data: user, error: supabaseError } = await supabase
      .from("users")
      .select('*') // Select all columns, including 'password' for comparison
      .eq("username", username)
      .single(); // Expecting exactly one user

    if (supabaseError) {
      // Supabase errors could indicate no user found, or a database issue
      console.error("Supabase Login Query Error:", supabaseError);
      return response.status(400).json({ success: false, message: "Invalid credentials." });
    }

    if (!user) { // If Supabase returns no data (e.g., user doesn't exist)
      console.log("User not found for login:", username);
      return response.status(400).json({ success: false, message: "Invalid credentials." });
    }

    // Compare provided password with hashed password from the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Store the full user object in the session
      request.session.user = user;
      console.log("Login successful. Session user data:", request.session.user);

      // Explicitly save the session after modifying it
      request.session.save((err) => {
        if (err) {
          console.error("Session save error after login:", err);
          return response.status(500).json({ success: false, message: "Login successful, but session could not be saved." });
        }
        response.json({ success: true, message: "Login successful" });
      });

    } else {
      console.log("Password mismatch for user:", username);
      response.status(401).json({ success: false, message: "Invalid credentials." });
    }
  } catch (error) {
    console.error("Internal server error during login process:", error);
    response.status(500).json({ success: false, message: "Internal server error." });
  }
});


// Add an explicit logout route
app.post("/logout", (req, res) => {
  // Clear the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session during logout:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // Clear the session cookie from the client's browser
      res.clearCookie("user_sid"); // Use the same name as specified in session config 'name' property
      res.status(200).send("Logout successful");
    }
  });
});


// === Favorites (Supabase) ===
app.post("/favorites", async (req, res) => {
  const { bookId, isFavorite } = req.body;
  // Ensure user is logged in and session.user exists
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized: User not logged in." });
  }
  if (!bookId) {
    return res.status(400).json({ success: false, message: "Invalid book ID." });
  }

  console.log("UserID:", userId, "BookId:", bookId, "isFavorite:", isFavorite);

  try {
    if (isFavorite) {
      // Check if favorite already exists to prevent duplicates
      const { data: favoritedata, error: selectError } = await supabase
        .from('favorites')
        .select('id') // Only select id, as we just need to know if it exists
        .eq('user_id', userId)
        .eq('book_id', bookId);

      if (selectError) throw selectError;

      if (favoritedata.length === 0) {
        // Add to favorites if it doesn't already exist
        const { error: insertError } = await supabase
          .from('favorites')
          .insert([{ user_id: userId, book_id: bookId }]);

        if (insertError) throw insertError;
        console.log("Book added to favorites for user", userId);
        return res.json({ success: true, message: "Book added to favorites." });
      } else {
        console.log("Book already in favorites for user", userId);
        return res.json({ success: true, message: "Book already in favorites." });
      }
    } else {
      // Remove the book from favorites
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('book_id', bookId);

      if (deleteError) throw deleteError;
      console.log("Book removed from favorites for user", userId);
      return res.json({ success: true, message: "Book removed from favorites." });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});


app.get("/displayfavorites", async (req, res) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized: User not logged in." });
  }

  try {
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error("Supabase error fetching favorites:", error);
      throw error;
    }

    res.json({ success: true, favorites: favorites });
    console.log("Fetched favorites for user", userId, ":", favorites);
  } catch (error) {
    console.error("Server error displaying favorites:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});


app.get("/likedBooks", async (req, res) => {
  try {
    const { data: likedBooksData, error } = await supabase
      .from('favorites')
      .select('book_id'); // Just get the book_id column

    if (error) {
      console.error("Supabase error fetching liked books:", error);
      throw error;
    }

    // Helper function moved inside to ensure it's used with the correct data structure
    function findMostOccurringElements(arr) {
      const countMap = {};
      arr.forEach((item) => {
        const key = item.book_id;
        countMap[key] = (countMap[key] || 0) + 1;
      });

      // Filter for elements with more than one occurrence
      // You might want to sort these or limit the number returned
      const mostOccurringElements = Object.keys(countMap).filter(
        (key) => countMap[key] > 1
      );
      return mostOccurringElements;
    }

    res.json({
      success: true,
      books: findMostOccurringElements(likedBooksData),
    });
    console.log("Most liked books (more than 1 like):", findMostOccurringElements(likedBooksData));
  } catch (error) {
    console.error("Server error getting liked books:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// === Reviews (PostgreSQL - as per your original code) ===
// Note: If you're using Supabase for users and favorites, you might consider
// using Supabase for reviews as well for consistency.
app.post("/reviews/:bookId", async (request, res) => {
  // Original code had bookId in params and body, assuming body is correct source for newReview object
  const { newReview } = request.body;
  const { bookId } = request.params; // Get bookId from URL params as per route definition

  const userId = request.session?.user?.id; // Safely get userId from session

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized: User not logged in to post review." });
  }
  if (!bookId || !newReview || !newReview.content || newReview.rating === undefined) {
    return res.status(400).json({ success: false, message: "Invalid review data provided." });
  }

  const { content, rating } = newReview;
  console.log("User", userId, "posting review for Book", bookId, ": Content='", content, "', Rating=", rating);

  try {
    // Insert review into PostgreSQL database
    const result = await db.query(
      "INSERT INTO reviewsList(user_id, book_id, rating, content) VALUES($1, $2, $3, $4) RETURNING *", // RETURNING * to get inserted row
      [userId, bookId, rating, content]
    );

    // After successful insert, query for all reviews for that book
    const results = await db.query(
      "SELECT r.*, u.username FROM reviewsList r JOIN users u ON r.user_id = u.id WHERE r.book_id = $1",
      [bookId]
    );

    res.json({
      success: true,
      message: "Review added successfully",
      reviews: results.rows,
    });
    console.log("Reviews for book", bookId, ":", results.rows);
  } catch (error) {
    console.error("Error posting review:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.get("/reviews/:bookId", async (req, res) => {
  const { bookId } = req.params;

  try {
    // Query for reviews of the specific book, joining with users to get username directly
    const reviewsResult = await db.query(
      "SELECT r.id, r.user_id, r.book_id, r.rating, r.content, u.username FROM reviewsList r JOIN users u ON r.user_id = u.id WHERE r.book_id = $1",
      [bookId]
    );

    res.json({
      success: true,
      message: "Reviews retrieved successfully",
      reviews: reviewsResult.rows,
    });
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// === Profile Update (PostgreSQL - as per your original code) ===
app.put("/update-profile", async (req, res) => {
  const userId = req.session?.user?.id; // Safely get userId from session

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized: User not logged in to update profile." });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required for profile update." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the user's profile in PostgreSQL
    const updateResult = await db.query(
      "UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING id, username", // RETURNING to get updated data
      [username, hashedPassword, userId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found for update." });
    }

    // Update the session user with new data
    request.session.user = updateResult.rows[0];
    request.session.save((err) => {
      if (err) {
        console.error("Session save error after profile update:", err);
        return res.status(500).json({ success: false, message: "Profile updated, but session could not be saved." });
      }
      res.json({ success: true, message: "Profile updated successfully", user: request.session.user });
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});