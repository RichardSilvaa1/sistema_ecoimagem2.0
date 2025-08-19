const express = require('express');
const router = express.Router();

const { authMiddleware, isAdmin } = require('../middlewares/auth.middleware');

const categories = require('../controllers/categoriesController');
const expenses = require('../controllers/expensesController');
const revenues = require('../controllers/revenuesController');
const reports = require('../controllers/reportsController');
const relations = require('../controllers/relationsController');

// categories
router.post('/categories', authMiddleware, isAdmin, categories.create);
router.get('/categories', authMiddleware, categories.list);
router.put('/categories/:id', authMiddleware, isAdmin, categories.update);
router.delete('/categories/:id', authMiddleware, isAdmin, categories.delete);

// expenses
router.post('/expenses', authMiddleware, isAdmin, expenses.create);
router.get('/expenses', authMiddleware, isAdmin, expenses.list);
router.get('/expenses/:id', authMiddleware, expenses.getById);
router.put('/expenses/:id', authMiddleware, isAdmin, expenses.update);
router.delete('/expenses/:id', authMiddleware, isAdmin, expenses.remove);

// revenues
router.post('/revenues', authMiddleware, isAdmin, revenues.create);
router.get('/revenues', authMiddleware, revenues.list);
router.get('/revenues/:id', authMiddleware, revenues.getById);
router.put('/revenues/:id', authMiddleware, isAdmin, revenues.update);
router.delete('/revenues/:id', authMiddleware, isAdmin, revenues.remove);

// relations
router.post('/relations', authMiddleware, isAdmin, relations.create);
router.get('/relations', authMiddleware, relations.list);
router.get('/relations/:id', authMiddleware, relations.getById);
router.put('/relations/:id', authMiddleware, isAdmin, relations.update);
router.delete('/relations/:id', authMiddleware, isAdmin, relations.remove);

// reports
router.get('/reports/summary', authMiddleware, isAdmin, reports.summary);
router.get('/reports/by-category', authMiddleware, isAdmin, reports.byCategory);
router.get('/reports/monthly', authMiddleware, isAdmin, reports.monthly);
router.get('/reports/export', authMiddleware, isAdmin, reports.exportReport);

module.exports = router;
