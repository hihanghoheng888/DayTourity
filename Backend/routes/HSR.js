var express = require('express');
var router = express.Router();

const db = require ('../database/database.js')

router.get('/', function(req, res, next){
    db.query(
        'SELECT * FROM users', (err, result) => {
            if(err) return res.status(500).send({"message" : err.message})
            res.status(200).send(result)
        }
    )
})

module.exports = router;