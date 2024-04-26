export type ChainConfig = {
  chainName: string;
  chainId: string;
  easContractAddress?: string;
  privateAttestationSchemaUUId?: string;
  attestationSchemaUUId?: string;
};

export type ChainsConfig = {
  [key: string]: ChainConfig;
};

export const chainsConfig: ChainsConfig = {
  11_155_111: {
    chainName: "sepolia",
    chainId: "11155111",
    easContractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    privateAttestationSchemaUUId:
      "0x20351f973fdec1478924c89dfa533d8f872defa108d9c3c6512267d7e7e5dbc2",
  },
  8453: {
    chainName: "base",
    chainId: "8453",
    easContractAddress: "TODO",
    attestationSchemaUUId: "TODO",
  },
};
