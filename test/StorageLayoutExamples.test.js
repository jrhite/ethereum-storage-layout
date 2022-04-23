const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, waffle } = require("hardhat");

const provider = waffle.provider;
const utils = ethers.utils;

describe('StorageLayoutExamples', function () {
  let StorageLayoutExamples;
  let storageLayoutExamples;

  before(async function () {
    StorageLayoutExamples = await ethers.getContractFactory('StorageLayoutExamples');
    storageLayoutExamples = await StorageLayoutExamples.deploy();
    
    await storageLayoutExamples.deployed();
  });

  async function getA() {
    // TODO: implement storageLayoutExamples.a() using provider.getStorageAt()
    
    const bitMask = 16; // keep only the right-most 16 bits

    const a = BigNumber.from(await provider.getStorageAt(storageLayoutExamples.address, 0));

    return a.mask(bitMask);
  }

  async function getB() {
    // TODO: implement storageLayoutExamples.b() using provider.getStorageAt()

    const shiftRight = 2 ** 16; // shift value to the right by 16 bits
    const bitMask = 16; // keep only the right-most 16 bits

    const b = BigNumber.from(await provider.getStorageAt(storageLayoutExamples.address, 0));

    return b.div(shiftRight).mask(bitMask);
  }

  async function getC() {
    // TODO: implement storageLayoutExamples.c() using provider.getStorageAt()

    return BigNumber.from(await provider.getStorageAt(storageLayoutExamples.address, 1));
  }

  async function getDataArrayLength() {
    // TODO: implement `length(storageLayoutExamples.dataArray())` using provider.getStorageAt()

    return BigNumber.from(await provider.getStorageAt(storageLayoutExamples.address, 2));
  }

  async function getDataArrayValueAtIndex(arrayIndex) {
    // TODO: implement `storageLayoutExamples.dataArray()` using provider.getStorageAt()

    // pad slot to 32 * 8 bits = 256 bits
    const hexStringStorageSlot = utils.hexZeroPad('0x2', 32);

    // get the hash of the array marker slot, as the hash is the actual starting point of the data in the array
    const dataArrayBaseSlot = utils.keccak256(hexStringStorageSlot);

    // add the array item index offset to the base slot to get an individual item
    const dataArrayOffsetSlot = BigNumber.from(dataArrayBaseSlot).add(arrayIndex).toHexString();

    return BigNumber.from(await provider.getStorageAt(storageLayoutExamples.address, dataArrayOffsetSlot));
  }

  it("Primitive values in storage layout should be correct", async function () {
    expect(await storageLayoutExamples.a()).to.equal(await getA());
    expect(await storageLayoutExamples.b()).to.equal(await getB());
    expect(await storageLayoutExamples.c()).to.equal(await getC());
  });

  it('Dynamic array length and values in storage layout should be correct', async function () {
    const dataArrayLength = await getDataArrayLength();
    expect(3).to.equal(dataArrayLength);

    for (let i = 0; i < dataArrayLength; i++) {
      expect(await storageLayoutExamples.dataArray(i)).to.equal(await getDataArrayValueAtIndex(i));
    }
  });
});
