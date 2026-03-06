// modules/module1_category/router.js – Express routes for Module 1
import { Router } from "express";
import { z } from "zod";
import { categorizeProduct, getProductById, listProducts } from "./service.js";

const router = Router();

// ── Zod validation schemas ──────────────────────────────────────────────────
const CategorizeSchema = z.object({
    product_name: z.string().min(1).max(255),
    description: z.string().max(2000).optional().default(""),
});

/**
 * @swagger
 * /api/v1/categorize:
 *   post:
 *     summary: Module 1 – AI Auto-Category & Tag Generator
 *     tags: [Module 1 – Auto Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_name]
 *             properties:
 *               product_name: { type: string, example: "Bamboo Water Bottle" }
 *               description: { type: string, example: "Eco-friendly reusable bottle" }
 *     responses:
 *       201:
 *         description: Categorized product with SEO tags and sustainability filters
 */
router.post("/", async (req, res, next) => {
    try {
        const data = CategorizeSchema.parse(req.body);
        const result = await categorizeProduct({ productName: data.product_name, description: data.description });
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/v1/categorize:
 *   get:
 *     summary: List all categorized products
 *     tags: [Module 1 – Auto Category]
 */
router.get("/", async (req, res, next) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const offset = parseInt(req.query.offset) || 0;
        res.json(await listProducts({ limit, offset }));
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/v1/categorize/{id}:
 *   get:
 *     summary: Get a categorized product by ID
 *     tags: [Module 1 – Auto Category]
 */
router.get("/:id", async (req, res, next) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) return res.status(404).json({ error: `Product id=${req.params.id} not found` });
        res.json(product);
    } catch (err) {
        next(err);
    }
});

export default router;
