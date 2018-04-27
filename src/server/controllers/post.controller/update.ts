import config from '../../../config/config';
import { getContent } from '../../steemAPI';
import User from '../../models/user.model';
import Post from '../../models/post.model';
import * as request from 'superagent';
import questionnaire from './questionnaire';
import * as R from 'ramda';

const validTypes = [
  'tutorials',
  'video-tutorials',
  'copywriting',
  'blog',
  'task-ideas',
  'ideas',
  'task-development',
  'development',
  'task-bug-hunting',
  'bug-hunting',
  'task-translations',
  'translations',
  'task-analysis',
  'analysis',
  'task-graphics',
  'graphics',
  'task-social',
  'social',
  'task-documentation',
  'documentation'
];

export async function getUpdatedPost(author: string, permlink: string) {
  const post = await Post.get(author, permlink);
  const updatedPost: any = await getContent(author, permlink);
  return updatePost(post, updatedPost);
}

export function updatePost(post: any, updatedPost: any): any {
  updatedPost.json_metadata = JSON.parse(updatedPost.json_metadata);

  if (!updatedPost.json_metadata.type && post.json_metadata.type) updatedPost.json_metadata.type = post.json_metadata.type;
  if (updatedPost.json_metadata.app !== 'utopian/1.0.0') updatedPost.json_metadata.app = 'utopian/1.0.0';
  if (updatedPost.json_metadata.community !== 'utopian') updatedPost.json_metadata.community = 'utopian';
  if (!(updatedPost.json_metadata.repository && updatedPost.json_metadata.repository.full_name))
    updatedPost.json_metadata.repository = post.json_metadata.repository;
  if (!updatedPost.json_metadata.platform) updatedPost.json_metadata.platform = post.json_metadata.platform;
  if (!updatedPost.json_metadata.pullRequests && post.json_metadata.pullRequests) updatedPost.json_metadata.pullRequests = post.json_metadata.pullRequests;
  if (!updatedPost.json_metadata.issue && post.json_metadata.issue) updatedPost.json_metadata.issue = post.json_metadata.issue;
  if (updatedPost.json_metadata.type) updatedPost.json_metadata.type = updatedPost.json_metadata.type.replace("announcement-", "task-");
  updatedPost.json_metadata.moderator = post.json_metadata.moderator;
  updatedPost.json_metadata.questions = post.json_metadata.questions;
  updatedPost.json_metadata.score = post.json_metadata.score;
  updatedPost.json_metadata.total_influence = post.json_metadata.total_influence;
  updatedPost.json_metadata.staff_pick = post.json_metadata.staff_pick;
  updatedPost.json_metadata.staff_pick_by = post.json_metadata.staff_pick_by;
  updatedPost.json_metadata.config = post.json_metadata.config || questionnaire[post.json_metadata.type]

  Object.assign(post, updatedPost);
  return post;
}

export async function validateNewPost(post: any,
                                      checkRepo = true,
                                      checkModerated = true): Promise<boolean> {
  // make sure post is not a comment and it has the correct first category
  const existingPost = await Post.getOne(post.author, post.permlink);

  if (post.parent_author !== '') return false;
  if (!(post.parent_permlink === 'utopian-io'
        || (isDev() && post.parent_permlink === 'test-category'))) return false;

  const user = await User.get(post.author);
  if (user.banned) return false;

  if (!post.json_metadata) return false;
  let meta = post.json_metadata;
  if (typeof(meta) === 'string') {
    meta = JSON.parse(meta);
  }
  if (meta.app !== 'utopian/1.0.0') return false;
  if (meta.community !== 'utopian') return false;
  if (!validTypes.includes(meta.type)) return false;

  if (meta.platform === 'github' && !meta.repository) return false;
  if (meta.repository) {
    if (meta.platform !== 'github') return false;
    if (checkRepo && !(await validateRepo(meta.repository))) return false;
  }
  if (meta.pullRequests) {
    if (meta.platform !== 'github') return false;
    const prs = meta.pullRequests;
    if (!Array.isArray(prs)) return false;
    for (let i = 0; i < prs.length; ++i) {
      const pr = prs[i];
      if (!(pr.html_url && pr.title)) return false;
    }
  }
  if (meta.issue) {
    if (meta.platform !== 'github') return false;
    const issue = meta.issue;
    if (!(issue.url
          && issue.number
          && issue.id
          && issue.title)) return false;
  }

  // New posts aren't moderated yet!
  if (checkModerated && meta.moderator) return false;

  // New posts can't have questionaire filled.
  if (checkModerated && meta.questions && meta.questions.length) return false;

  // New posts can't have questionaire score filled.
  if (checkModerated && meta.score) return false;

  // New posts can't be staff picked
  if (checkModerated && (meta.staff_pick || meta.staff_pick_by)) return false;

  if (!existingPost) {
    const beneficiary = R.find(R.propEq('account', 'utopian.pay'))(post.beneficiaries);
    if (!beneficiary || beneficiary.weight < 1500) return false;
  }

  return true;
}

function isDev(): boolean {
  return config.env === 'development';
}

async function validateRepo(repo: any): Promise<boolean> {
  const validData = await getRepo(repo.full_name);
  return validData
          && validData.id === repo.id
          && validData.name === repo.name
          && validData.full_name === repo.full_name
          && validData.html_url === validData.html_url
          && validData.fork === validData.fork
          && (repo.owner && (validData.owner.login === repo.owner.login));
}

async function getRepo(name: string): Promise<any> {
  try {
    if (!name) {
      return undefined;
    }
    name = name.toLowerCase();
    return (await request.get(`https://api.github.com/repos/${name}`, {
      deadline: 5000
    }).query({
      client_id: config.credentials.githubClientId,
      client_secret: config.credentials.githubSecret
    })).body;
  } catch (e) {
    if (e.response.status === 404) {
      return undefined;
    }
    throw e;
  }
}
