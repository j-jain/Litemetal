// Client roster — now sourced from Sanity CMS (edit at /studio), grouped by
// sector and shown as a typographic wall. Shapes preserved for components.
import { getClientGroups, type ClientGroup } from "../lib/queries";

export type { ClientGroup };

export const clientGroups: ClientGroup[] = await getClientGroups();

export const clientCount = clientGroups.reduce((n, g) => n + g.clients.length, 0);
