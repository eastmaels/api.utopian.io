import * as mongoose from 'mongoose';
import * as httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import {AuthResponse, getToken} from '../sc2';
import Session from './session.model';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  account: {
    type: String,
    required: true
  },
  schemaVersion: {
    type: Number,
    default: 0,
  },
  github: Object,
  refresh_token: String,
  sc2: new mongoose.Schema({
    token: String,
    refresh_token: String,
    expiry: Date
  }),
  createdAt: {
    type: Date,
    default: Date.now
  },
  details: {
    type: Object,
    default: {
      recoveryAccount: 'steem',
      connectedToSteem: false,
      lastUpdate: Date.now(),
      votingForWiteness: false,
    }
  },
  banned: {
    type: Number,
    default: 0,
  },
  bannedBy: {
    type: String,
    default: "",
  },
  bannedUntil: {
    type: Date,
    default: new Date(0),
  },
  banReason: {
    type: String,
    default: "",
  },
  email_verified: Boolean,
  sms_verified: Boolean,
  email: String,
  phone_number: String,
  social_data: [{
    provider: String,
    social_name: String,
    social_id: String,
    social_verified: Boolean
  }],
  privacy: [{
    date: Date,
    ip: String,
  }],
  tos: [{
    date: Date,
    ip: String,
  }],
  last_passwords: [], // last 4 digits of the last passwords for recovery reasons
  reputation: {
    type: String,
    default: 'Newbie',
  },
  honor_reputation: {
    type: Number,
    default: 0,
  },
  forced_reputation: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 0,
  },
  influence: {
    type: Number,
    default: 0,
  },
});

UserSchema.index({
  'account': 1
}, {
  unique: true
});

UserSchema.post('init', function(this: any) {
  if (this.banned && this.bannedUntil.getTime() < Date.now()) {
    this.banned = 0;
    this.save().catch(e => {
      console.log('Failed to save removed banned status', e);
    });
  }
});

export interface UserModelListOpts {
  skip?: number;
  limit?: number;
}

export interface UserSchemaDoc extends mongoose.Document {
  setSC2Token(token: AuthResponse);
  updateSC2Token();
}

export interface UserSchemaModel extends mongoose.Model<UserSchemaDoc> {
  get(account: any): any;
  list(opts?: UserModelListOpts): any;
}

UserSchema.methods = {
  setSC2Token(token: AuthResponse) {
    this.sc2 = {};
    this.sc2.token = token.access_token;
    this.sc2.refresh_token = token.refresh_token;
    this.sc2.expiry = new Date(Date.now() + (token.expires_in * 1000));
  },
  async updateSC2Token() {
    if (!this.sc2) {
      return this;
    }
    const expiry = this.sc2.expiry as Date;
    // Threshold is used to ensure the token doesn't expire while being used
    // by the server.
    const threshold = 12 * 60 * 60 * 1000;
    if (Date.now() > expiry.getTime() - threshold) {
      if (!this.sc2.refresh_token) {
        this.sc2 = undefined;
        await this.save();
        await Session.remove({ user: this._id });
        return this;
      }

      const token: AuthResponse = await getToken(this.sc2.refresh_token, true);
      if (token.username !== this.account) {
        // This should never happen
        throw new Error('Username and token mismatch');
      }

      this.setSC2Token(token);
      await this.save();
    }
    return this;
  },
  async updateBannedStatus() {
    if (this.banned && new Date(this.bannedUntil).getTime() < Date.now()) {
      this.banned = 0;
      await this.save();
    }
  }
}

UserSchema.statics = {
  get(account) {
    return this.findOne({account})
      .exec()
      .then(user => {
        if (!user) {
          const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
          return Promise.reject(err);
        }
        user.updateSC2Token();
        return user;
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 }: UserModelListOpts = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model<UserSchemaDoc, UserSchemaModel>('User', UserSchema);
