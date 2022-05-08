const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, waffle } = require("hardhat");

const { StorageLayout } = require("../scripts/StorageLayout");

const provider = waffle.provider;

describe('StorageLayout', function () {
  let StorageLayoutContractFactory;
  let storageLayoutContract;

  before(async function () {
    StorageLayoutContractFactory = await ethers.getContractFactory('StorageLayoutContract');
    storageLayoutContract = await StorageLayoutContractFactory.deploy();
    
    await storageLayoutContract.deployed();

    StorageLayout.initialize(provider, storageLayoutContract.address);
  });

  it("Primitive values in storage layout should be correct", async function () {
    expect(await storageLayoutContract.a()).to.equal(
      await StorageLayout.getA()
    );
    expect(await storageLayoutContract.b()).to.equal(await StorageLayout.getB());
    expect(await storageLayoutContract.c()).to.equal(
      await StorageLayout.getC()
    );
  });

  it('Dynamic array length and values in storage layout should be correct', async function () {
    const dataArrayLength = await StorageLayout.getDataArrayLength();
    
    expect(3).to.equal(dataArrayLength);

    for (let i = 0; i < dataArrayLength; i++) {
      expect(await storageLayoutContract.dataArray(i)).to.equal(await StorageLayout.getDataArrayValueAtIndex(i));
    }
  });

  it('Nested dynamic array length and values in storage layout should be correct', async function () {
    const outerDataArrayLength = await StorageLayout.getOuterDataArrayLength();

    expect(2).to.equal(outerDataArrayLength);

    expect(3).to.equal(await StorageLayout.getInnerDataArrayLength(0));
    expect(2).to.equal(await StorageLayout.getInnerDataArrayLength(1));

    for (let i = 0; i < outerDataArrayLength; i++) {
      const innerDataArrayLength = await StorageLayout.getInnerDataArrayLength(
        i
      );

      for (let j = 0; j < innerDataArrayLength; j++) {
        expect(await storageLayoutContract.nestedDataArray(i, j)).to.equal(
          await StorageLayout.getInnerDataArrayValueAtIndices(i, j)
        );
      }
    }
  })

  it('Mapping values in storage layout should be correct', async function () {
    expect(await storageLayoutContract.dataMap(5)).to.equal(
      await StorageLayout.getDataMapValues(5)
    );
    expect(await storageLayoutContract.dataMap(202)).to.equal(
      await StorageLayout.getDataMapValues(202)
    );
  });

  it('Struct mapping values in storage layout should be correct', async function () {
    const sdm = await storageLayoutContract.structDataMap(11);
    const x = await StorageLayout.getStructDataMap(11);

    console.log(`sdm.a = ${sdm.a}`);
    console.log(`x.a = ${x.a}`);
  });
});
