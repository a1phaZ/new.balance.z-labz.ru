const Item = require('../models/item');
const Account = require('../models/moneybox');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../server');
const apiStr = '/api/v2/items';

const mockItem = {
	date: '2021-02-26',
	userId: 1,
	title: 'test item 1',
	description: '',
	price: 10,
	quantity: 10,
	income: 1,
	tags: [],
	itemFrom: '603748e64ee08c1d54a7a1da',
	boxPrice: true
};

describe(`${apiStr}`, () => {
	beforeEach(async () => {
		await Item.deleteMany({})
	});
	
	describe('GET /:id', () => {
		it('Should return item by id', async () => {
			const item = new Item({...mockItem});
			await item.save();
			const res = await request(app).get(`${apiStr}/${item._id}?vk_user_id=1`);
			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('item');
			expect(res.body.item).to.have.property('title', 'test item 1');
		})
	})
	
	describe('POST /', () => {
		it('Add item, return account', async () => {
			const account = new Account({
				userId: 1, title: 'test 1', sum: 10, income: true
			})
			await account.save();
			let item = {...mockItem};
			item.itemFrom = account._id;
			const res = await request(app)
				.post(`${apiStr}?vk_user_id=1`)
				.send({...item});
			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('account');
			expect(res.body.account).to.have.property('operations');
			expect(res.body.account.operations.length).to.equal(1);
		})
	})
})