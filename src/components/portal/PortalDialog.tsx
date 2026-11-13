'use client';
import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
export function PortalDialog({title,description,children,onClose,busy=false}:{title:string;description?:string;children:React.ReactNode;onClose:()=>void;busy?:boolean}) {
 const ref=useRef<HTMLDivElement>(null), titleId=useId(), descId=useId();
 const closeRef=useRef(onClose);closeRef.current=onClose;
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';ref.current?.focus();
  const handle=(e:KeyboardEvent)=>{
   if(e.key==='Escape'&&!busy){e.preventDefault();closeRef.current();}
   if(e.key==='Tab'){
    const nodes=Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')||[]).filter(el=>el.getClientRects().length);
    const first=nodes[0],last=nodes[nodes.length-1];
    if(!first){e.preventDefault();return;}
    if(e.shiftKey&&(document.activeElement===first||document.activeElement===ref.current)){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===ref.current)){e.preventDefault();first.focus();}
   }
  };
  document.addEventListener('keydown',handle);
  return()=>{document.removeEventListener('keydown',handle);document.body.style.overflow=overflow;previous?.focus();};
 },[busy]);
 return <div className="pt-dialog-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget&&!busy)onClose();}}><div className="pt-dialog" ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description?descId:undefined}><header><div><h2 id={titleId}>{title}</h2>{description&&<p id={descId}>{description}</p>}</div><button className="pt-icon-button" onClick={onClose} disabled={busy} aria-label="Close dialog"><X size={20}/></button></header>{children}</div></div>;
}
