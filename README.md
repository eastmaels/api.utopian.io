# api.utopian.io
This is the **node API for Utopian.io**, built in TypeScript.
Utopian wants to reward Open Source contributors for their hard work.

See our sister project (the frontend of Utopian) built in `REACT.js` [here](https://github.com/utopian-io/utopian.io)!

## Contributing
Get in touch on Discord: https://discord.me/utopian-io

### Run a MongoDB Instance
Create a database named utopian-io

### Clone and Install
`git clone https://github.com/utopian-io/api.utopian.io api.utopian.io`

`cd api.utopian.io`

`npm install`

### Create .env file
`UTOPIAN_GITHUB_SECRET=GITHUB_SECRET_HERE`

`UTOPIAN_GITHUB_CLIENT_ID=GITHUB_CLIENT_ID_HERE`

`UTOPIAN_GITHUB_REDIRECT_URL=http://localhost:3000/github/callback`

Replace the Github values by creating a test app for your local environment.

`UTOPIAN_STEEMCONNECT_SECRET=STEEM_CONNECT_SECRET`

`MONGO_HOST=mongodb://localhost/utopian-io`

You can generate a Steem Connect secret by creating an application on https://v2.steemconnect.com/apps/create.

#### (Optional) Utopian-Signup .env variables

`UTOPIAN_SOCIAL_GITHUB_SECRET=SECRET_HERE`

`UTOPIAN_SOCIAL_GITHUB_CLIENT_ID=CLIENT_ID_HERE`

`UTOPIAN_SOCIAL_FACEBOOK_SECRET=SECRET_HERE`

`UTOPIAN_SOCIAL_FACEBOOK_CLIENT_ID=CLIENT_ID_HERE`

`UTOPIAN_SOCIAL_LINKEDIN_SECRET=SECRET_HERE`

`UTOPIAN_SOCIAL_LINKEDIN_CLIENT_ID=CLIENT_ID_HERE`

Create a test-app for each of the providers.

`GOOGLE_MAIL_ACCOUNT=YOUR_EMAIL`

`GOOGLE_MAIL_PASSWORD=YOUR_PASSWORD`

Create or use an existing google account for SMTP email sending.

`NEXMO_API_KEY=NEXMO_KEY`

`NEXMO_API_SECRET=NEXMO_SECRET`

Create a NEXMO account for SMS sending.

`REG_TESTNET=true`

false would equal to main-net and real account creation.

`ACCOUNT_CREATOR=MAIN_NET_STEEM_ACCOUNT`

`ACCOUNT_CREATOR_ACTIVE_KEY=ACTIVE_KEY_FROM_ACCOUNT`

`ACCOUNT_CREATOR_TEST=TEST_NET_STEEM_ACCOUNT`

`ACCOUNT_CREATOR_PASSWORD_TEST=YOUR_PASSWORD_FROM_TESTNET`

Create an account for the test-net through https://testnet.steem.vc/

`REGISTRATION_FRONTEND_PORT=9090`

This port is used for the link-creation in preperation for the email sending in local dev-mode.

### Generate and Export SSL Certificates
`export NODE_TLS_REJECT_UNAUTHORIZED=0`

`openssl req -x509 -sha512 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes`

`export SERVER_SSL_CERT="/path/cert.pem"`

`export SERVER_SSL_KEY="/path/key.pem"`

Replace path with the path to the generated .pem files.
You may need to authorise your browser in using a self-signed SSL certificate

### Run The Backend
`npm run build`

`npm run dev-server`

## License
GNU Public License v3.0. Copyright Utopian.io
