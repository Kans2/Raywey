// modules/module2_b2b/router.js – Express routes for Module 2
import { Router } from "express";
import { z } from "zod";
import { generateProposal, getProposalById, listProposals } from "./service.js";

const router = Router();

const ProposalSchema = z.object({
    client_name: z.string().min(1).max(255),
    industry: z.string().max(100).optional().default("General"),
    budget: z.number().positive(),
    requirements: z.string().max(2000).optional().default(""),
});

/**
 * @swagger
 * /api/v1/proposals:
 *   post:
 *     summary: Module 2 – AI B2B Proposal Generator
 *     tags: [Module 2 – B2B Proposal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [client_name, budget]
 *             properties:
 *               client_name: { type: string, example: "GreenCorp Pvt Ltd" }
 *               industry: { type: string, example: "Technology" }
 *               budget: { type: number, example: 50000 }
 *               requirements: { type: string, example: "Eco-friendly office supplies" }
 *     responses:
 *       201:
 *         description: Complete B2B proposal with product mix and cost breakdown
 */
router.post("/", async (req, res, next) => {
    try {
        const data = ProposalSchema.parse(req.body);
        const result = await generateProposal({
            clientName: data.client_name,
            industry: data.industry,
            budget: data.budget,
            requirements: data.requirements,
        });
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/v1/proposals:
 *   get:
 *     summary: List all B2B proposals
 *     tags: [Module 2 – B2B Proposal]
 */
router.get("/", async (req, res, next) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const offset = parseInt(req.query.offset) || 0;
        res.json(await listProposals({ limit, offset }));
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/v1/proposals/{id}:
 *   get:
 *     summary: Get a B2B proposal by ID
 *     tags: [Module 2 – B2B Proposal]
 */
router.get("/:id", async (req, res, next) => {
    try {
        const proposal = await getProposalById(req.params.id);
        if (!proposal) return res.status(404).json({ error: `Proposal id=${req.params.id} not found` });
        res.json(proposal);
    } catch (err) {
        next(err);
    }
});

export default router;
