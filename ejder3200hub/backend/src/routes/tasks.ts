
import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET all tasks
router.get('/', async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignee: true,
        reporter: true,
        project: true,
      },
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// GET a single task
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const task = await prisma.task.findUnique({
            where: { id },
            include: {
                assignee: true,
                reporter: true,
                project: true,
            },
        });
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        next(error);
    }
});


// POST a new task
router.post('/', async (req, res, next) => {
    const { assigneeId, reporterId, projectId, ...rest } = req.body;
    try {
        const task = await prisma.task.create({
            data: {
                ...rest,
                assignee: { connect: { id: assigneeId } },
                ...(reporterId && { reporter: { connect: { id: reporterId } } }),
                project: { connect: { id: projectId } },
            },
             include: { assignee: true, reporter: true, project: true },
        });
        res.status(201).json(task);
    } catch(error) {
        next(error);
    }
});

// PUT update a task
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { assigneeId, reporterId, projectId, ...rest } = req.body;
    try {
        const task = await prisma.task.update({
            where: { id },
            data: {
                ...rest,
                ...(assigneeId && { assignee: { connect: { id: assigneeId } } }),
                ...(reporterId && { reporter: { connect: { id: reporterId } } }),
                ...(projectId && { project: { connect: { id: projectId } } }),
            },
            include: { assignee: true, reporter: true, project: true },
        });
        res.json(task);
    } catch (error) {
        next(error);
    }
});

// DELETE a task
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        await prisma.task.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
