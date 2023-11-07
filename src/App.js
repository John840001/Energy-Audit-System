import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import AEML from "./artifacts/contracts/AEML.sol/AEML.json";

const aemlAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [cert_no, setCertNo] = useState(0);
  const [units, setUnits] = useState(0);
  const [date, setDate] = useState(0);
  const [newOwner, setNewOwner] = useState("");
  const [assetsData, setAssets] = useState([]);
  const [multipleAssests, setMultipleAssets] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function checkContractExistence(address) {
    const provider = new ethers.providers.JsonRpcProvider(
      "http://127.0.0.1:8545/"
    ); // Replace with your JSON-RPC endpoint

    try {
      // Use getCode to check if a contract exists at the provided address
      const code = await provider.getCode(address);
      if (code === "0x") {
        console.log(`No contract found at address ${address}`);
      } else {
        console.log(`A contract exists at address ${address}`);
      }
    } catch (error) {
      console.error("Error checking contract existence:", error);
    }
  }

  async function mintAssets(cert_no, units, date) {
    checkContractExistence(aemlAddress);
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(aemlAddress, AEML.abi, signer);
      const transaction = await contract.mintGreenEnergyToken(
        cert_no,
        units,
        date
      );
      await transaction.wait();
      console.log("Minted");
      // getAssets(cert_no);
    }
  }

  async function getAssets(cert_no) {
    // console.log(cert_no);
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(aemlAddress, AEML.abi, provider);
      try {
        const exists = await contract._exists(cert_no);
        console.log(exists);

        const asset = await contract.getGreenEnergyAsset(cert_no);
        // console.log(asset);
        setAssets(asset);
        // console.log(assets);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function getAllAssets() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(aemlAddress, AEML.abi, provider);
      try {
        const assets = await contract.getAllGreenEnergyAssets();
        console.log(assets);
        setMultipleAssets(assets);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function transferToken(cert_no, newOwner) {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(aemlAddress, AEML.abi, signer);
      try {
        const transaction = await contract.transferGreenEnergyToken(
          cert_no,
          newOwner
        );
        await transaction.wait();
        console.log("Transfered");
        setErrorMessage("");
      } catch (error) {
        if (error.message.includes("You cannot transfer this token.")) {
          // Handle the specific error message
          setErrorMessage("You cannot transfer this token.");
        } else {
          // Handle other errors
          console.error(error);
          setErrorMessage(error.message);
        }
      }
    }
  }

  async function retireToken() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(aemlAddress, AEML.abi, signer);
      const transaction = await contract.retireGreenEnergyToken(cert_no);
      await transaction.wait();
      console.log("Retired");
    }
  }

  return (
    <div className="container">
      <div className="hold">
        <div className="earth"></div>
        <div className="admin-title">
          <div className="text">Admin Dashboard</div>
        </div>
      </div>
      <div className="box">
        <h1>Mint Green Energy Token</h1>
        <label>Certificate Number: </label>
        <input
          type="number"
          placeholder="Cert No"
          onChange={(e) => setCertNo(e.target.value)}
          class="input-field"
        />
        <br></br>
        <label>Number of units: </label>
        <input
          type="number"
          placeholder="Units"
          onChange={(e) => setUnits(e.target.value)}
          class="input-field"
        />
        <br />
        <label>Date: </label>
        <input
          type="number"
          placeholder="Date"
          onChange={(e) => setDate(e.target.value)}
          class="input-field"
        />
        <br />
        <br />
        <button
          onClick={() => {
            requestAccounts();
            mintAssets(cert_no, units, date);
          }}
          class="action-button mint-button"
        >
          Mint
        </button>
      </div>
      <div className="box">
        <h1>Transfer Green Energy Token</h1>
        <label>Certificate Number: </label>
        <input
          type="number"
          placeholder="Cert No"
          onChange={(e) => setCertNo(e.target.value)}
          class="input-field"
        />
        <br />
        <label>New Owner Address:</label>
        <input
          type="text"
          placeholder="New Owner"
          onChange={(e) => setNewOwner(e.target.value)}
          class="input-field"
        />
        <br />
        <button
          onClick={() => {
            requestAccounts();
            transferToken(cert_no, newOwner);
          }}
          class="action-button mint-button"
        >
          Transfer
        </button>
        <p>{errorMessage}</p>
        <br />
      </div>
      <div className="box">
        <h1>Retire Green Energy Token</h1>
        <label>Certificate Number: </label>
        <input
          type="number"
          placeholder="Cert No"
          onChange={(e) => setCertNo(e.target.value)}
          class="input-field"
        />
        <br />
        <button
          onClick={() => {
            requestAccounts();
            retireToken();
          }}
          class="action-button mint-button"
        >
          Retire
        </button>
      </div>

      <div className="box">
        <h1>Get Green Energy Token</h1>
        <label>Certificate Number: </label>
        <input
          type="number"
          placeholder="Cert No"
          onChange={(e) => setCertNo(e.target.value)}
          class="input-field"
        />
        <br />
        <button
          onClick={() => getAssets(cert_no)}
          class="action-button mint-button"
        >
          Get
        </button>

        <div className="token-box">
          {assetsData && (
            <ul>
              <li>Cert No: {assetsData[0]?.toString()}</li>
              <li>Owner Address: {assetsData[1]}</li>
              <li>Status: {assetsData[2]}</li>
              <li>Retired: {assetsData[3] ? "Yes" : "No"}</li>
              <li>Units Consumed: {assetsData[4]?.toString()}</li>
              <li>Date: {assetsData[5]?.toString()}</li>
            </ul>
          )}
        </div>
      </div>
      <div className="box">
        <h1>Get All Green Energy Tokens</h1>
        <br />
        <button
          onClick={() => getAllAssets()}
          class="action-button mint-button"
        >
          Get All
        </button>
        <div>
          {multipleAssests && (
            <ul>
              {multipleAssests.map((asset, i) => (
                <li key={i}>
                  Cert No: {asset[0]?.toString()}
                  <br />
                  Owner Address: {asset[1]}
                  <br />
                  Status: {asset[2]}
                  <br />
                  Retired: {asset[3] ? "Yes" : "No"}
                  <br />
                  Units Consumed: {asset[4]?.toString()}
                  <br />
                  Date: {asset[5]?.toString()}
                  <br />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
