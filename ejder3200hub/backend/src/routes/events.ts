
import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET all events
router.get('/', async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        participants: true,
        project: true,
        idea: true,
      },
    });
    
    // Convert JSON strings back to arrays for response
    const responseEvents = events.map((event: any) => ({
      ...event,
      files: event.files ? JSON.parse(event.files) : [],
      tags: event.tags ? JSON.parse(event.tags) : [],
    }));
    
    res.json(responseEvents);
  } catch (error) {
    next(error);
  }
});

// POST a new event
router.post('/', async (req, res, next) => {
    const { participantIds, projectId, ideaId, link, ...rest } = req.body;
    try {
        // Convert date string to ISO DateTime format if needed
        const eventData = {
            ...rest,
            date: rest.date ? new Date(rest.date).toISOString() : new Date().toISOString(),
            // Convert arrays to JSON strings for SQLite storage
            files: Array.isArray(rest.files) ? JSON.stringify(rest.files) : rest.files || null,
            tags: Array.isArray(rest.tags) ? JSON.stringify(rest.tags) : rest.tags || null,
        };
        
        const event = await prisma.event.create({
            data: {
                ...eventData,
                ...(participantIds && { participants: { connect: participantIds.map((id: string) => ({ id })) } }),
                ...(projectId && { project: { connect: { id: projectId } } }),
                ...(ideaId && { idea: { connect: { id: ideaId } } }),
            },
            include: { participants: true, project: true, idea: true },
        });
        
        // Convert JSON strings back to arrays for response
        const responseEvent = {
            ...event,
            files: event.files ? JSON.parse(event.files) : [],
            tags: event.tags ? JSON.parse(event.tags) : [],
        };
        
        res.status(201).json(responseEvent);
    } catch(error) {
        next(error);
    }
});

// PUT update an event
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { participantIds, link, ...rest } = req.body;
    try {
        // Convert date string to ISO DateTime format if needed
        const eventData = {
            ...rest,
            ...(rest.date && { date: new Date(rest.date).toISOString() }),
            // Convert arrays to JSON strings for SQLite storage
            ...(rest.files && { files: Array.isArray(rest.files) ? JSON.stringify(rest.files) : rest.files }),
            ...(rest.tags && { tags: Array.isArray(rest.tags) ? JSON.stringify(rest.tags) : rest.tags }),
        };
        
        const event = await prisma.event.update({
            where: { id },
            data: {
                ...eventData,
                ...(participantIds && { participants: { set: participantIds.map((id: string) => ({ id })) } }),
            },
             include: { participants: true, project: true, idea: true },
        });
        
        // Convert JSON strings back to arrays for response
        const responseEvent = {
            ...event,
            files: event.files ? JSON.parse(event.files) : [],
            tags: event.tags ? JSON.parse(event.tags) : [],
        };
        
        res.json(responseEvent);
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
