import { AbiCoder } from "ethers";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

export type FullMerkleDataTree = {
  root: string;
  values: MerkleValueWithSalt[];
};

export type FullMerkleProofTreeWithRelatedUid = FullMerkleDataTree & {
  relatedUid: string;
};

export interface MerkleMultiProof {
  leaves: Leaf[];
  proof: string[];
  proofFlags: boolean[];
}

export interface Leaf {
  type: string;
  name: string;
  value: any;
  salt: string;
}

export type PartialMerkleProof = {
  /** Hash of the partial proof */
  id: string;
  root: string;
  proof: MerkleMultiProof;
  relatedUid: string;
};

export interface MerkleValue {
  type: string;
  name: string;
  value: any;
}

export type MerkleValueWithSalt = MerkleValue & { salt: string };

export type EncodedMerkleValue = [string, string, string, string];

export const merkleValueAbiEncoding: EncodedMerkleValue = [
  "string",
  "string",
  "bytes",
  "bytes32",
];

export function encodeValuesToMerkleTree(
  valuesWithSalt: MerkleValueWithSalt[],
) {
  const encodedValues = encodeMerkleValues(valuesWithSalt);

  return StandardMerkleTree.of(encodedValues, merkleValueAbiEncoding);
}

export function encodeMerkleValues(
  inValues: MerkleValueWithSalt[],
): EncodedMerkleValue[] {
  const abiCoder = new AbiCoder();
  return inValues.map((v) => [
    v.type,
    v.name,
    abiCoder.encode([v.type], [v.value]),
    v.salt,
  ]);
}

export function verifyFullMerkleTree(tree: FullMerkleDataTree): string {
  const encodedValues = encodeMerkleValues(tree.values);
  const merkleTree = StandardMerkleTree.of(
    encodedValues,
    merkleValueAbiEncoding,
  );
  return merkleTree.root;
}

export function decodeMerkleValues(
  inValues: EncodedMerkleValue[],
): MerkleValueWithSalt[] {
  const abiCoder = new AbiCoder();
  return inValues.map((v) => ({
    type: v[0],
    name: v[1],
    value: abiCoder.decode([v[0]], v[2])[0],
    salt: v[3],
  }));
}

export function verifyMultiProof(
  root: string,
  proof: MerkleMultiProof,
): boolean {
  const multiproof = {
    ...proof,
    leaves: encodeMerkleValues(proof.leaves),
  };

  return StandardMerkleTree.verifyMultiProof(
    root,
    merkleValueAbiEncoding,
    multiproof,
  );
}
