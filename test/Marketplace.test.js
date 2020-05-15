const Marketplace = artifacts.require('./Marketplace.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketplace

    before(async () => {
        marketplace = await Marketplace.deployed()
    })

    describe('deployment', async() => {
        it('deploys successfully', async () => {
            const address = await marketplace.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await marketplace.name()
            assert.equal(name, 'Exploration Marketplace')
        })
    })

    describe('products', async() => {
        let result, productCount

        before(async () => {
            result = await marketplace.createProduct('test Product', web3.utils.toWei('1', 'Ether'), { from: seller })
            productCount = await marketplace.productCount()
        })
    

        it('creates products', async () => {
            //success
            assert.equal(productCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'test Product', 'name is correct')
            assert.equal(event.price,  web3.utils.toWei('1', 'Ether'), 'price is correct')
            assert.equal(event.owner, seller, 'owner is correct')
            assert.equal(event.purchased, false, 'purchased is correct')

            //failure
            await await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), {from: seller}).should.be.rejected;
            await await marketplace.createProduct('test Product', 0, {from: seller}).should.be.rejected;

        })

        it('lists products', async () => {
         
            const product = await marketplace.products(productCount)
            assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(product.name, 'test Product', 'name is correct')
            assert.equal(product.price,  web3.utils.toWei('1', 'Ether'), 'price is correct')
            assert.equal(product.owner, seller, 'owner is correct')
            assert.equal(product.purchased, false, 'purchased is correct')
        })

        it('sells products', async () => {
            //track seller balance before purchase
            let oldSellerBalance
            oldSellerBalance = await web3.eth.getBalance(seller)
            oldSellerBalance = new web3.utils.BN(oldSellerBalance)
            //success: buyer makes purchase 
            result = await marketplace.purchaseProduct(productCount, {from: buyer, value:  web3.utils.toWei('1', 'Ether')})

            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'test Product', 'name is correct')
            assert.equal(event.price,  web3.utils.toWei('1', 'Ether'), 'price is correct')
            assert.equal(event.owner, buyer, 'owner is correct')
            assert.equal(event.purchased, true, 'purchased is correct')

            //check that the seller received the funds
            let newSellerBalance
            newSellerBalance = await web3.eth.getBalance(seller)
            newSellerBalance = new web3.utils.BN(newSellerBalance)
            let price
            price = web3.utils.toWei('1', 'Ether')
            price = new web3.utils.BN(price)
            
            const expectedBalance = oldSellerBalance.add(price)
            assert.equal(newSellerBalance.toString(), expectedBalance.toString())

            //failure: tries to buy a product that does not exist
            await marketplace.purchaseProduct(99, {from: buyer, value:  web3.utils.toWei('1', 'Ether')}).should.be.rejected;
            //failure: buyer tries to buy without sufficient ether
            await marketplace.purchaseProduct(productCount, {from: buyer, value:  web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;
            //failure: deployer attempts to purchase product
            await marketplace.purchaseProduct(productCount, {from: deployer, value:  web3.utils.toWei('1', 'Ether')}).should.be.rejected;
            //failure: buyer cannot buy the product twice
            await marketplace.purchaseProduct(productCount, {from: buyer, value:  web3.utils.toWei('1', 'Ether')}).should.be.rejected;
        })
    })
})