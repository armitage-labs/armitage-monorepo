import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { JsonRpcSigner } from "ethers";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import {
  EncodedMerkleValue,
  MerkleValueWithSalt,
  decodeMerkleValues,
  encodeMerkleValues,
  encodeValuesToMerkleTree,
} from "./merkle-utils";

export type CreateAttestationBodyDto = {
  address: string;
  privateData: AttestationPrivateDataDto;
  signer: JsonRpcSigner;
  salt: string;
};

export type AttestationPrivateDataDto = {
  [key: string]: string;
};

export type ContributorDataDto = {
  githubUsername: string;
  rank: string;
  score: string;
};

export type WeightsConfigDto = {
  prReview: string;
  pr: string;
};

export type AttestationUuidDto = {
  attestationUuid: string;
};

export async function createAttestation({
  address,
  privateData,
  signer,
  salt,
}: CreateAttestationBodyDto): Promise<AttestationUuidDto> {
  // Sepolia private data schema
  // @TODO Implement a mapping to reference the correct private data schema for each network
  const schemaUID =
    "0x20351f973fdec1478924c89dfa533d8f872defa108d9c3c6512267d7e7e5dbc2";

  const merkleTree = createMerkleTree(privateData, salt);
  const merkleRoot = merkleTree.root;

  const eas = await initializeEAS(signer);
  const schemaEncoder = new SchemaEncoder("bytes32 privateData");
  const encodedData = schemaEncoder.encodeData([
    { name: "privateData", value: merkleRoot, type: "bytes32" },
  ]);

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: address,
      expirationTime: undefined,
      revocable: false,
      data: encodedData,
    },
  });
  const attestationUuid = await tx.wait();

  return { attestationUuid: attestationUuid };
}

export function createMerkleTree(
  privateData: AttestationPrivateDataDto,
  salt: string,
): StandardMerkleTree<EncodedMerkleValue> {
  const merkleTreeValuesWithSalt: MerkleValueWithSalt[] = [];

  let privateDataKey: keyof AttestationPrivateDataDto;
  for (privateDataKey in privateData) {
    merkleTreeValuesWithSalt.push({
      type: "string",
      name: privateDataKey,
      value: privateData[privateDataKey],
      salt: salt,
    } as MerkleValueWithSalt);
  }
  return encodeValuesToMerkleTree(merkleTreeValuesWithSalt);
}

export function createProofs(
  privateData: AttestationPrivateDataDto,
  fields: string[],
  salt: string,
) {
  const merkleTree = createMerkleTree(privateData, salt);
  let privateDataKey: keyof AttestationPrivateDataDto;
  const valuesWithSalt: MerkleValueWithSalt[] = [];
  for (privateDataKey in privateData) {
    if (fields.includes(privateDataKey)) {
      valuesWithSalt.push(
        valueWithSalt(privateDataKey, privateData[privateDataKey], salt),
      );
    }
  }
  const merkleValues = encodeMerkleValues(valuesWithSalt);
  const multiproof = merkleTree.getMultiProof(merkleValues);
  const proofs = {
    ...multiproof,
    leaves: decodeMerkleValues(multiproof.leaves),
  };

  return { proofs: proofs };
}

function valueWithSalt(
  field: string,
  value: string,
  salt: string,
): MerkleValueWithSalt {
  return {
    type: "string",
    name: field,
    value: value,
    salt,
  };
}

export async function initializeEAS(signer: JsonRpcSigner): Promise<EAS> {
  // Sepolia v0.26 schema contract
  const easContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
  const eas = new EAS(easContractAddress);
  eas.connect(signer);
  return eas;
}
