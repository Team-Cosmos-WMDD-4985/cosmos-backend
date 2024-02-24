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

const putToS3 = async (content, isVectorStore) => {
    if(isVectorStore) {
        content = JSON.stringify(content)
    }
    const key = generateRadomName();
    const response = await s3.putObject({
        Body: content,
        Bucket: process.env.AWS_BUCKET,
        Key: key
    }).promise();

    console.log(response);
    return key;
};

const getSingleObject = async (key, isVectorStore) => {
    const response = await s3.getObject({
        Bucket:  process.env.AWS_BUCKET,
        Key: key
    }).promise()

    console.log(response);
    if(isVectorStore) {
        return JSON.parse(response.Body.toString())
    } else {
        return response.Body
    }
}

export default {
    putToS3,
    getSingleObject
}


