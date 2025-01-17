import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import router from "./routes";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1', router)

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`)
})