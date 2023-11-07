async function main() {
  const AEML = await hre.ethers.getContractFactory("AEML");
  const aeml = await AEML.deploy();
  await aeml.deployed();

  console.log("Account address used for deployment: ", await hre.ethers.provider.getSigner().getAddress());
  console.log("Deployed to: ", aeml.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });