const { expect } = require("chai");

describe("AEML", () => {
  it("Should return correct name", async () => {
    const AEML = await hre.ethers.getContractFactory("AEML");
    const aeml = await AEML.deploy();
    await aeml.deployed();

    expect(await aeml.name()).to.equal("Green Energy Certificate");
  });

  it("Should mint token", async () => {
    const certId = 1;
    const units = 100;
    const date = 1234567890;

    const AEML = await hre.ethers.getContractFactory("AEML");
    const aeml = await AEML.deploy();
    await aeml.deployed();
    await aeml.mintGreenEnergyToken(certId, units, date);

    // Use await to ensure you get the correct value of totalTokens
    const totalTokens = await aeml.totalTokens();
    expect(totalTokens.toNumber()).to.equal(1);
  });

  it("Should display the content of a minted token", async () => {
    const certId = 1;
    const units = 100;
    const date = 1234567890;

    const AEML = await hre.ethers.getContractFactory("AEML");
    const [owner, otherAccount] = await hre.ethers.getSigners(); // Define owner and another account

    const aeml = await AEML.deploy();
    await aeml.deployed();
    await aeml.mintGreenEnergyToken(certId, units, date);

    // Retrieve the content of the minted token
    const assetContent = await aeml.getGreenEnergyAsset(certId);
    console.log(assetContent);
    // Check the content of the minted token
    expect(assetContent[0].toNumber()).to.equal(certId);
    expect(assetContent[1]).to.equal(owner.address); // Owner's address
    expect(assetContent[2]).to.equal("open");
    expect(assetContent[3]).to.equal(false);
    expect(assetContent[4].toNumber()).to.equal(units);
    expect(assetContent[5].toNumber()).to.equal(date);
  });

  it("Exists or not", async () => {
    const cert_no = 1;
    const AEML = await hre.ethers.getContractFactory("AEML");
    const aeml = await AEML.deploy();
    await aeml.deployed();

    const exists = await aeml._exists(cert_no);
    expect(exists).to.equal(false);
  })
});
