const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const polygon = {
  rpcUrl: process.env.POLYGON_RPC,
  startBlock: 49831226,
  borrowables: [
    "0xA63c42E1853C217a76452e3ADc2f8C33ce84AF04",
    "0xc3ea15ba8C6940245f91C50C594f4A3bf27D9401",
    "0xd52145c498B58815676b078f49219944d3d7d104",
    "0xA1E7D8e7854D32221e4Be06944dEBD9bbC2365C5",
    "0x3154aEc5a8923E62f2FFB96dB632e59650d71d8C",
    "0xe1bAd7e85b2F8036973c3ae97B04d8417Aa90852",
    "0xC6B9F472F7Feab07bac086b1022599B67E0329EF",
    "0xfEd62c3BA41B05520D2E2e67371a94cA034C0E5f",
  ],
  collaterals: [
    "0x6e954Bd5002E8F43e8513386Bd3326D0C7c9168e",
    "0x28576910979fbfc4668CE0DdEf69c167B5C96Fab",
    "0x142291a170c30a56089dC5d3D5038E88C18431BA",
    "0xcD029F193a7F4d59573B33439E6cdc4C8EA2Ac15",
    "0xb72958c5F3b6090124eDda4591cE2b0e8EED73be",
    "0xa2995F4dc4dFDe1A704C6033c5BA193Cb1ABe4cd",
    "0xf65Dc4066696f062D933cA27Be1Ab60485729e2D",
    "0x97Ee60e04EbB95114d8726555542C7dA1eEad3b0",
  ],
  vault: "0x6A4559Fdd15B3F4C46706edaFB49495A7f516120",
};

const arbitrum = {
  rpcUrl: process.env.ARBITRUM_RPC,
  startBlock: 150521724,
  borrowables: [
    "0xE0294B0a4bC39e9Bd88dcC32105Bd0cD2689c6c0",
    "0x27314579D48209786491ade5621a2cc3c2b2a644",
    "0x2236993E0a2F1dA1A9dC41A4F93547363210C5b2",
    "0x929A21720bae72d088a003337Ea882069930548d",
    "0x49B7ad73f8B02Bc43A2f9F189b7769dfbd826CDe",
    "0xab4C8c2f4c75c48c53046e7F99E86661CA2C92e5",
    "0x864c5301bb546839f77f428d96b2D1A97cf5a04b",
    "0x61099838351750638b776457E984360657a92CE3",
    "0x96e4Fb4BD05a9aaEa646154C1A37CCada26e7D27",
  ],
  collaterals: [
    "0x349fB2fbFDF358396541D445253ce9E4f0c9DD42",
    "0xd1fAebDF6f22d37a6DFd7Cd3753931b296d80dde",
    "0x2267de4Fa12216a0fdA7596a49C411Db9B9EBF90",
    "0x0773346Ae430A64aaDf6CB6069CeE69031FD9397",
    "0x23EE8C21d939811efA71Ba4429b7Ba844b694445",
    "0x52ae2574E628480D72a5C8FF8479D6Ec7d255e2f",
    "0x1116046cf97BF87aB74b504fD146f266A20Da845",
    "0x9324f538B57d972E1926dDD14cad7437Ac1E4B00",
  ],
  vault: "0x13B724739eB033A5336240E11CfB7ffF5Fb8C642",
};

const zkevm = {
  rpcUrl: process.env.ZKEVM_RPC,
  startBlock: 9679905,
  borrowables: [
    "0x38d378d9739F85D2B9086d9618764ec9f12f938B",
    "0x1a063a63F887c65f072e5eCC8f4495D35442C35c",
    "0x6e21d1848bE1505c3EA403a261284e45b3dab663",
    "0x0390d0821985E293F4A05294367EcB7a47156024",
  ],
  collaterals: [
    "0x9222E903087877DbD96EA48ec489118d8f8D9519",
    "0x84B8Cf5425e378A4dE220448c7AedcC80f7Ae98c",
    "0x1a0F773661f19ba339E70c20C3e0ee4e4C46FAAB",
    "0x5fc9787c4B60e2eC5414D89CbEeEaB3160b97b2a",
  ],
};

const chains = {
  polygon,
  arbitrum,
  zkevm,
};

module.exports = chains;
