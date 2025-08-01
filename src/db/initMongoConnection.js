
import mongoose from "mongoose";
import { getEnvVar } from '../utils/getEnvVar.js';
import  {ENV_VARS} from "../constants/envVars.js";
import dotenv from 'dotenv'

dotenv.config();
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

export const initMongoConnection = async ()  =>  {
    
    const user = getEnvVar(ENV_VARS.MONGODB_USER);
    const pass = getEnvVar(ENV_VARS.MONGODB_PASSWORD);
    const url = getEnvVar(ENV_VARS.MONGODB_URL);
    const db = getEnvVar(ENV_VARS.MONGODB_DB);

    const uri = `mongodb+srv://${user}:${pass}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`;
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Mongo connection successfully established!");
  } catch (err) {
    console.error('Failed to connect to Mongo DB', err);
    process.exit(1);
    
  }
}

