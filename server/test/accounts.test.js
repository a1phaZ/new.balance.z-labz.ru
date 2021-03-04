const Account = require('../models/moneybox');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../server');
const apiStr = '/api/v2/accounts';

describe('api/v2/accounts', () => {
	beforeEach(async () => {
		await Account.deleteMany({});
	});
	
	describe('GET /', () => {
		it('should return all accounts', async () => {
			const accounts = [
				{userId: 1, title: 'test 1', sum: 10, income: true},
				{userId: 1, title: 'test 2', sum: 100, income: true}
			];
			await Account.insertMany(accounts);
			const res = await request(app).get(`${apiStr}?vk_user_id=1`);
			expect(res.status).to.equal(200);
			expect(res.body.accounts.length).to.equal(2);
		});
		it('should return code 400 when vk_user_id doesnt exist', async () => {
			const res = await request(app).get(`${apiStr}`);
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
	});
	
	describe('GET /:id', () => {
		it('should return account from id', async () => {
			const account = new Account({
				userId: 1, title: 'test 1', sum: 10, income: true
			})
			await account.save();
			const res = await request(app).get(`${apiStr}/${account._id}?vk_user_id=1`)
			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('account');
		});
		it('should return 400 when vk_user_id doesnt exist', async () => {
			const account = new Account({
				userId: 1, title: 'test 1', sum: 10, income: true
			})
			await account.save();
			const res = await request(app).get(`${apiStr}/${account._id}`)
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when account id not valid', async () => {
			const res = await request(app).get(`${apiStr}/1111111?vk_user_id=1`)
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		})
		it('should return 404 when account not found', async () => {
			const res = await request(app).get(`${apiStr}/600e40f7d81d152a0c68835c?vk_user_id=1`)
			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
		})
		it('should return 400 when date doesnt valid', async () => {
			const account = new Account({
				userId: 1, title: 'test 1', sum: 10, income: true
			})
			await account.save();
			const res = await request(app).get(`${apiStr}/${account._id}?vk_user_id=1&date=adadas`)
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
	});
	
	describe('POST /', () => {
		it('should be add account', async () => {
			const res = await request(app)
				.post(`${apiStr}?vk_user_id=1`)
				.send({
					title: 'test 1',
					sum: 10
				});
			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('accounts');
		});
		it('should return 400 when vk_user_id doesnt exist', async () => {
			const res = await request(app)
				.post(`${apiStr}`)
				.send({
					title: 'test 1',
					sum: 10
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when title length > 20', async () => {
			const res = await request(app)
				.post(`${apiStr}`)
				.send({
					title: '123456789012345678901',
					sum: 10
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when title doesnt exist', async () => {
			const res = await request(app)
				.post(`${apiStr}?vk_user_id=1`)
				.send({
					sum: 10
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when sum doesnt exist', async () => {
			const res = await request(app)
				.post(`${apiStr}?vk_user_id=1`)
				.send({
					title: 'test 1'
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		})
		it('should return 400 when sum is negative', async () => {
			const res = await request(app)
				.post(`${apiStr}?vk_user_id=1`)
				.send({
					title: 'test 1',
					sum: -10
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		})
		it('should return 400 when sum is not valid', async () => {
			const res = await request(app)
				.post(`${apiStr}?vk_user_id=1`)
				.send({
					title: 'test 1',
					sum: 'asdasda'
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		})
	})
	
	describe('PATCH /:id', () => {
		it('should be update account', async () => {
			const account = new Account({
				userId: 1, title: 'test 1', sum: 10, income: true
			})
			await account.save();
			
			const res = await request(app)
				.patch(`${apiStr}/${account._id}?vk_user_id=1`)
				.send({
					title: 'update'
				});
			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('account');
			expect(res.body.account).to.have.property('title', 'update');
		});
		it('should return 400 when vk_user_id doesnt exist', async () => {
			const account = new Account({
				userId: 1, title: 'test 1', sum: 10, income: true
			})
			await account.save();
			
			const res = await request(app)
				.patch(`${apiStr}/${account._id}`)
				.send({
					title: 'update'
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when title doesnt exist', async () => {
			const account = new Account({
				userId: 1, title: 'test 1', sum: 10, income: true
			})
			await account.save();
			
			const res = await request(app)
				.patch(`${apiStr}/${account._id}?vk_user_id=1`)
				.send({});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 404 when account not found', async () => {
			const account = new Account({
				userId: 1, title: 'test 1', sum: 10, income: true
			})
			await account.save();
			const res = await request(app)
				.patch(`${apiStr}/600e60fbd81d152a0c6886b9?vk_user_id=1`)
				.send({
					title: 'update'
				});
			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when title length > 20', async () => {
			const account = new Account({
				userId: 1, title: 'test 1', sum: 10, income: true
			})
			await account.save();
			
			const res = await request(app)
				.patch(`${apiStr}/${account._id}?vk_user_id=1`)
				.send({
					title: '123456789012345678901'
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when account id is not valid', async () => {
			const account = new Account({
				userId: 1, title: 'test 1', sum: 10, income: true
			})
			await account.save();
			
			const res = await request(app)
				.patch(`${apiStr}/11111111111?vk_user_id=1`)
				.send({
					title: 'update'
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		})
		it('should return 400 when date id is not valid', async () => {
			const account = new Account({
				userId: 1, title: 'test 1', sum: 10, income: true
			})
			await account.save();
			
			const res = await request(app)
				.patch(`${apiStr}/11111111111?vk_user_id=1&date=asdfasdf`)
				.send({
					title: 'update',
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		})
	})
	
	describe('DELETE /:id', () => {
		it('should be delete account', async () => {
			const account = new Account({
				userId: 1, title: 'test 1', sum: 10, income: true
			})
			await account.save();
			const res = await request(app)
				.delete(`${apiStr}/${account._id}?vk_user_id=1`)
			
			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('accounts');
			expect(res.body).to.have.property('account', null);
			expect(res.body).to.have.property('message', 'Счет удалён');
		});
		it('should return 400 when vk_user_id doesnt exist', async () => {
			const account = new Account({
				userId: 1, title: 'test 1', sum: 10, income: true
			})
			await account.save();
			const res = await request(app)
				.delete(`${apiStr}/${account._id}`)
			
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when date id is not valid', async () => {
			const account = new Account({
				userId: 1, title: 'test 1', sum: 10, income: true
			})
			await account.save();
			const res = await request(app)
				.delete(`${apiStr}/11111111111?vk_user_id=1`)
			
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
	})
});