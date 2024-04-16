import mongoose from 'mongoose';

export default  async function () {
    try {
        const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/project2';
        console.log(DB_URL)
        const connect = await mongoose.connect( DB_URL);
        console.log("database connected ", DB_URL );
        // mongoose.set('debug', true);
    } catch(e){
        console.error(e)
        console.log('error in connecting mongodb server');
    }
}