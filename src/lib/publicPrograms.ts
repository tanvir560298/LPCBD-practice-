import { ProgramEvent } from './programEvents';
export type PublicProgram=Pick<ProgramEvent,'id'|'title'|'type'|'date'|'start'|'end'|'venue'|'instructions'>;
export function upcomingPrograms(events:ProgramEvent[],now=new Date()) {
 return events.filter(e=>!e.cancelled&&new Date(`${e.date}T${e.end}:00+06:00`).getTime()>now.getTime()).sort((a,b)=>`${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
}
export function publicProgram(e:ProgramEvent):PublicProgram {
 return {id:e.id,title:e.title,type:e.type,date:e.date,start:e.start,end:e.end,venue:e.venue,instructions:e.instructions};
}
export function formatProgramWhen(event:PublicProgram) {
 const date=new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeZone:'Asia/Dhaka'}).format(new Date(`${event.date}T12:00:00+06:00`));
 const time=(value:string)=>{const [h,m]=value.split(':');return `${Number(h)%12||12}:${m} ${Number(h)>=12?'PM':'AM'}`;};
 return `${date} · ${time(event.start)}–${time(event.end)} (Dhaka)`;
}
