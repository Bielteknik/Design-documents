
import { Router } from 'express';
import { prisma } from '../prisma';
import { getInitials } from '../utils/stringUtils';

const router = Router();

// GET all resources
router.get('/', async (req, res, next) => {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        department: true,
      },
    });
    res.json(resources);
  } catch (error) {
    next(error);
  }
});

// POST a new resource
router.post('/', async (req, res, next) => {
    const { departmentId, ...rest } = req.body;
    try {
        // Convert date strings to ISO DateTime format if needed
        const resourceData = {
            ...rest,
            ...(rest.startDate && { startDate: new Date(rest.startDate).toISOString() }),
        };
        
        const resource = await prisma.resource.create({
            data: {
                ...resourceData,
                initials: getInitials(rest.name),
                currentLoad: 0, // Default value
                department: { connect: { id: departmentId } },
            },
            include: { department: true },
        });
        res.status(201).json(resource);
    } catch(error) {
        next(error);
    }
});

// PUT update a resource
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { departmentId, ...rest } = req.body;
    try {
        // Convert date strings to ISO DateTime format if needed
        const resourceData = {
            ...rest,
            ...(rest.startDate && { startDate: new Date(rest.startDate).toISOString() }),
        };
        
        const resource = await prisma.resource.update({
            where: { id },
            data: {
                ...resourceData,
                ...(rest.name && { initials: getInitials(rest.name) }),
                ...(departmentId && { department: { connect: { id: departmentId } } }),
            },
            include: { department: true },
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
