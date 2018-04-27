import Moderator from '../models/moderator.model';
import Session from '../models/session.model';
import * as HttpStatus from 'http-status';
import * as express from 'express';
import * as AWS from 'aws-sdk';
import {start as startTasks} from "../tasks";

let apigateway = new AWS.APIGateway({
    region: 'eu-central-1',
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCES_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
});


export function requireValidOrigin(req, res, next) {
    next(); //for later use
}

export function requireAPIKey(req, res, next) {
    // let key = "none";
    // let id = "none";
    // if (req.query['key']) {
    //     key = req.query['key'];
    // }
    // if (req.headers['x-api-key']) {
    //     key = req.headers['x-api-key'];
    // }
    // if (req.query['keyId']) {
    //     id = req.query['keyId'];
    // }
    // if (req.headers['x-api-key']) {
    //     id = req.headers['x-api-key-id'];
    // }
    //
    // let params = {
    //     apiKey: id, /* required */
    //     includeValue: true
    // };
    // apigateway.getApiKey(params, function (err, data) {
    //     if (err) {
    //         console.log(err)
    //         next(err);
    //     }
    //     else {
    //         if (data.value === key && data.enabled === true) {
    //             req.apiKey = data;
    //             let meta = JSON.parse(data.description ? data.description : "[]");
    //
    //             if (meta.forceOrigin === true) {
    //                 if (req.headers["origin"]) {
    //                     if (meta.origins.includes(req.headers["origin"])) {
    //                         if (process.env.NODE_ENV !== meta.environment) {
    //                             res.json({"error": "Unauthorized", "message": "Wrong environment"})
    //                         } else {
    //                             next();
    //                         }
    //                     } else {
    //                         res.json({"error": "Unauthorized", "message": "Invalid Credentials"})
    //                     }
    //                 } else {
    //                     res.json({"error": "Unauthorized", "message": "Invalid Credentials"})
    //                 }
    //             } else {
    //                 if (process.env.NODE_ENV !== meta.environment) {
    //                     res.json({"error": "Unauthorized", "message": "Wrong environment"})
    //                 } else {
    //                     next();
    //                 }
    //             }
    //         } else {
    //             res.json({"error": "Unauthorized", "message": "Invalid Credentials"})
    //         }
    //
    //     }
    // });
    next();
}

export function requireAuth(req: express.Request,
                            res: express.Response,
                            next: express.NextFunction) {
    const session = req.cookies.session || req.headers.session;
    if (!session) {
        return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    Session.get(session).then(user => {
        if (!user) {
            res.status(HttpStatus.UNAUTHORIZED)
            return res.json({"message": "Unauthorized"})
        }
        return user.updateSC2Token();
    }).then(user => {
        if (!user) {
            return;
        } else if (!user.sc2) {
            return res.sendStatus(HttpStatus.PROXY_AUTHENTICATION_REQUIRED);
        }
        res.locals.session = session;
        res.locals.user = user;
        next();
    }).catch(err => next(err));
}

export function loadMod(req: express.Request,
                        res: express.Response,
                        next: express.NextFunction) {
    const user = res.locals.user;
    if (!user) {
        return next();
    }
    Moderator.findOne({account: user.account}).then((mod: any) => {
        if (mod && !mod.banned) {
            res.locals.moderator = mod;
        }
        next();
    }).catch(err => next(err));
}

export function requireMod(req: express.Request,
                           res: express.Response,
                           next: express.NextFunction) {
    const user = res.locals.user;
    if (!user) {
        res.status(HttpStatus.UNAUTHORIZED)
        return res.json({"message": "Unauthorized"})
    }
    Moderator.findOne({account: user.account}).then((mod: any) => {
        if (!mod || mod.banned) {
            res.status(HttpStatus.UNAUTHORIZED);
            return res.json({"message": "Unauthorized"});
        }
        res.locals.moderator = mod;
        next();
    }).catch(err => next(err));
}

export function requireSupervisor(req: express.Request,
                                  res: express.Response,
                                  next: express.NextFunction) {
    const user = res.locals.user;

    if (!user) {
        res.status(HttpStatus.UNAUTHORIZED)
        return res.json({"message": "Unauthorized"})
    }
    Moderator.findOne({account: user.account}).then((mod: any) => {
        if (!mod || mod.banned || !mod.supermoderator) {
            res.status(HttpStatus.UNAUTHORIZED);
            return res.json({"message": "Unauthorized"});
        }
        res.locals.moderator = mod;
        next();
    }).catch(err => next(err));
}
