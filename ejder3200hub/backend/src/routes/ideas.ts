
import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET all ideas
router.get('/', async (req, res, next) => {
  try {
    const ideas = await prisma.idea.findMany({
      include: {
        author: true,
        projectLeader: true,
      },
    });
    res.json(ideas);
  } catch (error) {
    next(error);
  }
});

// POST a new idea
router.post('/', async (req, res, next) => {
    const { authorId, projectLeaderId, potentialTeamIds, ...rest } = req.body;
    try {
        const idea = await prisma.idea.create({
            data: {
                ...rest,
                status: "New",
                creationDate: new Date().toISOString(),
                author: { connect: { id: authorId } },
                ...(projectLeaderId && { projectLeader: { connect: { id: projectLeaderId } } }),
                ...(potentialTeamIds && { potentialTeam: { connect: potentialTeamIds.map((id: string) => ({ id })) } }),
            },
            include: { author: true, projectLeader: true },
        });
        res.status(201).json(idea);
    } catch(error) {
        next(error);
    }
});

// PUT update an idea
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { authorId, projectLeaderId, potentialTeamIds, ...rest } = req.body;
    try {
        const idea = await prisma.idea.update({
            where: { id },
            data: {
                ...rest,
                 ...(authorId && { author: { connect: { id: authorId } } }),
                ...(projectLeaderId && { projectLeader: { connect: { id: projectLeaderId } } }),
                ...(potentialTeamIds && { potentialTeam: { set: potentialTeamIds.map((id: string) => ({ id })) } }),
            },
            include: { author: true, projectLeader: true },
        });
        res.json(idea);
    } catch (error) {
        next(error);
    }
});

// DELETE an idea
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        await prisma.idea.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

export default router;
