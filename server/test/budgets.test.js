const Budget = require('../models/budget');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../server');
const apiStr = '/api/v2/budgets';

describe(`${apiStr}`, () => {
	beforeEach(async () => {
		await Budget.deleteMany({})
	});
	
	describe('GET /', () => {
		it('should return all user budget', async () => {
			const budgets = [
				{
					userId: 1,
					title: 'budget test 1',
					month: new Date().getMonth(),
					year: new Date().getFullYear(),
					sum: 100,
				},
				{
					userId: 1,
					title: 'budget test 2',
					month: new Date().getMonth(),
					year: new Date().getFullYear(),
					sum: 200,
				}
			];
			await Budget.insertMany(budgets);
			const res = await request(app).get(`${apiStr}?vk_user_id=1`);
			expect(res.status).to.equal(200);
			expect(res.body.budgets.length).to.equal(2);
		})
		it('should return 400 when vk_user_id is not exist', async () => {
			const res = await request(app).get(`${apiStr}`);
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		})
	})
	describe('GET /:id', async () => {
		it('should return user budget by id', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'budget test 1',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			const res = await request(app).get(`${apiStr}/${budget._id}?vk_user_id=1`);
			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('budget');
			expect(res.body.budget).to.have.property('title', 'budget test 1');
		});
		it('should return 400 when vk_user_id is not exist', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'budget test 1',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			const res = await request(app).get(`${apiStr}/${budget._id}`);
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when budget id is not valid', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'budget test 1',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			const res = await request(app).get(`${apiStr}/11111111111?vk_user_id=1`);
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 404 when not found budget', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 1',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			
			const res = await request(app).get(`${apiStr}/5fb7a17719d1b15ab01aecd8?vk_user_id=1`);
			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
		});
	})
	describe('POST /', () => {
		it('should add budget', async () => {
			const res = await request(app)
				.post(`${apiStr}?vk_user_id=1`)
				.send({
					title: 'test budget 1',
					sum: 100
				});
			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('budget');
			expect(res.body.budget).to.have.property('title', 'test budget 1');
			expect(res.body.budget).to.have.property('sum', 100);
		});
		it('should return 400 when vk_user_id is not exist', async () => {
			const res = await request(app)
				.post(`${apiStr}`)
				.send({
					title: 'test budget 1',
					sum: 100
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when title is not exist', async () => {
			const res = await request(app)
				.post(`${apiStr}?vk_user_id=1`)
				.send({
					sum: 100
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when title length > 20', async () => {
			const res = await request(app)
				.post(`${apiStr}?vk_user_id=1`)
				.send({
					title: '123456789012345678901',
					sum: 100
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when title is exist in db', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 1',
				month: new Date().getMonth(),
				year: new Date().getFullYear(),
				sum: 100,
			});
			await budget.save();
			const res = await request(app)
				.post(`${apiStr}?vk_user_id=1`)
				.send({
					title: 'test budget 1',
					sum: 100
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when sum is not exist', async () => {
			const res = await request(app)
				.post(`${apiStr}?vk_user_id=1`)
				.send({
					title: 'test budget 1'
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when sum is not valid', async () => {
			const res = await request(app)
				.post(`${apiStr}?vk_user_id=1`)
				.send({
					title: 'test budget 1',
					sum: 'asdfasd'
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when sum is negative', async () => {
			const res = await request(app)
				.post(`${apiStr}?vk_user_id=1`)
				.send({
					title: 'test budget 1',
					sum: -10
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
	});
	describe('PATCH /:id', () => {
		it('should be update budget', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 1',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			
			const res = await request(app)
				.patch(`${apiStr}/${budget._id}?vk_user_id=1`)
				.send({
					title: 'update',
					sum: 1000
				});
			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('budget');
			expect(res.body.budget).to.have.property('title', 'update');
			expect(res.body.budget).to.have.property('sum', 1000);
		});
		it('should return 400 when vk_user_id not exist', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 1',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			
			const res = await request(app)
				.patch(`${apiStr}/${budget._id}`)
				.send({
					title: 'update',
					sum: 1000
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when budget id is not valid', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 1',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			
			const res = await request(app)
				.patch(`${apiStr}/11111111111111?vk_user_id=1`)
				.send({
					title: 'update',
					sum: 1000
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 404 when not found budget', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 1',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			
			const res = await request(app)
				.patch(`${apiStr}/5fb7a17719d1b15ab01aecd8?vk_user_id=1`)
				.send({
					title: 'update',
					sum: 1000
				});
			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when title not exist', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 1',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			
			const res = await request(app)
				.patch(`${apiStr}/${budget._id}?vk_user_id=1`)
				.send({
					sum: 1000
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when title length > 20', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 1',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			
			const res = await request(app)
				.patch(`${apiStr}/${budget._id}?vk_user_id=1`)
				.send({
					title: '123456789012345678901',
					sum: 1000
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when sum not exist', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 1',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			
			const res = await request(app)
				.patch(`${apiStr}/${budget._id}?vk_user_id=1`)
				.send({
					title: 'update',
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when sum is not valid', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 1',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			
			const res = await request(app)
				.patch(`${apiStr}/${budget._id}?vk_user_id=1`)
				.send({
					title: 'update',
					sum: 'asdasd'
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when sum is negative', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 1',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			
			const res = await request(app)
				.patch(`${apiStr}/${budget._id}?vk_user_id=1`)
				.send({
					title: 'update',
					sum: -100
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when title is exist in db', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 2',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			const res = await request(app)
				.patch(`${apiStr}/${budget._id}?vk_user_id=1`)
				.send({
					title: 'test budget 2',
					sum: 100
				});
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
	})
	describe('DELETE /:id', () => {
		it('should be delete budget', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 2',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			const res = await request(app)
				.delete(`${apiStr}/${budget._id}?vk_user_id=1`)
			
			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('budget', null);
			expect(res.body).to.have.property('message', 'Бюджет удалён');
		});
		it('should return 400 when vk_user_id doesnt exist', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 2',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			const res = await request(app)
				.delete(`${apiStr}/${budget._id}`)
			
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 400 when date id is not valid', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 2',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			const res = await request(app)
				.delete(`${apiStr}/11111111111?vk_user_id=1`)
			
			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
		it('should return 404 when budget not found', async () => {
			const budget = new Budget({
				userId: 1,
				title: 'test budget 2',
				month: 1,
				year: 2021,
				sum: 100,
			});
			await budget.save();
			const res = await request(app)
				.delete(`${apiStr}/5fb7a17719d1b15ab01aecd8?vk_user_id=1`)
			
			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
		});
	})
})