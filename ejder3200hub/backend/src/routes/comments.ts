
import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET all comments (can be filtered by projectId or ideaId in a real app)
router.get('/', async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        resource: true,
        project: true,
        task: true,
        idea: true,
        event: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

// POST a new comment
router.post('/', async (req, res, next) => {
    const { resourceId, projectId, taskId, ideaId, eventId, ...rest } = req.body;
    try {
        const comment = await prisma.comment.create({
            data: {
                ...rest,
                resourceId,
                ...(projectId && { projectId }),
                ...(taskId && { taskId }),
                ...(ideaId && { ideaId }),
                ...(eventId && { eventId }),
            },
            include: { resource: true },
        });
        res.status(201).json(comment);
    } catch(error) {
        next(error);
    }
});

// PUT update a comment
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const comment = await prisma.comment.update({
            where: { id },
            data: req.body,
            include: { resource: true },
        });
        res.json(comment);
    } catch (error) {
        next(error);
    }
});

// DELETE a comment
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        await prisma.comment.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

export default router;
