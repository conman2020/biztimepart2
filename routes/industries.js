const express = require("express");
const slugify = require("slugify"); 
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

// Route to add an industry
router.post('/industry', async (req, res, next) => {
  try {
    const {  industry } = req.body;
    let code = slugify(industry, {lower: true});
    const results = await db.query('INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING id, code, industry', [code, industry]);
    return res.status(201).json({ industry: results.rows[0] });
  } catch (e) {
    return next(e);
  }
});

// Route to get all industries
router.get('/', async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM industries`);
    return res.json({ industries: results.rows });
  } catch (e) {
    return next(e);
  }
});

// Route to associate an industry with a company
router.patch('/associate-industry/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const { industry_name } = req.body;
    const results = await db.query('UPDATE companies SET industry_name=$1 WHERE code=$2 RETURNING code, industry_name', [industry_name, code]);
    if (results.rows.length === 0) {
      throw new ExpressError(`Can't associate industry with company with code: ${code}`, 404);
    }
    return res.send({ company: results.rows[0] });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;