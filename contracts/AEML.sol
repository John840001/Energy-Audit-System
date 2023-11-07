// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AEML is ERC721 {
    struct GreenEnergyAsset {
        // This is for the Token section. Data to be put on the Token
        uint256 cert_no;
        address owner;
        string status; // Changed from enum to string
        bool retired;
        uint256 units_consumed;
        uint256 date;
    }

    mapping(uint256 => GreenEnergyAsset) private _greenEnergyAssets;
    mapping(uint256 => address) private _previousOwners;
    uint256 public totalTokens;

    constructor() ERC721("Green Energy Certificate", "GEC") {}

    function mintGreenEnergyToken(
        uint256 cert_no,
        // address owner,
        uint256 units_consumed,
        uint256 date
    ) public {
        require(!_exists(cert_no), "Token already exists");

        GreenEnergyAsset memory newAsset = GreenEnergyAsset(
            cert_no,
            msg.sender,
            "open", // Set the initial status to "open"
            false,
            units_consumed,
            date
        );
        _greenEnergyAssets[cert_no] = newAsset;
        _safeMint(msg.sender, cert_no);
        totalTokens++;
    }

    function getGreenEnergyAsset(
        uint256 cert_no
    )
        public
        view
        returns (uint256, address, string memory, bool, uint256, uint256)
    {
        require(_exists(cert_no), "Token does not exist");

        GreenEnergyAsset memory asset = _greenEnergyAssets[cert_no];
        return (
            asset.cert_no,
            asset.owner,
            asset.status,
            asset.retired,
            asset.units_consumed,
            asset.date
        );
    }

    function transferGreenEnergyToken(
        uint256 cert_no,
        address newOwner
    ) public {
        require(_exists(cert_no), "Token does not exist");
        require(
            _greenEnergyAssets[cert_no].owner == msg.sender,
            "You are not the owner of this token."
        );
        require(
            !_greenEnergyAssets[cert_no].retired,
            "You cannot transfer this token."
        );
        _previousOwners[cert_no] = msg.sender;
        _greenEnergyAssets[cert_no].owner = newOwner;
        _greenEnergyAssets[cert_no].status = "closed"; // Set the status to "closed"
        _transfer(msg.sender, newOwner, cert_no);
    }

    function retireGreenEnergyToken(uint256 cert_no) public {
        require(_exists(cert_no), "Token does not exist");
        require(
            _greenEnergyAssets[cert_no].owner == msg.sender,
            "You are not the owner of this token."
        );
        if (
            !_greenEnergyAssets[cert_no].retired &&
            block.timestamp >= _greenEnergyAssets[cert_no].date + 1 hours &&
            (keccak256(abi.encodePacked(_greenEnergyAssets[cert_no].status)) ==
                keccak256(abi.encodePacked("open")) ||
                keccak256(
                    abi.encodePacked(_greenEnergyAssets[cert_no].status)
                ) ==
                keccak256(abi.encodePacked("closed")))
        ) {
            _greenEnergyAssets[cert_no].retired = true;
        }
    }

    function getAllGreenEnergyAssets()
        public
        view
        returns (GreenEnergyAsset[] memory)
    {
        GreenEnergyAsset[] memory allAssets = new GreenEnergyAsset[](
            totalTokens
        );
        for (uint256 i = 1; i <= totalTokens; i++) {
            allAssets[i - 1] = _greenEnergyAssets[i];
        }
        return allAssets;
    }

    function getPreviousOwner(uint256 cert_no) public view returns (address) {
        require(_exists(cert_no), "Token does not exist");
        return _previousOwners[cert_no];
    }

    function _exists(uint256 cert_no) public view returns (bool) {
        return _greenEnergyAssets[cert_no].owner != address(0);
    }
}
