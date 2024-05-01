import axios from "axios";
import { JsonRpcSigner } from "ethers";
import { SiweMessage } from "siwe";

let domain: string;
let origin: string;
if (typeof window !== "undefined") {
  domain = window.location.host;
  origin = window.location.origin;
}

async function createSiweMessage(
  address: string,
  statement: string,
  nonce: string,
) {
  if (!domain || !origin)
    throw new Error("Missing config to create a SIWE message");
  const expiry = new Date(Date.now());
  expiry.setMinutes(expiry.getMinutes() + 5);
  const expirationTime = expiry.toISOString();

  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId: 1,
    nonce: nonce,
    expirationTime,
  });
  return message.prepareMessage();
}

export async function useSiwe(signer: JsonRpcSigner, siweMessageText: string) {
  try {
    const nonceData = await axios.get(`/api/auth/eth`);
    const nonce = nonceData.data.nonce;
    const message = await createSiweMessage(
      await signer.getAddress(),
      siweMessageText,
      nonce,
    );
    const signature = await signer.signMessage(message);
    const { data } = await axios.post(
      `/api/auth/eth`,
      JSON.stringify({ message, signature, nonce }),
    );

    return data;
  } catch (error) {
    console.error("Error while trying to sign in with Ethereum.");
    console.error(error);
  }
}
