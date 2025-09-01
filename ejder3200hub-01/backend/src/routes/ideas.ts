
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
    
    // Convert JSON strings back to arrays for response
    const responseIdeas = ideas.map((idea: any) => ({
      ...idea,
      relatedDepartments: idea.relatedDepartments ? JSON.parse(idea.relatedDepartments) : [],
      timelinePhases: idea.timelinePhases ? JSON.parse(idea.timelinePhases) : [],
      budgetItems: idea.budgetItems ? JSON.parse(idea.budgetItems) : [],
      files: idea.files ? JSON.parse(idea.files) : [],
      tags: idea.tags ? JSON.parse(idea.tags) : [],
    }));
    
    res.json(responseIdeas);
  } catch (error) {
    next(error);
  }
});

// POST a new idea
router.post('/', async (req, res, next) => {
    const { authorId, projectLeaderId, potentialTeamIds, ...rest } = req.body;
    try {
        // Convert arrays to JSON strings for SQLite storage
        const ideaData = {
            ...rest,
            status: "New",
            creationDate: new Date().toISOString(),
            relatedDepartments: Array.isArray(rest.relatedDepartments) ? JSON.stringify(rest.relatedDepartments) : rest.relatedDepartments || null,
            timelinePhases: Array.isArray(rest.timelinePhases) ? JSON.stringify(rest.timelinePhases) : rest.timelinePhases || null,
            budgetItems: Array.isArray(rest.budgetItems) ? JSON.stringify(rest.budgetItems) : rest.budgetItems || null,
            files: Array.isArray(rest.files) ? JSON.stringify(rest.files) : rest.files || null,
            tags: Array.isArray(rest.tags) ? JSON.stringify(rest.tags) : rest.tags || null,
        };
        
        const idea = await prisma.idea.create({
            data: {
                ...ideaData,
                author: { connect: { id: authorId } },
                ...(projectLeaderId && { projectLeader: { connect: { id: projectLeaderId } } }),
                ...(potentialTeamIds && { potentialTeam: { connect: potentialTeamIds.map((id: string) => ({ id })) } }),
            },
            include: { author: true, projectLeader: true },
        });
        
        // Convert JSON strings back to arrays for response
        const responseIdea = {
            ...idea,
            relatedDepartments: idea.relatedDepartments ? JSON.parse(idea.relatedDepartments) : [],
            timelinePhases: idea.timelinePhases ? JSON.parse(idea.timelinePhases) : [],
            budgetItems: idea.budgetItems ? JSON.parse(idea.budgetItems) : [],
            files: idea.files ? JSON.parse(idea.files) : [],
            tags: idea.tags ? JSON.parse(idea.tags) : [],
        };
        
        res.status(201).json(responseIdea);
    } catch(error) {
        next(error);
    }
});

// PUT update an idea
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { authorId, projectLeaderId, potentialTeamIds, ...rest } = req.body;
    try {
        // Convert arrays to JSON strings for SQLite storage
        const ideaData = {
            ...rest,
            ...(rest.relatedDepartments && { relatedDepartments: Array.isArray(rest.relatedDepartments) ? JSON.stringify(rest.relatedDepartments) : rest.relatedDepartments }),
            ...(rest.timelinePhases && { timelinePhases: Array.isArray(rest.timelinePhases) ? JSON.stringify(rest.timelinePhases) : rest.timelinePhases }),
            ...(rest.budgetItems && { budgetItems: Array.isArray(rest.budgetItems) ? JSON.stringify(rest.budgetItems) : rest.budgetItems }),
            ...(rest.files && { files: Array.isArray(rest.files) ? JSON.stringify(rest.files) : rest.files }),
            ...(rest.tags && { tags: Array.isArray(rest.tags) ? JSON.stringify(rest.tags) : rest.tags }),
        };
        
        const idea = await prisma.idea.update({
            where: { id },
            data: {
                ...ideaData,
                 ...(authorId && { author: { connect: { id: authorId } } }),
                ...(projectLeaderId && { projectLeader: { connect: { id: projectLeaderId } } }),
                ...(potentialTeamIds && { potentialTeam: { set: potentialTeamIds.map((id: string) => ({ id })) } }),
            },
            include: { author: true, projectLeader: true },
        });
        
        // Convert JSON strings back to arrays for response
        const responseIdea = {
            ...idea,
            relatedDepartments: idea.relatedDepartments ? JSON.parse(idea.relatedDepartments) : [],
            timelinePhases: idea.timelinePhases ? JSON.parse(idea.timelinePhases) : [],
            budgetItems: idea.budgetItems ? JSON.parse(idea.budgetItems) : [],
            files: idea.files ? JSON.parse(idea.files) : [],
            tags: idea.tags ? JSON.parse(idea.tags) : [],
        };
        
        res.json(responseIdea);
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
