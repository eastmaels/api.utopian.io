import {getUpdatedPost, updatePost, validateNewPost} from './update';
import Moderator from '../../models/moderator.model';
import APIError from '../../helpers/APIError';
import {getContent} from '../../steemAPI';
import Post from '../../models/post.model';
import User from '../../models/user.model';
import * as HttpStatus from 'http-status';
import * as sc2 from '../../sc2';
import {top} from './top';
import {moderator} from './moderator';
import questionnaire from './questionnaire';
import * as R from 'ramda';

function postMapper(post) {
    post.pending = false;
    post.reviewed = false;
    post.flagged = false;

    // Enable backwards compatibility for the front end
    if (post.json_metadata.moderator) {
        const mod = post.json_metadata.moderator;
        post.moderator = mod.account || undefined;
        post.pending = mod.pending || false;
        post.reviewed = mod.reviewed || false;
        post.flagged = mod.flagged || false;
    }
    post.json_metadata.config = post.json_metadata.config || questionnaire[post.json_metadata.type];

    return post;
}

function processAnswers (receivedQuestions, metaQuestions, userData, owner) {
    const answers = metaQuestions.answers || Array();
    receivedQuestions.forEach((question, qIndex) => {
        answers.push({
            question_id: question.question_id,
            answer_id: question.answer_id,
            user: userData.account,
            influence: !owner || userData.influence > 60 ? userData.influence : 60, // owners start by same influence as mods
        });
    });
    return answers;
}

function sumAnswersInfluence (answers) {
    let answersInfluence = 0;
    answers.forEach(answer => answersInfluence = answersInfluence + answer.influence);
    return answersInfluence;
}

function processScore (mostScored, configQuestions) {
    let score = 0;
    mostScored.forEach(question => {
        const questionConfig = R.find(R.propEq('question_id', question.question_id))(configQuestions);
        const answerConfig = R.find(R.propEq('answer_id', question.answer_id))(questionConfig.answers);
        score = score + answerConfig.value;
    });
    return score <= 0 ? 0 : score >= 100 ? 100 : score;
}

async function processQuestions (metaData, user, owner, receivedQuestions):Promise<any> {
    const metaQuestions = metaData.questions && metaData.questions.most_rated ?
        metaData.questions :
        {voters : Array(), answers: Array(), total_influence: 0, most_rated: Array()};
    const configQuestions = metaData.config.questions;
    const userData = await User.get(user);
    const influence = userData.influence;
    const receivedAnswers = processAnswers(receivedQuestions, metaQuestions, userData, owner);
    let mostRated = Array();

    configQuestions.forEach((question, qIndex) => {
        question.answers.forEach((answer, aIndex) => {
            const answers = R.filter(R.whereEq({'answer_id': answer.answer_id, 'question_id': question.question_id}))(receivedAnswers) || [];
            let summedInfluence = sumAnswersInfluence(answers);

            const currentTop = R.find(R.propEq('question_id', question.question_id))(mostRated);
            const addTopScored = {
                question_id: question.question_id,
                answer_id: answer.answer_id,
                influence: summedInfluence,
                voters: R.pluck('user')(answers),
            };
            if (!currentTop) {
                mostRated.push(addTopScored)
            }
            if (currentTop && currentTop.influence < summedInfluence) {
                mostRated = mostRated.map(scored => {
                    if (scored.question_id === question.question_id) {
                        return addTopScored
                    }
                    return scored;
                })
            }
            if (configQuestions.length - 1 === qIndex && question.answers.length - 1 === aIndex) {
                metaQuestions.most_rated = mostRated;
            }
        })
    });

    metaQuestions.voters.push(user);
    metaQuestions.answers = receivedAnswers;

    metaData.questions = metaQuestions;
    metaData.total_influence = (metaData.total_influence || 0) + influence;
    metaData.score = processScore(mostRated, configQuestions);

    return metaData;
}

function sendPost(res, post) {
    res.json(postMapper(post));
}

function get(req, res, next) {
    Post.get(req.params.author, req.params.permlink)
        .then(post => sendPost(res, post)).catch(e => next(e));
}

async function create(req, res, next) {
    const author = req.body.author;
    const permlink = req.body.permlink;
    try {
        try {
            const dbPost = await Post.get(author, permlink);
            return sendPost(res, dbPost);
        } catch (e) {
            if (!(e instanceof APIError && e.status === HttpStatus.NOT_FOUND)) {
                return next(e);
            }
        }

        const updatedPost = updatePost({
            json_metadata: {}
        }, await getContent(author, permlink));

        if (await validateNewPost(updatedPost)) {
            const post = new Post(updatedPost);
            return sendPost(res, await post.save());
        }

        return res.sendStatus(HttpStatus.BAD_REQUEST);
    } catch (e) {
        next(e);
    }
}

async function update(req, res, next) {
    const author = req.params.author;
    const permlink = req.params.permlink;
    const flagged = getBoolean(req.body.flagged);
    const moderator = req.body.moderator || null;
    const user = req.body.user || null;
    const pending = getBoolean(req.body.pending);
    const reviewed = getBoolean(req.body.reviewed);
    const staff_pick = getBoolean(req.body.staff_pick);
    const contribType = req.body.type || null;
    const repo = req.body.repository || null;
    const tags = req.body.tags || null;
    const questions = req.body.questions || [];
    const owner = req.body.owner || false;

    try {
        const post = await getUpdatedPost(author, permlink);
        // allow users to set questions, unless they are the same as the author
        if (user && questions.length) {
            if (user === post.author) {
                res.status(HttpStatus.UNAUTHORIZED);
                return res.json({"message": "Unauthorized"});
            }
            post.json_metadata = await processQuestions(post.json_metadata, user, owner, questions);
        }
        if (moderator) {
            if (!post.json_metadata.moderator) {
                post.json_metadata.moderator = {};
            }
            if (!res.locals.moderator
                || (res.locals.moderator.account !== moderator)
                || (res.locals.moderator.account === author)) {
                res.status(HttpStatus.UNAUTHORIZED);
                return res.json({"message": "Unauthorized"});
            }

            if (contribType) {
                post.json_metadata.type = contribType;
                post.json_metadata.config = questionnaire[contribType];
                post.json_metadata.questions = null;
                post.json_metadata.score = null;
                post.json_metadata.total_influence = null;
            }

            if (repo) post.json_metadata.repository = repo;
            if (tags) post.json_metadata.tags = tags;
            if (moderator) post.json_metadata.moderator.account = moderator;
            if (staff_pick) post.json_metadata.staff_pick = true;

            if (reviewed) {
                post.json_metadata.moderator.time = new Date().toISOString();
                post.json_metadata.moderator.reviewed = true;
                post.json_metadata.moderator.pending = false;
                post.json_metadata.moderator.flagged = false;

                // temporary remove until projects are capable to set what they want in their github issues
                /*if (post.json_metadata.type === 'bug-hunting' && !post.json_metadata.issue) {
                 try {
                 const user = await User.get(post.author);
                 if (user.github && user.github.account) {
                 const resGithub = await request.post(`https://api.github.com/repos/${post.json_metadata.repository.full_name.toLowerCase()}/issues`)
                 .set('Content-Type', 'application/json')
                 .set('Accept', 'application/json')
                 .set('Authorization', `token ${user.github.token}`)
                 .send({
                 title: post.title,
                 body: post.body,
                 });
                 const issue = resGithub.body;
                 const { html_url, number, id, title } = issue;

                 post.json_metadata.issue = {
                 url: html_url,
                 number,
                 id,
                 title,
                 };
                 }
                 } catch (e) {
                 console.log("ERROR REVIEWING GITHUB", e);
                 }
                 }*/
            } else if (flagged) {
                post.json_metadata.moderator.time = new Date().toISOString();
                post.json_metadata.moderator.flagged = true;
                post.json_metadata.moderator.reviewed = false;
                post.json_metadata.moderator.pending = false;
            } else if (pending) {
                if (post.json_metadata.moderator.pending === true) {
                    res.status(HttpStatus.FORBIDDEN);
                    return res.json({"message": "This contribution has been reserved already"});
                }

                post.json_metadata.moderator.time = new Date().toISOString();
                post.json_metadata.moderator.pending = true;
                post.json_metadata.moderator.reviewed = false;
                post.json_metadata.moderator.flagged = false;
            }

            try {
                const user = await User.get(post.author);
                await sc2.send('/broadcast', {
                    user,
                    data: {
                        operations: [[
                            'comment',
                            {
                                parent_author: post.parent_author,
                                parent_permlink: post.parent_permlink,
                                author: post.author,
                                permlink: post.permlink,
                                title: post.title,
                                body: post.body,
                                json_metadata: JSON.stringify(post.json_metadata),
                            }
                        ]]
                    }
                });
            } catch (e) {
                console.log('FAILED TO UPDATE POST DURING REVIEW', e);
            }
        }

        try {
            // don't modify json_metadata.moderator when operation is inline edit of category, repo, or tags
            if (questions) {
                post.markModified('json_metadata.questions');
                post.markModified('json_metadata.score');
                post.markModified('json_metadata.total_influence');
            }
            if (contribType) {
                post.markModified('json_metadata.type');
                post.markModified('json_metadata.config');
                post.markModified('json_metadata.questions');
                post.markModified('json_metadata.score');
                post.markModified('json_metadata.total_influence');
            }
            if (repo) post.markModified('json_metadata.repository');
            if (tags) post.markModified('json_metadata.tags');
            if (moderator) post.markModified('json_metadata.moderator');
            if (staff_pick) post.markModified('json_metadata.staff_pick');

            const savedPost = await post.save();
            sendPost(res, savedPost);
        } catch (e) {
            next(e);
        }
    }
}

async function edit(req, res, next) {
    const params = {
        parent_author: '',
        parent_permlink: '',
        author: req.body.author,
        permlink: req.body.permlink,
        title: req.body.title,
        body: req.body.body,
        json_metadata: req.body.json_metadata
    };

    if (typeof(params.json_metadata) === 'string') {
        throw new APIError('Expected object for json_metadata', HttpStatus.BAD_REQUEST, true);
    }

    try {
        // Only grant cross edit permissions to mods
        if (res.locals.user.account !== params.author) {
            const mod = await Moderator.get(res.locals.user.account);
            if (!(mod && mod.isReviewed())) {
                throw new APIError('Only moderators can cross edit', HttpStatus.FORBIDDEN, true);
            }
        }

        // Validate post
        let post = await Post.get(params.author, params.permlink);
        const updatedPost: any = await getContent(params.author, params.permlink);
        if (!(updatedPost && updatedPost.author && updatedPost.permlink)) {
            throw new Error('Cannot create posts from edit endpoint');
        }

        post = updatePost(post, updatedPost);
        post.title = params.title;
        post.body = params.body;
        post.json_metadata = params.json_metadata;
        if (!(await validateNewPost(post, true, false))) {
            throw new APIError('Failed to validate post', HttpStatus.BAD_REQUEST, true);
        }

        // Broadcast the updated post
        const user = await User.get(params.author);
        await sc2.send('/broadcast', {
            user,
            data: {
                operations: [['comment', {
                    ...params,
                    parent_permlink: post.parent_permlink,
                    json_metadata: JSON.stringify(params.json_metadata)
                }]]
            }
        });

        // Update the post in the DB
        post.markModified('json_metadata.repository');
        await post.save();
    } catch (e) {
        next(e);
    }
}

function getPostById(req, res, next) {
    const {postId} = req.params;
    console.log(postId);

    if (postId === parseInt(postId, 10) || !isNaN(postId)) {
        const query = {
            id: postId,
        };

        Post.list({limit: 1, skip: 0, query}).then(post => {
            res.json({
                url: post[0].url,
            });
        }).catch(e => next(e));
    }
}

// going to be deprecated
function list(req, res, next) {
    /*
     section : author | project | all
     type: ideas | code | graphics | social | all
     sortBy: created | votes | reward
     filterBy: active | review | any,
     status: pending | flagged | any
     */
    const { limit, skip, section = 'all', type = 'all', sortBy = 'created', filterBy = 'any', status = 'any', projectId = null, platform = null, author = null, moderator = 'any', bySimilarity = null } = req.query;
    const cashoutTime = '1969-12-31T23:59:59';

    let sort: any = { created: -1 };
    let select: any = {}

    let query: any = {
        deleted: { $ne: true }
    };

    if (moderator !== 'any' && filterBy !== 'review') {
        query = {
            ...query,
            'json_metadata.moderator.account': moderator,
        }
    } else {
        query = {
            ...query,
            'json_metadata.moderator.flagged': {
                $ne: true
            },
        }
    }

    if (section !== 'author' && status !== 'flagged' && moderator === 'any') {
        query = {
            ...query,
            'json_metadata.moderator.reviewed': true,
        }
    }

    if (bySimilarity) {
        select = {
            "score": {
                "$meta": "textScore"
            }
        }
        sort = {
            "score": {
                "$meta": "textScore"
            }
        }
        query = {
            ...query,
            $text: {
                $search: bySimilarity
            }
        },
            {
                score: {
                    $meta: "textScore"
                }
            }
    }

    if (sortBy === 'votes') {
        sort = { net_votes : -1 };
    }

    if (filterBy === 'review') {
        query = {
            ...query,
            'json_metadata.moderator.reviewed': {$ne: true},
            'json_metadata.moderator.account': {
                $ne: moderator,
            }
        }
        sort = { created: 1 }
    }

    if (status === 'pending') {
        query = {
            ...query,
            'json_metadata.moderator.pending': true,
        }
    }

    if (status === 'flagged') {
        query = {
            ...query,
            'json_metadata.moderator.flagged': true,
        }
    }

    if (status === 'reviewed') {
        query = {
            ...query,
            'json_metadata.moderator.reviewed': true,
        }
    }


    if (filterBy === 'active') {
        query = {
            ...query,
            cashout_time:
                {
                    $gt: cashoutTime
                },
        };
    }

    if (filterBy === 'inactive') {
        query = {
            ...query,
            cashout_time:
                {
                    $eq: cashoutTime
                },
        };
    }

    if (type !== 'all') {
        if (type !== 'tasks') {
            query = {
                ...query,
                'json_metadata.type': type,
            };
        } else {
            query = {
                ...query,
                'json_metadata.type': {
                    $regex : (/task-/i)
                }
            };
        }
    }

    if (section === 'project') {
        query = {
            ...query,
            'json_metadata.repository.id': +projectId,
            'json_metadata.platform': platform,
        };
    }

    if (section === 'author') {
        query = {
            ...query,
            author
        };
    }

    Post.countAll({ query })
        .then(count => {
            Post.list({ limit, skip, query, sort, select })
                .then((posts: any[]) => res.json({
                    total: count,
                    results: posts.map(postMapper)
                }))
                .catch(e => next(e));

        })
        .catch(e => next(e));
}

async function browse(req, res, next) {
    let {
        limit = 40,
        skip = 0,
        from = null,
        to = null,
        sort = 'DESC',
        sort_score = 'DESC',
        score_from = null,
        score_to = null,
        influence_from = null,
        influence_to = null,
        tags = null,
        type = 'all',
        status = 'all',
        search = null,
        authors = null,
        projects = null,
        moderators = null,
    } = req.query;

    console.log(req.query);

    if (limit > 100) limit = 100;

    let query: any = {
        deleted: { $ne: true }
    };
    let select: any = {};
    let sortQuery: any = {
        'created': -1,
    };

    // filters

    // type can be any category or task-[category]
    if (type !== 'all') {
        if (type !== 'tasks') {
            query = {
                ...query,
                'json_metadata.type': type,
            };
        } else {
            query = {
                ...query,
                'json_metadata.type': {
                    $regex : (/task-/i)
                }
            };
        }
    }

    if (status !== 'all') {
        query = {
            ...query,
            'json_metadata.moderator': {
                $exists: true,
                $ne: null,
            }
        };

        switch (status) {
            case 'reviewed': {
                query = {
                    ...query,
                    'json_metadata.moderator.reviewed': true,
                };
                break;
            }
            case 'flagged': {
                query = {
                    ...query,
                    'json_metadata.moderator.flagged': true,
                };
                break;
            }
            case 'pending': {
                query = {
                    ...query,
                    'json_metadata.moderator.pending': true,
                };
                break;
            }
        }
    }

    if (from && to) {
        query = {
            ...query,
            'created': {
                $gte: from,
                $lte: to,
            }
        };
    }

    if (score_from && score_to) {
        query = {
            ...query,
            'json_metadata.score': {
                $exists: true,
                $gte: score_from,
                $lte: score_to,
            }
        };
    }

    if (influence_from && influence_to) {
        query = {
            ...query,
            'json_metadata.total_influence': {
                $exists: true,
                $gte: influence_from,
                $lte: influence_to,
            }
        };
    }

    if (tags) {
        query = {
            ...query,
            'json_metadata.tags': {
                $exists: true,
                $in: tags.split(',') || [],
            }
        };
    }

    // owners filters

    if (authors) {
        query = {
            ...query,
            author: {
                $in: authors.split(',') || []
            }
        };
    }

    if (projects) {
        query = {
            ...query,
            'json_metadata.repository': {$exists: true},
            'json_metadata.repository.id': {$in: projects.split(',').map(p => parseInt(p)) || []}
        };
    }

    if (moderators) {
        query = {
            ...query,
            'json_metadata.moderator': {$exists: true},
            'json_metadata.moderator.account': {
                $in: moderators.split(',') || []
            },
        };
    }

    // sorters

    if (sort === 'ASC') {
        sortQuery = {
            'created': 1,
        }
    }

    if (sort_score === 'ASC') {
        sortQuery = {
            ...sortQuery,
            'json_metadata.score': 1,
            'json_metadata.total_influence': 1
        }
    }

    if (sort_score === 'DESC') {
        sortQuery = {
            ...sortQuery,
            'json_metadata.score': -1,
            'json_metadata.total_influence': -1
        }
    }

    // search
    if (search) {
        select = {
            "score": {
                "$meta": "textScore"
            }
        }
        sortQuery = {
            "score": {
                "$meta": "textScore"
            }
        }
        query = {
            ...query,
            $text: {
                $search: search
            }
        },
            {
                score: {
                    $meta: "textScore"
                }
            }
    }

    console.log("QUERY", query)

    Post.list({ limit, skip, query, sortQuery, select })
        .then((posts: any[]) => res.json({
            total: posts.length,
            results: posts.map(postMapper)
        }))
        .catch(e => next(e));
}

function getBoolean(val?: string | boolean): boolean {
    return val === true || val === 'true';
}

export default {
    getPostById,
    get,
    edit,
    create,
    update,
    list,
    browse,
    top,
    moderator
};
