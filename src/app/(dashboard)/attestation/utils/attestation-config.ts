export type ChainConfig = {
  chainName: string;
  chainId: string;
  easscanUrl: string;
  easContractAddress?: string;
  publicAttestationSchemaUUId?: string;
  privateAttestationSchemaUUId?: string;
};

export type ChainsConfig = {
  [key: string]: ChainConfig;
};

export const chainsConfig: ChainsConfig = {
  11_155_111: {
    chainName: "sepolia",
    chainId: "11155111",
    easscanUrl: "https://sepolia.easscan.org",
    easContractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    publicAttestationSchemaUUId:
      "0xdd55069b521b51585a2d09bed03cecde4524d4392683dc3c3c3cf09755a2a5b2",
    privateAttestationSchemaUUId:
      "0x20351f973fdec1478924c89dfa533d8f872defa108d9c3c6512267d7e7e5dbc2",
  },
  84532: {
    chainName: "base-sepolia",
    chainId: "84532",
    easscanUrl: "https://base-sepolia.easscan.org",
    easContractAddress: "0x4200000000000000000000000000000000000021",
    publicAttestationSchemaUUId:
      "0xdd55069b521b51585a2d09bed03cecde4524d4392683dc3c3c3cf09755a2a5b2",
    privateAttestationSchemaUUId:
      "0x20351f973fdec1478924c89dfa533d8f872defa108d9c3c6512267d7e7e5dbc2",
  },
  8453: {
    chainName: "base",
    chainId: "8453",
    easscanUrl: "https://base.easscan.org",
    easContractAddress: "0x4200000000000000000000000000000000000021",
    publicAttestationSchemaUUId:
      "0xdd55069b521b51585a2d09bed03cecde4524d4392683dc3c3c3cf09755a2a5b2",
    privateAttestationSchemaUUId:
      "0x20351f973fdec1478924c89dfa533d8f872defa108d9c3c6512267d7e7e5dbc2",
  },
};
