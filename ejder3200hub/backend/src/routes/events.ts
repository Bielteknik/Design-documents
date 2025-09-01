
import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET all events
router.get('/', async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        project: true,
        rsvps: {
          include: {
            resource: true
          }
        },
        comments: {
          include: {
            resource: true
          }
        },
      },
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
});

// POST a new event
router.post('/', async (req, res, next) => {
    const { projectId, ...rest } = req.body;
    try {
        const event = await prisma.event.create({
            data: {
                ...rest,
                ...(projectId && { projectId }),
            },
            include: { project: true },
        });
        res.status(201).json(event);
    } catch(error) {
        next(error);
    }
});

// PUT update an event
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { projectId, ...rest } = req.body;
    try {
        const event = await prisma.event.update({
            where: { id },
            data: {
                ...rest,
                ...(projectId && { projectId }),
            },
            include: { project: true },
        });
        res.json(event);
    } catch (error) {
        next(error);
    }
});

// DELETE an event
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        await prisma.event.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;