# GitLab Merge Request Notifications

Had to create hack because there's no way to create something this specific with the existing GitLab + Slack Integrations

### What This Does
Whenever a merge request is newly assigned to you, sends you a slack message with the merge request's URL

### Setting Up

1. Clone this repo
2. In `api/notify.ts`, change the `USERNAME` variable to be your username.
3. Go to slack and [create an incoming webhook](https://api.slack.com/messaging/webhooks#create_a_webhook) and set it up to send messages to your account
4. Run `yarn deploy` to deploy to Vercel (you'll need an account if you don't have one)
5. Add the environment variable `SLACK_WEBHOOK_URL` with the URL from your created webhook
6. Go to GitLab and go to system hooks (https://<YOUR GITLAB URL>/admin/hooks) and create one for merge request events.
7. Enter your Vercel deployment URL
