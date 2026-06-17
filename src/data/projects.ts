// Special projects. The musical-fountain control work is the headline.

export const fountainNote =
  "The Fountain of Joy, opposite Victoria Memorial Hall, was listed among the world's 26 leading fountains by a global travel portal, in the company of the Trevi Fountain, the fountains at Versailles and the Bellagio in Las Vegas.";

export interface Project {
  name: string;
  place: string;
  state: string;
  scope: string;
  image: string;
  tall?: boolean;
}

export const fountainProjects: Project[] = [
  {
    name: "Fountain of Joy",
    place: "Victoria Memorial Hall, Kolkata",
    state: "West Bengal",
    scope: "Control system for the musical fountain",
    image: "/images/projects/fountain-of-joy.webp",
    tall: true,
  },
  {
    name: "Biswa Bangla",
    place: "Kolkata",
    state: "West Bengal",
    scope: "Fountain control and lighting",
    image: "/images/projects/biswa-bangla.webp",
  },
  {
    name: "Water Fountain Show",
    place: "Eco Park, New Town, Kolkata",
    state: "West Bengal",
    scope: "Musical fountain control",
    image: "/images/projects/eco-park.webp",
  },
  {
    name: "Krishna River Musical Fountain",
    place: "Ahmedabad",
    state: "Gujarat",
    scope: "Fountain control panels",
    image: "/images/projects/krishna-river.webp",
  },
];

export interface Install {
  name: string;
  place: string;
  state: string;
}

export const installations: Install[] = [
  { name: "VFD Panel", place: "Mumbai", state: "Maharashtra" },
  { name: "Distribution Panel, Tirupathy Bright", place: "Chennai", state: "Tamil Nadu" },
  { name: "Distribution boards, Birla Sugar Mills", place: "Birla Sugar", state: "Bihar" },
];
