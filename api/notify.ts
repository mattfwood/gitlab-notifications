import { NowRequest, NowResponse } from "@vercel/node";
import axios from 'axios';

const USERNAME = 'mwood';
const SLACK_WEBHOOK_ENDPOINT = 'https://hooks.slack.com/services/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'

// async function sendSlackMessage(url: string) {
//   return await axios.post(SLACK_WEBHOOK_ENDPOINT, {
//     text: `New Merge Request Assigned:\n${url}`
//   })
// }

export default async (req: NowRequest, res: NowResponse) => {
  console.log(req.body);

  const newMergeRequest = req.body?.changes?.title?.previous === null;

  console.log({ newMergeRequest })

  if (newMergeRequest) {
    const mergeRequestIncludesUser = req.body.assignees.some((assignee: any) => assignee.username === USERNAME);
    console.log({ mergeRequestIncludesUser })
    if (mergeRequestIncludesUser) {
      // merge request URL isn't included when one is created, so we have to build it ourselves
      const id = req.body?.changes?.iid?.current;
      const url = `${req.body?.repository?.homepage}/-/merge_requests/${id}`;
      console.log({ id, url })

      await axios.post(SLACK_WEBHOOK_ENDPOINT, {
        text: `New Merge Request Assigned:\n${url}`
      })
      return res.send('Slack Notification Sent');
    }
  }

  const previousAssignees = req.body?.changes?.assignees?.previous;
  const updatedAssignees = req.body?.changes?.assignees?.current;

  // if no assignee changes were made, ignore request
  if (!previousAssignees || !updatedAssignees) {
    console.log('No Assignee Changes')
    return res.send('No Action Taken');
  }

  const updateIncludesUser = updatedAssignees.some((assignee: any) => assignee.username === USERNAME);

  if (!updateIncludesUser) {
    console.log('Update does not include user');
    return res.send('No Action Taken');
  }

  const previousIncludesUser = previousAssignees.some((assignee: any) => assignee.username === USERNAME);

  // this means that the user was newly assigned to this user
  if (updateIncludesUser && !previousIncludesUser) {
    // SEND NOTIFICATION
    console.log('NEWLY ASSIGNED MR')
    const url = req.body?.object_attributes?.url

    if (!url) {
      console.warn('URL Not Found for Merge Request');
      return res.send('URL Not Found');
    }

    await axios.post(SLACK_WEBHOOK_ENDPOINT, {
      text: `New Merge Request Assigned:\n${url}`
    })
    return res.send('Slack Notification Sent');
  }

  return res.send('No Action Taken');
};


// {
//   previous: [],
//     current: [
//       {
//         id: 65,
//         name: 'Matt Wood',
//         username: 'mwood',
//         avatar_url: 'https://git.cratebind.com/uploads/-/system/user/avatar/65/avatar.png',
//         email: 'matt@cratebind.com'
//       }
//     ]
// }