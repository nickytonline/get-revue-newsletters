import fetch from "node-fetch";
import { Handler } from "@netlify/functions";

async function getNewsletters(API_KEY: string) {
  const response = await fetch("https://www.getrevue.co/api/v2/issues", {
    headers: {
      Authorization: `Token ${API_KEY}`,
    },
  });

  const issues = await response.json();

  return issues;
}

export const handler: Handler = async (event: { body: string }) => {
  const apiKey = decodeURIComponent(event.body.split("=")[1]);

  if (!apiKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No Revue API" }),
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
