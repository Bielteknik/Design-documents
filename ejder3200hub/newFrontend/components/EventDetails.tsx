import React from 'react';
import { Event, Resource, Project, Idea, RsvpStatus, EventType } from '../types';
import { Calendar, Clock, MapPin, Users, Type, Paperclip, Briefcase, Zap, Check, X } from 'lucide-react';

const DetailItem: React.FC<{ icon: React.ElementType; label: string; children: React.ReactNode }> = ({ icon: Icon, label, children }) => (
    <div className="flex items-start gap-4">
        <Icon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
        <div className="flex-1">
            <p className="text-xs text-gray-500">{label}</p>
            <div className="text-md font-semibold text-gray-800 mt-0.5">{children}</div>
        </div>
    </div>
);


const RsvpIndicator: React.FC<{ status: RsvpStatus }> = ({ status }) => {
    switch (status) {
        case RsvpStatus.Accepted:
            return <Check size={14} className="text-green-500 bg-green-100 rounded-full p-0.5" />;
        case RsvpStatus.Declined:
            return <X size={14} className="text-red-500 bg-red-100 rounded-full p-0.5" />;
        default:
            return null;
    }
}

// FIX: Defined the missing `EventDetailsProps` interface to resolve a TypeScript error.
interface EventDetailsProps {
    event: Event;
    resources: Resource[];
    projects: Project[];
    ideas: Idea[];
    currentUserId: string;
    onEdit: () => void;
    onUpdateRsvp: (status: RsvpStatus) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event, resources, projects, ideas, currentUserId, onEdit, onUpdateRsvp }) => {
    
    // FIX: Updated participant check to use string IDs, aligning with the refactored `Event` type.
    const isMeetingParticipant = event.type === EventType.Meeting && event.participants?.includes(currentUserId);
    // FIX: The index type is now a string which is correct for `rsvp` object.
    const currentUserRsvp = event.rsvp?.[currentUserId];

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                    <DetailItem icon={Type} label="Başlık">
                        <p className="font-bold">{event.title}</p>
                    </DetailItem>
                    
                    <DetailItem icon={Calendar} label="Tarih">
                        {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </DetailItem>

                    {event.startTime && (
                         <DetailItem icon={Clock} label="Saat">
                            {event.startTime} {event.endTime && `- ${event.endTime}`}
                        </DetailItem>
                    )}

                    {event.location && (
                         <DetailItem icon={MapPin} label="Konum">
                            {event.location}
                        </DetailItem>
                    )}
                    
                    {event.description && (
                        <DetailItem icon={Type} label="Açıklama">
                            <p className="whitespace-pre-wrap font-normal">{event.description}</p>
                        </DetailItem>
                    )}
                    
                    {event.content && (
                        <DetailItem icon={Type} label="İçerik">
                             <p className="whitespace-pre-wrap font-normal">{event.content}</p>
                        </DetailItem>
                    )}

                    {event.type === EventType.Meeting && event.participants && (
                         <DetailItem icon={Users} label="Katılımcılar">
                            <div className="flex flex-wrap gap-2 pt-1">
                                {/* FIX: `id` is now a string (participant ID) and can be used as a key. */}
                                {event.participants.map(id => {
                                    const resource = resources.find(r => r.id === id);
                                    if (!resource) return null;
                                    const rsvpStatus = event.rsvp?.[id];
                                    return (
                                        <div key={id} className="flex items-center gap-2 bg-gray-100 rounded-full pr-3 py-1">
                                            <img src={`https://picsum.photos/seed/${id}/24/24`} alt={resource.name} className="w-6 h-6 rounded-full" />
                                            <span className="text-sm font-medium">{resource.name}</span>
                                            {rsvpStatus && <RsvpIndicator status={rsvpStatus} />}
                                        </div>
                                    )
                                })}
                            </div>
                        </DetailItem>
                    )}

                    {event.projectId && (
                        <DetailItem icon={Briefcase} label="İlişkili Proje">
                            {projects.find(p => p.id === event.projectId)?.name || 'Bilinmiyor'}
                        </DetailItem>
                    )}
                     {event.ideaId && (
                        <DetailItem icon={Zap} label="İlişkili Fikir">
                            {ideas.find(i => i.id === event.ideaId)?.name || 'Bilinmiyor'}
                        </DetailItem>
                    )}

                    {event.files && event.files.length > 0 && (
                        <DetailItem icon={Paperclip} label="Ekli Dosyalar">
                            <div className="flex flex-col gap-1 pt-1">
                                {event.files.map((file, index) => <a href="#" key={index} className="text-blue-600 hover:underline cursor-pointer font-normal text-sm">{file}</a>)}
                            </div>
                        </DetailItem>
                    )}
                    
                    {isMeetingParticipant && (
                         <div className="pt-4 border-t">
                            <p className="text-sm font-semibold mb-2">Katılım durumunuzu belirtin:</p>
                            <div className="flex gap-2">
                                <button onClick={() => onUpdateRsvp(RsvpStatus.Accepted)} className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition ${currentUserRsvp === RsvpStatus.Accepted ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                                   <Check size={16}/> Katılıyorum
                                </button>
                                <button onClick={() => onUpdateRsvp(RsvpStatus.Declined)} className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition ${currentUserRsvp === RsvpStatus.Declined ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                                   <X size={16}/> Katılamıyorum
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t bg-gray-50">
                <button type="button" onClick={onEdit} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition font-semibold text-sm">Düzenle</button>
            </div>
        </div>
    );
};