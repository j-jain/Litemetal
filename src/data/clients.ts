// Client roster from the portfolio, grouped by sector and presented as a
// typographic wall (cleaner and more honest than low-resolution logo scans).

export interface ClientGroup {
  sector: string;
  clients: string[];
}

export const clientGroups: ClientGroup[] = [
  {
    sector: "Utilities & Government",
    clients: [
      "CESC Limited",
      "Government of West Bengal",
      "WBHIDCO",
      "Premier Irrigation Adritec",
    ],
  },
  {
    sector: "Industry & Manufacturing",
    clients: [
      "Birla Sugar (K.K. Birla Group)",
      "Beekay Steel Industries",
      "Kamakhya Bottlers",
      "Gamut Infosystems",
      "Dot & Key",
      "Prospace Industrial Parks",
    ],
  },
  {
    sector: "Real Estate & Infrastructure",
    clients: [
      "PS Group",
      "Srijan",
      "Jain Group",
      "Jalan Builders",
      "Purti Realty",
      "Sugam",
      "Alcove Realty",
      "Swayam City",
      "Primarc",
      "Prasad Group",
      "AG Group",
      "Infinity",
      "DTC",
      "Natural Group",
      "ATK Kalim Group",
      "Premierworld",
    ],
  },
];

// A few names pulled out for emphasis at the top of the section.
export const marqueeClients = [
  "CESC Limited",
  "Government of West Bengal",
  "Birla Sugar",
  "PS Group",
  "Srijan",
  "Beekay Steel",
  "Jain Group",
  "WBHIDCO",
];

export const clientCount = clientGroups.reduce((n, g) => n + g.clients.length, 0);
