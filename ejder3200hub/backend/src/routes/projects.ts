
import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET all projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        manager: true,
        team: true,
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
        team: true,
        tasks: true,
        comments: { include: { author: true } },
        evaluations: { include: { author: true } },
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
    const { managerId, teamIds, ...rest } = req.body;
    try {
        // Convert date strings to ISO DateTime format if needed
        const projectData = {
            ...rest,
            startDate: new Date(rest.startDate).toISOString(),
            endDate: new Date(rest.endDate).toISOString(),
        };
        
        const project = await prisma.project.create({
            data: {
                ...projectData,
                manager: { connect: { id: managerId } },
                team: { connect: teamIds?.map((id: string) => ({ id })) || [] },
            },
            include: { manager: true, team: true },
        });
        res.status(201).json(project);
    } catch(error) {
        next(error);
    }
});

// PUT update a project
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { managerId, teamIds, ...rest } = req.body;
    try {
        // Convert date strings to ISO DateTime format if needed
        const projectData = {
            ...rest,
            ...(rest.startDate && { startDate: new Date(rest.startDate).toISOString() }),
            ...(rest.endDate && { endDate: new Date(rest.endDate).toISOString() }),
        };
        
        const project = await prisma.project.update({
            where: { id },
            data: {
                ...projectData,
                ...(managerId && { manager: { connect: { id: managerId } } }),
                ...(teamIds && { team: { set: teamIds.map((id: string) => ({ id })) } }),
            },
            include: { manager: true, team: true },
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
