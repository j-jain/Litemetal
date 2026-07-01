// Special projects — now sourced from Sanity CMS (edit at /studio). The
// musical-fountain control work is the headline. `fountainNote` lives on the
// Site Settings singleton. Shapes preserved for components.
import {
  getFountainProjects,
  getInstallations,
  getSiteSettings,
  type Project,
  type Install,
} from "../lib/queries";

export type { Project, Install };

export const fountainProjects: Project[] = await getFountainProjects();
export const installations: Install[] = await getInstallations();
export const fountainNote: string = (await getSiteSettings()).fountainNote;
