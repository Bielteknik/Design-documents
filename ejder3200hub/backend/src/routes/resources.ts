
import { Router } from 'express';
import { prisma } from '../prisma';
import { getInitials } from '../utils/stringUtils';

const router = Router();

// GET all resources
router.get('/', async (req, res, next) => {
  try {
    const resources = await prisma.resource.findMany();
    res.json(resources);
  } catch (error) {
    next(error);
  }
});

// POST a new resource
router.post('/', async (req, res, next) => {
    const { department, ...rest } = req.body;
    try {
        const resource = await prisma.resource.create({
            data: {
                ...rest,
                department,
            },
        });
        res.status(201).json(resource);
    } catch(error) {
        next(error);
    }
});

// PUT update a resource
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { department, ...rest } = req.body;
    try {
        const resource = await prisma.resource.update({
            where: { id },
            data: {
                ...rest,
                ...(department && { department }),
            },
        });
        res.json(resource);
    } catch (error) {
        next(error);
    }
});

// DELETE a resource
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        // Handle relations before deleting if necessary (e.g., reassign tasks)
        await prisma.resource.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

export default router;