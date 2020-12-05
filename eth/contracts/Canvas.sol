// contracts/canvas.sol
// SPDX-License-Identifier: None
pragma solidity >=0.6.0;


import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Pixel is ERC721 {
    address payable private owner;
    
    //contract own address : address(this);

    mapping(uint256 => uint256) internal takenIds;
    mapping(uint256 => address) internal idToOwner;
    mapping(uint256 => uint32) public pixelColor;
    
    uint public buyingFee = 0.005 ether;
    uint public changingFee = 0.001 ether;
    
    uint private idCount = 0;
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
     
    constructor() public ERC721("Pixel", "PXL") {
        owner = msg.sender;
    }
    
    function buyPixel(uint256 _id, uint32 _color) public payable {
        require(idCount < 1000000, "All Pixels already sold");
        require(idToOwner[_id] == address(0x0), "Pixel already bought");
        require(msg.value == buyingFee, "Price for Pixel is incorrect");
        _mint(msg.sender, _id);
        idToOwner[_id] = msg.sender;
        pixelColor[_id] = _color;
        takenIds[idCount] = _id;
        idCount = idCount +1;
    }
    
    function changeColor(uint256 _id, uint32 _newColor) public payable {
        require(msg.sender == idToOwner[_id], "Sender does not own the Pixel");
        require(msg.value == changingFee, "Price to change Pixel color is incorrect");
        pixelColor[_id] = _newColor;
    }
    
    function getPixelOwner(uint256 _id) public view returns (address) {
        return idToOwner[_id];
    }
    
    function getColor(uint256 _id) public view returns (uint32) {
        return pixelColor[_id];
    }
    

    function getPixelsByOwner(address _owner) public view returns (uint[] memory){
        require(idCount != 0, 'No Pixel minted yet');
        uint pixelCount = balanceOf(_owner);
        uint[] memory result = new uint[](pixelCount);
        uint count = 0;
        uint supply = totalSupply();
        for(uint i = 0; i < supply; i++){
            uint id = takenIds[i];
            if(idToOwner[id] == _owner){
                result[count] = id;
                count++;
            }   
        }
        return result;
    }

    
    function getAllIds() public view returns (uint[] memory){
        require(idCount != 0, 'No Pixel minted yet');
        uint[] memory ids = new uint[](idCount);
        uint count = 0;
        uint supply = totalSupply();
        for(uint i = 0; i < supply; i++){
            uint id = takenIds[i];
            if(idToOwner[id] != address(0x0)){
                ids[count] = id;
                count++;
            }   
        }
        return ids;
    }
    
    function withdraw() public onlyOwner {
        address contractAddress = address(this);
        uint256 balance = contractAddress.balance;
        owner.transfer(balance);
    }
    
    function changeBuyFee(uint256 _newFee) public onlyOwner {
        buyingFee = _newFee;
    }
    
    function changeColorFee(uint256 _newFee) public onlyOwner {
        changingFee = _newFee;
    }

    //Override transfer methods to update our owners mapping
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        super.transferFrom(from, to, tokenId);
        idToOwner[tokenId] = to;

    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        super.safeTransferFrom(from, to, tokenId, "");
        idToOwner[tokenId] = to;
    }


    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override {
        super.safeTransferFrom(from, to, tokenId, _data);
        idToOwner[tokenId] = to;
    }
}