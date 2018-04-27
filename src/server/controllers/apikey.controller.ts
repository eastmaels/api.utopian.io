import * as AWS from 'aws-sdk';

let apigateway = new AWS.APIGateway({
    region: 'eu-central-1',
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCES_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
});

function list(req, res, next) {
    let key = "none";
    let id = "none";
    if (req.query['key']) {
        key = req.query['key'];
    }
    if (req.headers['x-api-key']) {
        key = req.headers['x-api-key'];
    }
    if (req.query['keyId']) {
        id = req.query['keyId'];
    }
    if (req.headers['x-api-key']) {
        id = req.headers['x-api-key-id'];
    }

    let params = {
        apiKey: id, /* required */
        includeValue: true
    };
    apigateway.getApiKey(params, function (err, data) {
        if (err) {
            res.json({
                valid: false,
                err: err
            });
        }
        else {
            let meta = JSON.parse(data.description ? data.description : "{}");
            res.json({
                valid: true,
                owner: data.name,
                forceOrigin: meta.forceOrigin,
                allowedOrigins: meta.origins,
                enabled: data.enabled,
                created: data.createdDate,
                updated: data.lastUpdatedDate
            });
        }
    });
}

export default {list};
