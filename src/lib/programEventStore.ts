import { ProgramEvent } from './programEvents';
// Demo only: shared across route modules in this process, not durable across instances.
const state=globalThis as typeof globalThis & {lpcDemoPrograms?:Map<string,ProgramEvent>};
export const programEventStore=state.lpcDemoPrograms??(state.lpcDemoPrograms=new Map());
