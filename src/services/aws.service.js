import AWS from 'aws-sdk';
import crypto from "crypto";

AWS.config.credentials ={
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}
AWS.config.update({
    region: process.env.AWS_REGION
});
const s3 = new AWS.S3()

const generateRadomName = () => {
    return crypto.randomBytes(32).toString('hex')
}

const putToS3 = async (content) => {
    const response = await s3.putObject({
        Body: content,
        Bucket: process.env.AWS_BUCKET,
        Key: generateRadomName()
    }).promise();

    console.log(response)
};

// const getSingleObject = async (key) => {
//     const response = await s3.getObject({
//         Bucket:  process.env.AWS_BUCKET,
//         Key: key
//     }).promise()
// }

const getAllObjects = async () => {
    const response = await s3.listObjectsV2({
        Bucket: process.env.AWS_BUCKET
    }).promise();

    console.log(response)
}

export default {
    putToS3,
    getAllObjects
}


