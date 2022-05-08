const hre = require("hardhat");
const { BigNumber, utils } = require('ethers');

let contractAddress;
let provider;

function initialize(ethersProvider, address) {
  provider = ethersProvider;
  contractAddress = address;
}

async function getA() {
  // TODO: implement storageLayoutContract.a() using provider.getStorageAt()

  return BigNumber.from(await provider.getStorageAt(contractAddress, 0));
}

async function getB() {
  // TODO: implement storageLayoutContract.b() using provider.getStorageAt()

  const bitMask = 16; // keep only the right-most 16 bits

  const b = BigNumber.from(await provider.getStorageAt(contractAddress, 1));

  return b.mask(bitMask);
}

async function getC() {
  // TODO: implement storageLayoutContract.c() using provider.getStorageAt()

  const shiftRight = 2 ** 16; // shift value to the right by 16 bits
  const bitMask = 16; // keep only the right-most 16 bits

  const c = BigNumber.from(await provider.getStorageAt(contractAddress, 1));

  return c.div(shiftRight).mask(bitMask);
}

async function getDataArrayLength() {
  // TODO: implement `length(storageLayoutContract.dataArray())` using provider.getStorageAt()

  return BigNumber.from(await provider.getStorageAt(contractAddress, 2));
}

async function getDataArrayValueAtIndex(arrayIndex) {
  // TODO: implement `storageLayoutContract.dataArray(arrayIndex)` using provider.getStorageAt()

  // pad slot to 32 * 8 bits = 256 bits
  const hexStringStorageSlot = utils.hexZeroPad('0x2', 32);

  // get the hash of the array marker slot, as the hash is the actual starting point of the data in the array
  const dataArrayBaseSlot = utils.keccak256(hexStringStorageSlot);

  // add the array item index offset to the base slot to get an individual item
  const dataArrayOffsetSlot = BigNumber.from(dataArrayBaseSlot)
    .add(arrayIndex)
    .toHexString();

  return BigNumber.from(
    await provider.getStorageAt(contractAddress, dataArrayOffsetSlot)
  );
}

async function getOuterDataArrayLength() {
  // TODO: implement `length(storageLayoutContract.nestedDataArray())` using provider.getStorageAt()

  return BigNumber.from(
    await provider.getStorageAt(contractAddress, 3)
  );
}

async function getInnerDataArrayLength(arrayIndex) {
  // TODO: implement `length(storageLayoutContract.nestedDataArray(arrayIndex))` using provider.getStorageAt()

  // pad slot to 32 * 8 bits = 256 bits
  const hexStringStorageSlot = utils.hexZeroPad('0x3', 32);

  // get the hash of the array marker slot, as the hash is the actual starting point of the data in the array
  const dataArrayBaseSlot = utils.keccak256(hexStringStorageSlot);

  // add the array item index offset to the base slot to get an individual item
  const dataArrayOffsetSlot = BigNumber.from(dataArrayBaseSlot)
    .add(arrayIndex)
    .toHexString();

  return BigNumber.from(
    await provider.getStorageAt(contractAddress, dataArrayOffsetSlot)
  );
}

async function getInnerDataArrayValueAtIndices(arrayIndex1, arrayIndex2) {
  // TODO: implement `storageLayoutContract.dataArray(arrayIndex)` using provider.getStorageAt()

  // pad slot to 32 * 8 bits = 256 bits
  const hexStringStorageSlot = utils.hexZeroPad('0x3', 32);

  // get the hash of the array marker slot, as the hash is the actual starting point of the data in the array
  const outerDataArrayBaseSlot = utils.keccak256(hexStringStorageSlot);

  // add the array item index offset to the base slot to get an individual item
  const outerNestedDataArrayOffset = BigNumber.from(outerDataArrayBaseSlot)
    .add(arrayIndex1)
    .toHexString();

  const outerNestedDataArrayOffsetSlot = utils.keccak256(
    outerNestedDataArrayOffset
  );

  const innerNestedDataArrayOffsetSlot = BigNumber.from(
    outerNestedDataArrayOffsetSlot
  )
    .add(arrayIndex2)
    .toHexString();

  return BigNumber.from(
    await provider.getStorageAt(
      contractAddress,
      innerNestedDataArrayOffsetSlot
    )
  );
}

async function getDataMapValues(key) {
  // TODO: implement storageLayoutContract.dataMap() using provider.getStorageAt()

  const hexStringStorageSlot = utils.hexZeroPad('0x4', 32);

  const hexKey = key.toString(16);
  const paddedKey = utils.hexZeroPad('0x' + hexKey, 32);
  const mappingSlot = utils.keccak256(
    paddedKey + hexStringStorageSlot.slice(2)
  );

  return BigNumber.from(
    await provider.getStorageAt(contractAddress, mappingSlot)
  );
}

async function getStructDataMap(key) {
  // TODO: implement storageLayoutContract.structDataMap() using provider.getStorageAt()

  const hexStringStorageSlot = utils.hexZeroPad('0x5', 32);

  const hexKey = key.toString(16);
  const paddedKey = utils.hexZeroPad('0x' + hexKey, 32);
  const mappingSlot = utils.keccak256(
    paddedKey + hexStringStorageSlot.slice(2)
  );

  const mappingSlot2 = BigNumber.from(mappingSlot).add(1).toHexString();

  console.log({ mappingSlot });
  console.log({ mappingSlot2 });

  const a = provider.getStorageAt(contractAddress, mappingSlot);
  const b = provider.getStorageAt(contractAddress, mappingSlot2);

  return await provider.getStorageAt(
    contractAddress,
    mappingSlot
  );
}

exports.StorageLayout = {
  initialize: initialize,
  getA: getA,
  getB: getB,
  getC: getC,
  getDataArrayLength: getDataArrayLength,
  getDataArrayValueAtIndex: getDataArrayValueAtIndex,
  getOuterDataArrayLength: getOuterDataArrayLength,
  getInnerDataArrayLength: getInnerDataArrayLength,
  getInnerDataArrayValueAtIndices: getInnerDataArrayValueAtIndices,
  getDataMapValues: getDataMapValues,
  getStructDataMap: getStructDataMap,
};