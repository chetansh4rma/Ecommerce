const express = require("express");
//152.58.17.147/32
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Stripe = require('stripe')
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "bdnf89wayr";

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 5000;

//mongodb connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to Databse"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

//
const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("Server is running");
});

const bcrypt = require('bcrypt');

// Sign up
app.post('/signup', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match', alert: false });
  }

  try {
    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email id is already registered', alert: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = new userModel({
      ...req.body,
      password: hashedPassword, // Save hashed password
    });

    await data.save();

    return res.status(201).json({ message: 'Successfully signed up', alert: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error occurred', alert: false });
  }
});

// server.js or wherever your server code is
app.get('/api/check-auth', (req, res) => {
  if (req.cookies.authToken) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});




//api login
// Login

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // Generate a JWT token
        const token = jwt.sign(
          {
            userId: user._id,
            email: user.email,
          },
          SECRET_KEY,
          { expiresIn: "1d" } // Token valid for 1 day
        );

        // Set the token as a cookie
        res.cookie("authToken", token, {
          httpOnly: true, // The cookie is not accessible via JavaScript
          secure: process.env.NODE_ENV === "production", // Set to true in production to ensure the cookie is only sent over HTTPS
          sameSite: "strict", // Prevent CSRF attacks
          maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        });

        res.send({
          message: "Login successful",
          alert: true,
          data: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        });
      } else {
        res.status(401).send({
          message: "Invalid credentials",
          alert: false,
        });
      }
    } else {
      res.status(404).send({
        message: "Email not registered",
        alert: false,
      });
    }
  } catch (err) {
    res.status(500).send({ message: "Server error", alert: false });
  }
});

// Example middleware to verify JWT from cookie
const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden" });
    }
    req.user = decoded; // store user information for use in the route
    next();
  });
};

// Protect routes
app.get("/protected", verifyToken, (req, res) => {
  res.send({ message: "You have access to this protected route!" });
});



 //product section

const schemaProduct = mongoose.Schema({
  name: String,
  category:String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product",schemaProduct)



//save product in data 
//api
app.post("/uploadProduct",async(req,res)=>{
    // console.log(req.body)
    const data = await productModel(req.body)
    const datasave = await data.save()
    res.send({message : "Upload successfully"}) 
})

//
app.get("/product",async(req,res)=>{
  const data = await productModel.find({})
  res.send(JSON.stringify(data))
})
 
/*****payment getWay */
//console.log(process.env.STRIPE_SECRET_KEY)


const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY)

app.post("/create-checkout-session",async(req,res)=>{

     try{
      const params = {
          submit_type : 'pay',
          mode : "payment",
          payment_method_types : ['card'],
          billing_address_collection : "auto",
          shipping_options : [{shipping_rate : "shr_1NtBj1SDZC0xqkr7pgrkK0QI"}],

          line_items : req.body.map((item)=>{
            return{
              price_data : {
                currency : "inr",
                product_data : {
                  name : item.name,
                  // images : [item.image]
                },
                unit_amount : item.price * 100,
              },
              adjustable_quantity : {
                enabled : true,
                minimum : 1,
              },
              quantity : item.qty
            }
          }),

          success_url : `${process.env.FRONTEND_URL}/success`,
          cancel_url : `${process.env.FRONTEND_URL}/cancel`,

      }

      
      const session = await stripe.checkout.sessions.create(params)
      // console.log(session)
      res.status(200).json(session.id)
     }
     catch (err){
        res.status(err.statusCode || 500).json(err.message)
     }

})


// //server is ruuning
 app.listen(PORT, () => console.log("server is running at port : " + PORT));
