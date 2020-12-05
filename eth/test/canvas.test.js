var Pixel = artifacts.require("Pixel");

function toEther(n) {
    return web3.utils.toWei(String(n), 'ether')
}


contract('Pixel contract tests', async (accounts) => {

    var owner = accounts[0];

    beforeEach(async () => {
        await Pixel.new();
    })

    it(' should deploy the contract', async () => {
        let pixel = await Pixel.deployed();

        assert.equal(await pixel.name(), 'Pixel');
        assert.equal(await pixel.symbol(), 'PXL');
    });

    it(' should have the correct owner & be able to change fees', async () => {
        let pixel = await Pixel.deployed();

        //Incorrect owner : 
        try{
            await pixel.changeBuyFee(toEther(0.04), {from: accounts[1]});
            assert(false);
        } catch (err) {
            assert(err);
        }

        //Correct owner : 
        await pixel.changeBuyFee(toEther(0.004), {from: owner});
        await pixel.changeColorFee(toEther(0.002), {from: owner});

        let newBuyingFee = await pixel.buyingFee();
        let newChangingFee = await pixel.changingFee();

        assert.equal(newBuyingFee , toEther(0.004));
        assert.equal(newChangingFee , toEther(0.002));
    });

});

contract('Pixel contract tests', async (accounts) => {

    var owner = accounts[0];

    beforeEach(async () => {
        await Pixel.new();
    })

    it(' can buy a Pixel', async () => {
        let pixel = await Pixel.deployed();

        await pixel.buyPixel(0,155, {from: accounts[1], value: web3.utils.toWei('0.005', 'ether')});

        assert.equal(await pixel.balanceOf(accounts[1]), 1);
        assert.equal(await pixel.getPixelOwner(0), accounts[1]);
        assert.equal(await pixel.getColor(0), 155);
    });

    it(' cant buy others Pixels', async () => {
        let pixel = await Pixel.deployed();

        try{
            await pixel.buyPixel(0,155, {from: accounts[2], value: web3.utils.toWei('0.005', 'ether')});
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it(' can change own Pixel color', async () => {
        let pixel = await Pixel.deployed();

        await pixel.changeColor(0,235, {from: accounts[1], value: web3.utils.toWei('0.001', 'ether')});

        assert.equal(await pixel.getColor(0), 235);
    });

    it(' cant change others Pixel color', async () => {
        let pixel = await Pixel.deployed();

        try {
        await pixel.changeColor(0,235, {from: accounts[2], value: web3.utils.toWei('0.001', 'ether')});
            assert(false);
        } catch (err) {
            assert(err);
        }
    });


    it(' can find multiple Pixels for 1 owner', async () => {
        let pixel = await Pixel.deployed();

        await pixel.buyPixel(1, 25742, {from: accounts[1], value: web3.utils.toWei('0.005', 'ether')});
        await pixel.buyPixel(2, 43434, {from: accounts[1], value: web3.utils.toWei('0.005', 'ether')});
        await pixel.buyPixel(3, 257237, {from: accounts[1], value: web3.utils.toWei('0.005', 'ether')});
        await pixel.buyPixel(4, 14569, {from: accounts[1], value: web3.utils.toWei('0.005', 'ether')});

        let result = await pixel.getPixelsByOwner(accounts[1]);

        assert.equal(result.length, 5);
    });

    it(' can transfer a Pixel', async () => {
        let pixel = await Pixel.deployed();

        await pixel.transferFrom(accounts[1], accounts[2], 4, {from: accounts[1]});

        let result1 = await pixel.getPixelsByOwner(accounts[1]);
        let result2 = await pixel.getPixelsByOwner(accounts[2]);

        assert.equal(await pixel.balanceOf(accounts[1]), 4);
        assert.equal(await pixel.balanceOf(accounts[2]), 1);
        assert.equal(await pixel.getPixelOwner(4), accounts[2]);
        assert.equal(result1.length, 4);
        assert.equal(result2.length, 1);
    });

    it(' allows contract owner to withdraw funds', async () => {
        let pixel = await Pixel.deployed();

        let balance = web3.utils.fromWei( await web3.eth.getBalance(accounts[0]), 'ether');

        await pixel.withdraw({from: owner});

        let newBalance = web3.utils.fromWei( await web3.eth.getBalance(accounts[0]), 'ether');

        assert.ok(balance < newBalance)
    });

    /*it('', async () => {

    });*/
});