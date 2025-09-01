
import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET all departments
router.get('/', async (req, res, next) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        manager: true,
      },
    });
    res.json(departments);
  } catch (error) {
    next(error);
  }
});

// POST a new department
router.post('/', async (req, res, next) => {
    const { managerId, ...rest } = req.body;
    try {
        const department = await prisma.department.create({
            data: {
                ...rest,
                ...(managerId && { manager: { connect: { id: managerId } } }),
            },
            include: { manager: true },
        });
        res.status(201).json(department);
    } catch(error) {
        next(error);
    }
});

// PUT update a department
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { managerId, ...rest } = req.body;
    try {
        const department = await prisma.department.update({
            where: { id },
            data: {
                ...rest,
                ...(managerId ? { manager: { connect: { id: managerId } } } : { manager: { disconnect: true } }),
            },
            include: { manager: true },
        });
        res.json(department);
    } catch (error) {
        next(error);
    }
});

// DELETE a department
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        // You might want to add logic to handle resources in the department before deleting
        await prisma.department.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});


export default router;
