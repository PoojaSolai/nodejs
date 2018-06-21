'use strict';
 
const aws = require('aws-sdk');


const config = new aws.Config({
    accessKeyId: 'AKIAI5K3OKJMQD35663A',
    secretAccessKey: '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',
    region: 'ap-south-1'
});

aws.config.update(config);

const s3 = new aws.S3({
    signatureVersion: 'v4',
    region: 'ap-south-1'
});
 
exports.signedRequest = function (req, res) {
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: 'takephoto-test-bucket',
        Key:   fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'private'
    };
    
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${s3Params.Bucket}.s3.amazonaws.com/${s3Params.Key}`
        }
 
        return res.json(returnData);
    });
};
 
exports.getFileSignedRequest = function (req, res) {
    const s3Params = {
        Bucket: 'takephoto-test-bucket',
        Key: req.params.fileName,
        Expires: 60,
    };
 
    s3.getSignedUrl('getObject', s3Params, (err, data) => {
        return res.json(data);
    });
}
 
 
exports.listFiles = function (req, res) {
    const s3Params = { 
        Bucket: 'takephoto-test-bucket',
        Delimiter: '/'
    };
    
    s3.listObjects(s3Params, function (err, data) {
        if (err) {
            console.log(err);
            return res.end();
        }
        return res.json(data);
    });
}
 
exports.deleteFile = function (req, res) {
    const s3Params = { 
        Bucket: 'takephoto-test-bucket',
        Key: req.params.fileName
    };
 
    s3.deleteObject(s3Params, function (err, data) {
        if (err) {
            console.log(err);
            return res.end();
        }
 
        return res.status(200).send({ "msg": "File deleted" });
    });
};
