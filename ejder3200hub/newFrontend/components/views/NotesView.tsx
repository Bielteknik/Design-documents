

import React from 'react';
import { Event, Priority, Project, Idea } from '../../types';
import { Pin, Bell, Paperclip, Briefcase, Zap } from 'lucide-react';

interface NotesViewProps {
    notes: Event[];
    projects: Project[];
    ideas: Idea[];
}

const priorityStyles: { [key in Priority]: { bg: string, border: string } } = {
    [Priority.High]: { bg: 'bg-status-red-bg', border: 'border-red-400' },
    [Priority.Medium]: { bg: 'bg-status-yellow-bg', border: 'border-yellow-400' },
    [Priority.Low]: { bg: 'bg-status-blue-bg', border: 'border-blue-400' },
};

const NoteCard: React.FC<{ note: Event; projects: Project[]; ideas: Idea[] }> = ({ note, projects, ideas }) => {
    const style = note.priority ? priorityStyles[note.priority] : { bg: 'bg-gray-100', border: 'border-gray-300' };

    const linkedProject = note.projectId ? projects.find(p => p.id === note.projectId) : null;
    const linkedIdea = note.ideaId ? ideas.find(i => i.id === note.ideaId) : null;
    const hasFooter = linkedProject || linkedIdea || (note.files && note.files.length > 0) || (note.reminder && note.reminder !== 'none');

    return (
        <div className={`p-4 rounded-lg shadow-sm break-inside-avoid-column border-l-4 transition-shadow hover:shadow-md ${style.bg} ${style.border}`}>
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-text-primary mb-2">{note.title}</h3>
                <button className="text-text-secondary hover:text-text-primary">
                    <Pin size={18} />
                </button>
            </div>
            <p className="text-text-secondary text-sm mb-4 whitespace-pre-wrap">{note.content}</p>
            <div className="flex flex-wrap gap-2">
                {note.tags?.map((tag, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                       {tag}
                    </span>
                ))}
            </div>
            {hasFooter && (
                 <div className="space-y-2 mt-3 pt-3 border-t">
                    {linkedProject && (
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                            <Briefcase size={14} className="text-project"/>
                            <span className="font-medium">{linkedProject.name}</span>
                        </div>
                    )}
                    {linkedIdea && (
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                            <Zap size={14} className="text-yellow-500"/>
                            <span className="font-medium">{linkedIdea.name}</span>
                        </div>
                    )}
                    {note.files && note.files.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                            <Paperclip size={14}/>
                            <span>{note.files.length} dosya</span>
                        </div>
                    )}
                    {note.reminder && note.reminder !== 'none' && (
                        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                            <Bell size={12} />
                            <span>Hatırlatma ayarlandı</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const NotesView: React.FC<NotesViewProps> = React.memo(({ notes, projects, ideas }) => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-text-primary mb-6">Notlar</h1>
            {notes.length > 0 ? (
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                    {notes.map(note => (
                        <NoteCard key={note.id} note={note} projects={projects} ideas={ideas} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-card-bg rounded-lg">
                    <p className="text-text-secondary">Henüz not oluşturulmadı.</p>
                    <p className="text-sm text-text-secondary mt-2">"Yeni Oluştur" butonuyla ilk notunuzu ekleyin.</p>
                </div>
            )}
        </div>
    );
});