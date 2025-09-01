
import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET all projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        manager: true,
      },
    });
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// GET one project by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        manager: true,
        tasks: true,
        comments: { include: { resource: true } },
      },
    });
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    next(error);
  }
});

// POST a new project
router.post('/', async (req, res, next) => {
    const { managerId, team, ...rest } = req.body;
    try {
        const project = await prisma.project.create({
            data: {
                ...rest,
                managerId,
                team: team || [],
            },
            include: { manager: true },
        });
        res.status(201).json(project);
    } catch(error) {
        next(error);
    }
});

// PUT update a project
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { managerId, team, ...rest } = req.body;
    try {
        const project = await prisma.project.update({
            where: { id },
            data: {
                ...rest,
                ...(managerId && { managerId }),
                ...(team && { team }),
            },
            include: { manager: true },
        });
        res.json(project);
    } catch (error) {
        next(error);
    }
});

// DELETE a project
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        await prisma.project.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});


export default router;