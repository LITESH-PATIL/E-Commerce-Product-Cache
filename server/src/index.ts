import express from "express";
import "dotenv/config";


const app = express();
const port = process.env.PORT ?? 3000;


try {
    app.listen(port,()=>{
        console.log(`Server is listening on port : ${port}`)
    })
} catch (error) {
    console.log("Error : "+ error);
    process.exit(1);
}