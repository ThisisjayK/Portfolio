/* The page's sections, one file each. This was a single 787-line sections.tsx
   holding nine components plus the volunteering data; App.tsx imported the lot
   from one path, so this barrel keeps that import shape while the source is
   split. Add a section by creating its file and re-exporting it here.

   Copy is ported verbatim from the static site; the bracketed text and the TODO
   notes inside these files mark what Jay still needs to fill in. No em dashes
   anywhere, per house style.

   Two things deliberately live outside this folder, because they are not
   sections: useThemeName (src/hooks, shared by Work and Teardowns) and the
   volunteering entries (src/data/volunteer.ts, which is data App.tsx reads
   directly to resolve a /volunteer/<id> route). */

export { About } from "./About";
export { Work, type CaseId } from "./Work";
export { Teardowns } from "./Teardowns";
export { Skills } from "./Skills";
export { Contact } from "./Contact";
/* Résumé is no longer a section. It was one file holding a download link, and
   is now the Résumé button in the bar plus src/components/ResumeModal.tsx. */
export { Volunteer, VolunteerDetail } from "./Volunteer";
export { Footer } from "./Footer";
export { VOLUNTEER_ITEMS, type VolunteerItem } from "../data/volunteer";
