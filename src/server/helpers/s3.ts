import * as s3 from 's3';
import * as AWS from 'aws-sdk';
import * as Promise from 'bluebird';
import * as path from 'path';
import * as random from 'randomstring';

let bucket = "utopiancdn";

const awsS3Client = new AWS.S3({
    region: 'eu-central-1',
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCES_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
});

const client = s3.createClient({
    maxAsyncS3: 20,     // this is the default
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 20971520, // this is the default (20 MB)
    multipartUploadSize: 15728640, // this is the default (15 MB),
    s3Client: awsS3Client
});

export function uploadUserFile(filepath, filename, mimetype, username) {
    return new Promise((resolve, reject) => {
        let params = {
            localFile: filepath,

            s3Params: {
                Bucket: bucket,
                Key: "user/" + username + "/" + filename,
                ACL: "public-read",
                ContentType: mimetype
            },
        };
        let uploader = client.uploadFile(params);
        uploader.on('error', function (err) {
            reject({success: false, error: err, filename: filename});
        });

        uploader.on('end', function (data) {
            resolve({
                success: true,
                data: data,
                url: 'https://cdn.utopian.io/user/' + username + '/' + filename,
                filename: filename
            });
        });
    })
}

export function uploadPostImage(filepath, filename, mimetype) {
    let original_filename = filename;
    filename = random.generate({
        length: 36,
        charset: 'hex'
    }) + filename.replace(/ /g, "_");
    return new Promise((resolve, reject) => {
        let params = {
            localFile: filepath,

            s3Params: {
                Bucket: bucket,
                Key: "posts/" + filename,
                ACL: "public-read",
                ContentType: mimetype
            },
        };
        let uploader = client.uploadFile(params);
        uploader.on('error', function (err) {
            reject({success: false, error: err, filename: original_filename});
        });

        uploader.on('end', function (data) {
            resolve({
                success: true,
                data: data,
                url:'https://cdn.utopian.io/posts/'+filename,
                secure_url:'https://cdn.utopian.io/posts/'+filename,
                filename: original_filename
            });
        });
    })
}

export function uploadProjectFile(filepath, filename, projectId, mimetype, type) {
    if (type !== 'video' && type !== 'picture')
        throw new Error("Invalid type. Type can be video or picture");
    return new Promise((resolve, reject) => {
        let params = {
            localFile: filepath,

            s3Params: {
                Bucket: bucket,
                Key: "project/" + projectId + "/" + type + "/" + filename,
                ACL: "public-read",
                ContentType: mimetype
            },
        };
        let uploader = client.uploadFile(params);
        uploader.on('error', function (err) {
            reject({success: false, error: err, filename: filename});
        });

        uploader.on('end', function (data) {
            resolve({
                success: true,
                data: data,
                url: 'https://cdn.utopian.io/project/' + projectId + '/' + type + '/' + filename,
                filename: filename
            });
        });
    })
}

export function deleteUserFile(username, filename) {
    console.log(filename)
    return new Promise((resolve, reject) => {
        let params = {
            Bucket: bucket,
            Delete: {
                Objects: [
                    {
                        Key: "user/" + username + '/' + filename
                    }
                ],
                Quiet: false
            }
        };
        let deleteRequest = client.deleteObjects(params);

        deleteRequest.on('error', function (err) {
            reject({success: false, error: err, filename: filename});
        });

        deleteRequest.on('end', function (data) {
            resolve({
                success: true,
                data: data,
                filename: filename
            });
        });

    });
}

export function deleteProjectFile(projectId, type, filename) {
    console.log(filename)
    return new Promise((resolve, reject) => {
        let params = {
            Bucket: bucket,
            Delete: {
                Objects: [
                    {
                        Key: "project/" + projectId + "/" + type + "/" + filename
                    }
                ],
                Quiet: false
            }
        };
        let deleteRequest = client.deleteObjects(params);

        deleteRequest.on('error', function (err) {
            reject({success: false, error: err, filename: filename});
        });

        deleteRequest.on('end', function (data) {
            resolve({
                success: true,
                data: data,
                filename: filename
            });
        });

    });
}

export function uploadBotLog(slug) {
    return new Promise((resolve, reject) => {
        let params = {
            localFile: 'bot.log',

            s3Params: {
                Bucket: bucket,
                Key: "bot-logs/" + slug + '-bot.log',
                ACL: "public-read",
                ContentType: "text/plain"
            },
        };
        let uploader = client.uploadFile(params);
        uploader.on('error', function (err) {
            console.log(err);
            reject(err);
        });

        uploader.on('end', function (data) {
            resolve(data);
        });
    })
}