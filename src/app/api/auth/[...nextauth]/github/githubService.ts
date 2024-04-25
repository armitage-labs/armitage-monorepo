import jwt from "jsonwebtoken";
import fs from "fs";

interface Payload {
  iat: number;
  exp: number;
  iss: string;
}

export function generateGitHubAppJWT(): string {
  const privatePem = fs.readFileSync(process.env.GITHUB_APP_PRIVATE_KEY!);
  // Generate the JWT
  const payload: Payload = {
    iat: Math.floor(Date.now() / 1000) - 60, // Issued at time, 60 seconds in the past
    exp: Math.floor(Date.now() / 1000) + 10 * 60, // JWT expiration time (10 minutes)
    iss: process.env.GITHUB_APP_ID!, // GitHub App's identifier
  };

  // Sign the JWT using the private key
  const token = jwt.sign(payload, privatePem, { algorithm: "RS256" });
  return token;
}

export async function createAccessToken(
  jwtToken: string,
  installationId: string,
) {
  const url = `https://api.github.com/app/installations/${installationId}/access_tokens`;
  const response = await post(url, jwtToken);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const responseData = await response.json();
  return responseData;
}

export async function getInstallations(jwtToken: string) {
  const url = `https://api.github.com/app/installations`;
  const response = await get(url, jwtToken);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const responseData = await response.json();
  return responseData;
}

export async function getInstallationRepos(jwtToken: string) {
  const url = `https://api.github.com/app/installations`;
  const response = await get(url, jwtToken);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const responseData = await response.json();
  return responseData;
}

async function get(url: string, jwtToken: string): Promise<Response> {
  const headers = {
    Authorization: `Bearer ${jwtToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const options = {
    method: "GET",
    headers: headers,
  };
  return await fetch(url, options);
}

async function post(url: string, jwtToken: string): Promise<Response> {
  const headers = {
    Authorization: `Bearer ${jwtToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const options = {
    method: "POST",
    headers: headers,
  };
  return await fetch(url, options);
}
