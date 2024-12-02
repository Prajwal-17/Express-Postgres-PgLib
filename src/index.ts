import { Client } from "pg";
import express from "express"

const app = express();
app.use(express.json())

// CONNECTION STRING => postgresql://TestApp_owner:<password>@ep-curly-hall-a5baqzxx.us-east-2.aws.neon.tech/TestApp?sslmode=require
const pgClient = new Client("postgresql://TestApp_owner:F4y8qHXfQpVO@ep-curly-hall-a5baqzxx.us-east-2.aws.neon.tech/TestApp?sslmode=require");

pgClient.connect();

app.get("/users/:id", async (req, res) => {

  const id = req.params.id;

  try {

    const getQuery = `SELECT * FROM users WHERE id=$1`
    // const getQuery = `SELECT * FROM users` //to get all users 

    const response = await pgClient.query(getQuery, [id])
    // const response = await pgClient.query(getQuery) //to get all users

    res.json({
      message: "get users",
      data: response.rows
    })

  } catch (error) {
    console.log("Something went wrong")
  }
})

app.post("/signup", async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  try {

    const insertQuery = `INSERT into users (username ,password) VALUES ($1,$2) RETURNING *`;

    const response = await pgClient.query(insertQuery, [username, password])

    res.json({
      message: "Successfull signup",
      user: response.rows[0]
    })

  } catch (error) {
    console.log(error)
    res.json({ message: "Something went wrong" })
  }
});

app.put("/updateUser", async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  try {

    const updateQuery = `UPDATE users SET username=$1 , password=$2 WHERE ID=6 RETURNING *`

    const response = await pgClient.query(updateQuery, [username, password])

    if (response.rowCount === 0) {
      res.json({
        message: "User not found"
      })
    }

    res.json({
      message: "upadted the user",
      data: response.rows[0]
    })

  } catch (error) {
    console.log(error)
    res.json({
      message: "Something went wrong"
    })
  }
})

app.delete("/deleteUser/:id", async (req, res) => {

  const id = req.params.id;

  try {

    const deleteQuery = `DELETE FROM users WHERE id=$1 RETURNING *`

    const response = await pgClient.query(deleteQuery, [id])
    console.log("🚀 ~ app.delete ~ response:", response)

    if (response.rowCount === 0) {
      res.json({
        message: "unable to find user"
      })
    }

    res.json({
      message: "Successfully deleted a user",
      deletedUser: response.rows[0],
    })
  } catch (error) {
    console.log(error)
    res.json({ message: "Something went wrong" })
  }
})

//create a relationship field the table and then pass the foreign
app.post("/address/add/:id", async (req, res) => {

  const id = req.params.id;
  const city = req.body.city;
  const country = req.body.country;

  try {

    //user_id => foreign key
    const insertQuery = `INSERT INTO address (user_id ,city ,country) VALUES ($1,$2,$3) RETURNING *`;

    const response = await pgClient.query(insertQuery, [id, city, country])

    if (response.rowCount === 0) {
      res.json({
        message: "user not found"
      })
    }

    res.json({
      message: "Added relationship",
      data: response.rows[0]
    })

  } catch (error) {
    console.log(error)
    res.json({
      message: "Something went wrong"
    })
  }
})

//add user & address at the same time use transaction
app.post("/users/address", async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;
  const city = req.body.city;
  const country = req.body.country;

  try {

    await pgClient.query("BEGIN");

    const userQuery = `INSERT INTO users(username,password) VALUES ($1,$2) RETURNING id`
    const response = await pgClient.query(userQuery, [username, password]);

    if (response.rowCount === 0) {
      res.json({
        message: "user not found"
      })
    }

    const userId = response.rows[0].id

    const addressQuery = `INSERT INTO address (user_id,city,country) VALUES ($1,$2,$3) RETURNING * `
    const response2 = await pgClient.query(addressQuery, [userId, city, country])

    await pgClient.query("COMMIT");

    res.json({
      message: "Address added successfully",
      data: response2.rows[0]
    })

  } catch (error) {
    console.log(error)
    await pgClient.query('ROLLBACK'),
      res.json({
        message: "Something went wrong",
      }).status(500)
  }
})

app.listen(3000, () => {
  console.log("Listening to port 3000")
})