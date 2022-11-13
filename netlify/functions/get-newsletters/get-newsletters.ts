import fetch from "node-fetch";
import { Handler } from "@netlify/functions";
import { Event } from "@netlify/functions/dist/function/event";

async function getNewsletters(apiKey: string) {
  const response = await fetch("https://www.getrevue.co/api/v2/issues", {
    headers: {
      Authorization: `Token ${apiKey}`,
    },
  });

  const issues = await response.json();

  return issues;
}

export const handler: Handler = async (event: Event) => {
  const [, unencodedApiKey] = (event.body ?? "").split("=");
  const apiKey = unencodedApiKey ? decodeURIComponent(unencodedApiKey) : null;

  if (!apiKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Looks like you forgot your Revue API key",
      }),
    };
  }

  let issues;

  try {
    issues = await getNewsletters(apiKey);
  } catch (_error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: `Looks like there is something wrong with your API key maybe?`,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(issues, null, 2),
  };
};
