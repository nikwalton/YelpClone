const express = require('express');
const db = require("./db");
const cors = require('cors');
const { Pool } = require('pg');
const e = require('express');
//const { createSemanticDiagnosticsBuilderProgram } = require('typescript');

const app = express();
const port = 4040;

app.use(cors());

// Get All Users
app.get('/api/Users', async (req, res) => {
    try {
    const results =  await db.query("SELECT * FROM Users");
    res.status(200).json(results.rows);
} catch (err) {
    res.status(500).json({
        err
    });
}
});

// Get A User
app.get('/api/Users/by_user/:user_id', async(req, res) => {
    try {

        const results = await db.query("SELECT * FROM Users WHERE user_id = $1", [req.params.user_id]);
   
        
        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json ({
            err
        });
    }
});

app.get('/api/distance/:user_id', async(req, res) => {
    try {
        const results = await db.query("SELECT distance(U.latitude, U.longitude, B.latitude, B.longitude) FROM Users as U, Business as B WHERE user_id= $1", [req.params.user_id]);
        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json ({
            err
        })
    }
})

//update users location
app.put('/api/Users/:user_id/:lat/:long', async(req, res) => {
    try {
        const results = await db.query("UPDATE USERS SET latitude = $1,longitude = $2 WHERE user_id = $3", [req.params.lat, req.params.long, req.params.user_id])
        res.status(200).json(results.rows);
    } catch(err) {
        res.status(500).json ({
            err
        });
    }
})

//Get All Businesses
app.get('/api/Business', async(req, res) => {
    try {
        const results = await db.query("SELECT * FROM Business");
        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
});

//Get A Business
app.get('/api/Business/:business_id', async(req, res) => {
    try {
        const results = await db.query("SELECT * FROM Business WHERE business_id = $1", 
            [req.params.business_id]);
        
        res.status(200).json(results.rows);

    } catch(err) {
        res.status(500).json({
            err
        })
    }
});

//Get friends of a user
app.get('/api/Friend/by_user/:user_id', async(req, res) => {
    try {
        const results = await db.query("Select * From Users WHERE user_id IN (SELECT friend_id FROM Users NATURAL JOIN Friend WHERE user_id = $1)", 
            [req.params.user_id]);
        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
});

//Get friends of a user
app.get('/api/LatestTip/by_user/:user_id', async(req, res) => {
    try {
        ///////////////////////////////TO DO add T.name to get user name, but then name doesnt work.
        const results = await db.query("Select Business.name as Bname, T.name as Uname, city, text, tip_date From Business, (Select * FROM Users NATURAL JOIN Tip WHERE user_id IN (SELECT friend_id FROM Users NATURAL JOIN Friend WHERE user_id = $1) Order By tip_date desc) AS T WHERE Business.business_id = T.business_id", 
            [req.params.user_id]);
        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
});

//Get sorted Businesses
app.get('/api/Business/by_sort/:sort', async(req, res) => {
    try {
        var sql = "SELECT * FROM Business ORDER BY "

        if (req.params.sort == "stars"){
            sql += "stars desc"
        }
        if (req.params.sort == "name"){
            sql += "name"
        }
        if (req.params.sort == "num_checkins"){
            sql += "num_checkins desc"
        }
        if (req.params.sort == "num_tips"){
            sql += "num_tips desc"
        }
        if (req.params.sort == "distance"){
            sql += "distance"
        }

        const results = await db.query(sql, []);
        
        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
});

//Get attributes
app.get('/api/Attributes/:attribute', async(req, res) => {
    try {
        var sql = "SELECT * FROM Attributes NATURAL JOIN Business WHERE"
        var arr = []
        var attributes = []
        var sort = []
        var temp = []

        if ((req.params.attribute).includes("+")){
            sort = (req.params.attribute).split("+")
            temp = sort[0]
            sort.shift()
        }
        else{
            temp = (req.params.attribute)
        }

        if (temp.includes("_")){
            attributes = temp.split("_")
        }

        attributes.shift()

        var count = 1
        var numPrice = 0
        for (var i in attributes){
            var nameVal = attributes[i].split(":")
            if (nameVal[0] === 'RestaurantsPriceRange2'){
                numPrice += 1
            }

            if (i == 0){
                sql += (" attribute_name = $" + (count))
                arr.push(nameVal[0])
                count += 1

                sql += (" AND attribute_value = $" + (count))
                arr.push(nameVal[1])
                count += 1
            }

            else {
                if (numPrice > 1){
                    var newCount = count + 1
                    sql += (" OR (business_id IN (SELECT business_id FROM Attributes WHERE attribute_name = $" + (count) + " AND attribute_value = $" + (newCount) + "))")
                    arr.push(nameVal[0])
                    arr.push(nameVal[1])
                    count += 2
                }
                else{
                    sql += (" AND business_id IN (SELECT business_id FROM Attributes WHERE attribute_name = $" + (count))
                    arr.push(nameVal[0])
                    count += 1
    
                    sql += (" AND attribute_value = $" + (count) + ')')
                    arr.push(nameVal[1])
                    count += 1 
                }
            }
        }

        if (sort.length > 0){
            sql += " ORDER BY "

            if (sort[0] == "stars"){
                sql += "stars desc"
            }
            if (sort[0] == "name"){
                sql += "name"
            }
            if (sort[0] == "num_checkins"){
                sql += "num_checkins desc"
            }
            if (sort[0] == "num_tips"){
                sql += "num_tips desc"
            }
            if (sort[0] == "distance"){
                sql += "distance"
            }
        }
        
        const results = await db.query(sql, arr)
        
        res.status(200).json(results.rows);

    } catch(err) {
        res.status(500).json({
            err
        })
    }
});

//Getting all the tips is too big of a response, you need to filter it down one way or another
//Get Tips For A Business
app.get('/api/Tip/by_business/:business_id', async(req, res)=> {
    try {
        const results = await db.query("SELECT tip_date, Tip.user_id, business_id, text, likes, name FROM Tip INNER JOIN Users on Tip.user_id = Users.user_id WHERE business_id = $1 ORDER BY tip_date", [req.params.business_id]);

        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
});

//Get Tips For A User
app.get('/api/Tip/by_user/:user_id', async(req, res) => {
    try {
        const results = await db.query("SELECT * FROM Tip WHERE user_id = $1", [req.params.user_id]);

        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
});

// Update likes
app.post('/api/Tip/updatelikes/:user_id/:business_id/:tip_date', async(req, res) => {
    try {
        const results = await db.query("UPDATE Tip SET likes = likes + 1 WHERE user_id = $1 AND business_id = $2",
                                            [req.params.user_id, req.params.business_id])
       
       res.status(200).json(results.rows[0]); 
    } catch (err) {
       res.status(500).json({
          err
       })
    }
 }); 

//Insert A New Tip
//The tip's timestamp is set to the current time
app.post('/api/Tip/insert_tip/:user_id/:business_id/:text', async(req, res) => {
   try {
      const results = await db.query("INSERT INTO Tip VALUES (LOCALTIMESTAMP(0), $1, $2, $3) RETURNING *", [
         req.params.user_id,
         req.params.business_id,
         req.params.text
      ]);
      
      res.status(200).json(results.rows[0]);
   } catch (err) {
      res.status(500).json({
         err
      })
   }
});

//Get All Categories
app.get('/api/Categories', async(req, res) => {
    try {
        const results = await db.query("SELECT * FROM Categories");

        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
});

//Get Categories by business id
app.get('/api/Categories/by_business/:id', async(req, res) => {
    try {
        const results = await db.query("SELECT business_id, category_name FROM Categories NATURAL JOIN Business WHERE business_id = $1", [req.params.id]);

        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
});

//Get Attributes by business id
app.get('/api/Attributes/by_business/:id', async(req, res) => {
    try {
        const results = await db.query("SELECT business_id, attribute_value, attribute_name FROM Attributes NATURAL JOIN Business WHERE business_id = $1", [req.params.id]);

        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
});

// Gets the checkin data by month given a business id
app.get('/api/CheckIns/by_business/:business_id', async(req, res) => {
    try {
        const results = await db.query("SELECT checkin_month, COUNT(checkin_month) as numcheckins FROM CheckIns WHERE business_id = $1 GROUP BY checkin_month", [req.params.business_id]);
        
        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
});

// Insert into the CheckIns table
app.post('/api/CheckIns/insertcheckin/:business_id/:checkin_month/:checkin_day/:checkin_time', async(req, res) => {
    try {
        const results = await db.query("INSERT INTO CheckIns (checkin_year, checkin_month, checkin_day, checkin_time, business_id) VALUES ((SELECT EXTRACT(YEAR FROM CURRENT_DATE)), $1, $2, $3, $4) RETURNING *",
                                        [req.params.checkin_month, req.params.checkin_day, req.params.checkin_time, req.params.business_id])
       
       res.status(200).json(results.rows[0]); 
    } catch (err) {
       res.status(500).json({
          err
       })
    }
 });     

//Get All Attributes
app.get('/api/Attributes', async(req, res) => {
    try {
        const results = await db.query("SELECT * FROM Attributes");

        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
});

//get hours for buisness based on id
app.get('/api/hours/:id', async(req, res) => {
    try {
        const results = await db.query("SELECT * FROM Hours WHERE business_id = $1 ", [req.params.id])
        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
})

//Gets business data based on a given state.
app.get('/api/Business/by_state/:state', async(req, res) => {
    try {
        var sql = "SELECT * FROM Business WHERE state = $1"
        var arr = []
        var attributes = []
        var categories = []
        var allInfo = []
        var temp = req.params.state
        var sort = []

        if (temp.includes("+")){
            sort = temp.split("+")
            temp = sort[0]
            sort.shift()
        }

        if (temp.includes("_")){
            attributes = temp.split("_")
            temp = attributes[0]
            attributes = attributes.splice(1,)
        }

        if (temp.includes("!")){
            categories = temp.split("!")
            temp = categories[0]
            categories = categories.splice(1,)
        }
        
        var count = 2
        var allInfo = temp.split(",")

        if (allInfo.length > 0){
            arr.push(allInfo[0])
        }
        if (allInfo.length > 1) {
            arr.push(allInfo[1])
            sql += " AND city = $" + count
            count += 1
        } 
        if (allInfo.length > 2) {
            arr.push(allInfo[2])
            sql += " AND zipcode = $" + count
            count += 1
        } 

        for (var i in categories){
            sql += (" AND business_id IN (SELECT business_id FROM Categories WHERE category_name = $" + (count) + ")")
            arr.push(categories[i])
            count += 1
        }

        var numPrice = 0
        for (var j in attributes){
            var nameVal = attributes[j].split(":")
            if (nameVal[0] === 'RestaurantsPriceRange2'){
                numPrice += 1
            }
            if (numPrice > 1){
                var newCount = count + 1
                sql += (" OR (business_id IN (SELECT business_id FROM Attributes WHERE attribute_name = $" + (count) + " AND attribute_value = $" + (newCount) + "))")
                arr.push(nameVal[0])
                arr.push(nameVal[1])
                count += 2
            }
            else{
                sql += (" AND business_id IN (SELECT business_id FROM Attributes WHERE attribute_name = $" + (count))
                arr.push(nameVal[0])
                count += 1

                sql += (" AND attribute_value = $" + (count) + ')')
                arr.push(nameVal[1])
                count += 1 
            }
        }

        if (sort.length > 0){
            sql += " ORDER BY "

            if (sort[0] == "stars"){
                sql += "stars desc"
            }
            if (sort[0] == "name"){
                sql += "name"
            }
            if (sort[0] == "num_checkins"){
                sql += "num_checkins desc"
            }
            if (sort[0] == "num_tips"){
                sql += "num_tips desc"
            }
            if (sort[0] == "distance"){
                sql += "distance"
            }
        }
      
        const results = await db.query(sql, arr);

        res.status(200).json(results.rows);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
});

app.listen(port, () => {
    console.log(`We are listening on port ${port}`)
});