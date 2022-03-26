var express = require("express");
var apiServer = express();
var cors = require("cors");
const mysql = require("mysql2");
var jsonBody = require('body-parser');
var formidable = require('formidable');
apiServer.use(cors());
apiServer.use(jsonBody.urlencoded({extended:true}));

const port = 3000;
const host = "localhost";
apiServer.listen(port, host, () => {
    console.log("Server running at http://%s:%d", host, port);
});

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'test'
});


apiServer.get("/", (request, response)=>{
    response.send("Ciao client sei in home");
});

apiServer.post("/api/insertNewElement",  (request, response)=>{
    console.log("Request: ", request.body);
    conn.query('INSERT INTO test.magazzino VALUES (?, ?, ?)',
        [request.body.codice, request.body.nome, request.body.quantita],
        (err, result)=>{
            console.log("Analysis: ", err, result);
            response.setHeader("Content-Type", "application/json");
            if(result !== undefined)
                response.status(200).json({message:'Element inserted!'});
            else
                response.status(400).json({message:'Element not inserted!'});
        }
    );
});

apiServer.delete("/api/deleteElement",  (request, response)=>{
    console.log("Request: ", request.query);
    conn.query(
        'DELETE FROM test.magazzino WHERE codice=?;',
        request.body.codice,
        (err, result)=>{
            console.log("Analysis: ", err);
            response.setHeader("Content-Type", "application/json");
            if(err==null)
                response.status(200).json({message:'Successful Sign Up!'});
            else
                response.status(400).json({message:'Failed To Sign In!'});
        }
    );
});

apiServer.put("/api/updateElementNumber",  (request, response)=>{
    var form = formidable({multiples:true});
    form.parse(request,(err, fields)=>{
        if(err){
            console.log("Err",err);
            response.status(400).json({message:'Update failed!'});
            return null;
        } else {
            console.log("Richiesta a questo stronzo",fields);
            conn.query(
                'UPDATE test.magazzino SET quantita=? WHERE codice="?";',
                [parseInt(fields.quantita), fields.codice],
                (err)=>{
                    if(err)
                        response.status(400).json({message:'Update failed!'});
                    else
                        response.status(200).json({message:'Updated!'});
                }
            );
        }
    })
});
apiServer.get("/api/getAllElements",  (request, response)=>{
    conn.query(
        'SELECT * FROM test.magazzino',
        (err, result)=>{
            console.log(result);
            response.setHeader("Content-Type", "application/json");
            if(result)
                response.status(200).json({data: result, message:'Successfully retrieved data'});
            else
                response.status(400).json({message:'Can\'t retrieve data!'});
        }
    );
});