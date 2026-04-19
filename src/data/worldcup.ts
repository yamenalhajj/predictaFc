// Auto-generated from ML model predictions (WC 2026 real draw data)
// Model accuracy: 55.54% | Predicted champion: Spain

export type Stage = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | '3rd' | 'final';

export interface Team {
  id: number;
  name: string;
  shortName: string;
  flagCode: string;
  confederation: string;
  ranking: number;
  group: string;
  strength: number;
  attack: number;
  defense: number;
  form: ('W' | 'D' | 'L')[];
}

export interface Match {
  id: string;
  stage: Stage;
  group?: string;
  matchday?: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  probHomeWin: number;
  probDraw: number;
  probAwayWin: number;
  confidence: string;
  winner?: string;
  date?: string;
}

export interface Standing {
  team: string;
  W: number; D: number; L: number;
  GF: number; GA: number; GD: number; Pts: number;
}

export const TEAMS: Team[] = [
  { id: 1, name: "Mexico", shortName: "MEX", flagCode: "mx", confederation: "CONCACAF", ranking: 1681.03, group: "A", strength: 88.6, attack: 89.2, defense: 89.2, form: ["W","D","W","W","D"] },
  { id: 2, name: "South Africa", shortName: "RSA", flagCode: "za", confederation: "CAF", ranking: 1390.0, group: "A", strength: 73.3, attack: 80.7, defense: 80.7, form: ["D","W","L","D","W"] },
  { id: 3, name: "South Korea", shortName: "KOR", flagCode: "kr", confederation: "AFC", ranking: 1605.0, group: "A", strength: 84.6, attack: 87.0, defense: 87.0, form: ["W","W","D","D","W"] },
  { id: 4, name: "Denmark", shortName: "DEN", flagCode: "dk", confederation: "UEFA", ranking: 1620.81, group: "A", strength: 85.5, attack: 87.5, defense: 87.5, form: ["W","W","D","D","W"] },
  { id: 5, name: "Canada", shortName: "CAN", flagCode: "ca", confederation: "CONCACAF", ranking: 1648.5, group: "B", strength: 86.9, attack: 88.3, defense: 88.3, form: ["W","W","D","D","W"] },
  { id: 6, name: "Italy", shortName: "ITA", flagCode: "it", confederation: "UEFA", ranking: 1700.37, group: "B", strength: 89.7, attack: 89.8, defense: 89.8, form: ["W","W","D","W","W"] },
  { id: 7, name: "Qatar", shortName: "QAT", flagCode: "qa", confederation: "AFC", ranking: 1300.0, group: "B", strength: 68.6, attack: 78.1, defense: 78.1, form: ["L","D","W","L","D"] },
  { id: 8, name: "Switzerland", shortName: "SUI", flagCode: "ch", confederation: "UEFA", ranking: 1649.4, group: "B", strength: 87.0, attack: 88.3, defense: 88.3, form: ["W","W","D","D","W"] },
  { id: 9, name: "Brazil", shortName: "BRA", flagCode: "br", confederation: "CONMEBOL", ranking: 1761.16, group: "C", strength: 92.9, attack: 91.6, defense: 91.6, form: ["W","W","W","D","W"] },
  { id: 10, name: "Morocco", shortName: "MAR", flagCode: "ma", confederation: "CAF", ranking: 1755.87, group: "C", strength: 92.6, attack: 91.4, defense: 91.4, form: ["W","W","W","D","W"] },
  { id: 11, name: "Haiti", shortName: "HAI", flagCode: "ht", confederation: "CONCACAF", ranking: 1215.0, group: "C", strength: 64.1, attack: 75.6, defense: 75.6, form: ["L","D","W","L","D"] },
  { id: 12, name: "Scotland", shortName: "SCO", flagCode: "gb-sct", confederation: "UEFA", ranking: 1495.0, group: "C", strength: 78.8, attack: 83.8, defense: 83.8, form: ["W","D","L","W","W"] },
  { id: 13, name: "United States", shortName: "USA", flagCode: "us", confederation: "CONCACAF", ranking: 1673.13, group: "D", strength: 88.2, attack: 89.0, defense: 89.0, form: ["W","D","W","W","D"] },
  { id: 14, name: "Paraguay", shortName: "PAR", flagCode: "py", confederation: "CONMEBOL", ranking: 1420.0, group: "D", strength: 74.9, attack: 81.6, defense: 81.6, form: ["W","L","D","W","D"] },
  { id: 15, name: "Australia", shortName: "AUS", flagCode: "au", confederation: "AFC", ranking: 1580.0, group: "D", strength: 83.3, attack: 86.3, defense: 86.3, form: ["W","D","W","D","W"] },
  { id: 16, name: "Turkey", shortName: "TUR", flagCode: "tr", confederation: "UEFA", ranking: 1545.0, group: "D", strength: 81.5, attack: 85.3, defense: 85.3, form: ["D","W","W","D","L"] },
  { id: 17, name: "Germany", shortName: "GER", flagCode: "de", confederation: "UEFA", ranking: 1730.37, group: "E", strength: 91.3, attack: 90.7, defense: 90.7, form: ["W","W","D","W","W"] },
  { id: 18, name: "Cura\u00e7ao", shortName: "CUW", flagCode: "cw", confederation: "CONCACAF", ranking: 1175.0, group: "E", strength: 62.0, attack: 74.4, defense: 74.4, form: ["L","D","W","L","D"] },
  { id: 19, name: "C\u00f4te d'Ivoire", shortName: "CIV", flagCode: "ci", confederation: "CAF", ranking: 1450.0, group: "E", strength: 76.5, attack: 82.5, defense: 82.5, form: ["W","D","L","W","W"] },
  { id: 20, name: "Ecuador", shortName: "ECU", flagCode: "ec", confederation: "CONMEBOL", ranking: 1565.0, group: "E", strength: 82.5, attack: 85.8, defense: 85.8, form: ["W","D","W","D","W"] },
  { id: 21, name: "Netherlands", shortName: "NED", flagCode: "nl", confederation: "UEFA", ranking: 1757.87, group: "F", strength: 92.7, attack: 91.5, defense: 91.5, form: ["W","W","W","D","W"] },
  { id: 22, name: "Japan", shortName: "JPN", flagCode: "jp", confederation: "AFC", ranking: 1660.43, group: "F", strength: 87.6, attack: 88.6, defense: 88.6, form: ["W","D","W","W","D"] },
  { id: 23, name: "Ukraine", shortName: "UKR", flagCode: "ua", confederation: "UEFA", ranking: 1530.0, group: "F", strength: 80.7, attack: 84.8, defense: 84.8, form: ["D","W","W","D","L"] },
  { id: 24, name: "Tunisia", shortName: "TUN", flagCode: "tn", confederation: "CAF", ranking: 1485.0, group: "F", strength: 78.3, attack: 83.5, defense: 83.5, form: ["W","D","L","W","W"] },
  { id: 25, name: "Belgium", shortName: "BEL", flagCode: "be", confederation: "UEFA", ranking: 1734.71, group: "G", strength: 91.5, attack: 90.8, defense: 90.8, form: ["W","W","D","W","W"] },
  { id: 26, name: "Egypt", shortName: "EGY", flagCode: "eg", confederation: "CAF", ranking: 1470.0, group: "G", strength: 77.5, attack: 83.1, defense: 83.1, form: ["W","D","L","W","W"] },
  { id: 27, name: "IR Iran", shortName: "IRN", flagCode: "ir", confederation: "AFC", ranking: 1615.0, group: "G", strength: 85.2, attack: 87.3, defense: 87.3, form: ["W","W","D","D","W"] },
  { id: 28, name: "New Zealand", shortName: "NZL", flagCode: "nz", confederation: "OFC", ranking: 1190.0, group: "G", strength: 62.8, attack: 74.9, defense: 74.9, form: ["L","D","W","L","D"] },
  { id: 29, name: "Spain", shortName: "ESP", flagCode: "es", confederation: "UEFA", ranking: 1876.4, group: "H", strength: 99.0, attack: 95.0, defense: 95.0, form: ["W","W","W","W","D"] },
  { id: 30, name: "Cape Verde", shortName: "CPV", flagCode: "cv", confederation: "CAF", ranking: 1325.0, group: "H", strength: 69.9, attack: 78.8, defense: 78.8, form: ["L","D","W","L","D"] },
  { id: 31, name: "Saudi Arabia", shortName: "KSA", flagCode: "sa", confederation: "AFC", ranking: 1370.0, group: "H", strength: 72.2, attack: 80.1, defense: 80.1, form: ["D","W","L","D","W"] },
  { id: 32, name: "Uruguay", shortName: "URU", flagCode: "uy", confederation: "CONMEBOL", ranking: 1673.07, group: "H", strength: 88.2, attack: 89.0, defense: 89.0, form: ["W","D","W","W","D"] },
  { id: 33, name: "France", shortName: "FRA", flagCode: "fr", confederation: "UEFA", ranking: 1877.32, group: "I", strength: 99.0, attack: 95.0, defense: 95.0, form: ["W","W","W","W","D"] },
  { id: 34, name: "Senegal", shortName: "SEN", flagCode: "sn", confederation: "CAF", ranking: 1688.99, group: "I", strength: 89.1, attack: 89.5, defense: 89.5, form: ["W","D","W","W","D"] },
  { id: 35, name: "Iraq", shortName: "IRQ", flagCode: "iq", confederation: "AFC", ranking: 1230.0, group: "I", strength: 64.9, attack: 76.0, defense: 76.0, form: ["L","D","W","L","D"] },
  { id: 36, name: "Norway", shortName: "NOR", flagCode: "no", confederation: "UEFA", ranking: 1560.0, group: "I", strength: 82.3, attack: 85.7, defense: 85.7, form: ["W","D","W","D","W"] },
  { id: 37, name: "Argentina", shortName: "ARG", flagCode: "ar", confederation: "CONMEBOL", ranking: 1874.81, group: "J", strength: 98.9, attack: 94.9, defense: 94.9, form: ["W","W","W","W","D"] },
  { id: 38, name: "Algeria", shortName: "ALG", flagCode: "dz", confederation: "CAF", ranking: 1510.0, group: "J", strength: 79.6, attack: 84.2, defense: 84.2, form: ["D","W","W","D","L"] },
  { id: 39, name: "Austria", shortName: "AUT", flagCode: "at", confederation: "UEFA", ranking: 1550.0, group: "J", strength: 81.7, attack: 85.4, defense: 85.4, form: ["W","D","W","D","W"] },
  { id: 40, name: "Jordan", shortName: "JOR", flagCode: "jo", confederation: "AFC", ranking: 1260.0, group: "J", strength: 66.4, attack: 76.9, defense: 76.9, form: ["L","D","W","L","D"] },
  { id: 41, name: "Portugal", shortName: "POR", flagCode: "pt", confederation: "UEFA", ranking: 1763.83, group: "K", strength: 93.0, attack: 91.7, defense: 91.7, form: ["W","W","W","D","W"] },
  { id: 42, name: "Jamaica", shortName: "JAM", flagCode: "jm", confederation: "CONCACAF", ranking: 1355.0, group: "K", strength: 71.5, attack: 79.7, defense: 79.7, form: ["D","W","L","D","W"] },
  { id: 43, name: "Uzbekistan", shortName: "UZB", flagCode: "uz", confederation: "AFC", ranking: 1245.0, group: "K", strength: 65.7, attack: 76.5, defense: 76.5, form: ["L","D","W","L","D"] },
  { id: 44, name: "Colombia", shortName: "COL", flagCode: "co", confederation: "CONMEBOL", ranking: 1693.09, group: "K", strength: 89.3, attack: 89.6, defense: 89.6, form: ["W","D","W","W","D"] },
  { id: 45, name: "England", shortName: "ENG", flagCode: "gb-eng", confederation: "UEFA", ranking: 1825.97, group: "L", strength: 96.3, attack: 93.5, defense: 93.5, form: ["W","W","W","W","D"] },
  { id: 46, name: "Croatia", shortName: "CRO", flagCode: "hr", confederation: "UEFA", ranking: 1717.07, group: "L", strength: 90.5, attack: 90.3, defense: 90.3, form: ["W","W","D","W","W"] },
  { id: 47, name: "Ghana", shortName: "GHA", flagCode: "gh", confederation: "CAF", ranking: 1340.0, group: "L", strength: 70.7, attack: 79.3, defense: 79.3, form: ["L","D","W","L","D"] },
  { id: 48, name: "Panama", shortName: "PAN", flagCode: "pa", confederation: "CONCACAF", ranking: 1280.0, group: "L", strength: 67.5, attack: 77.5, defense: 77.5, form: ["L","D","W","L","D"] },
];

export const GROUPS: Record<string, string[]> = {
  A: ["Mexico", "South Africa", "South Korea", "Denmark"],
  B: ["Canada", "Italy", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["United States", "Paraguay", "Australia", "Turkey"],
  E: ["Germany", "Cura\u00e7ao", "C\u00f4te d'Ivoire", "Ecuador"],
  F: ["Netherlands", "Japan", "Ukraine", "Tunisia"],
  G: ["Belgium", "Egypt", "IR Iran", "New Zealand"],
  H: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Iraq", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "Jamaica", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"],
};

export const GROUP_MATCHES: Match[] = [
  { id: "A1", stage: "group", group: "A", matchday: 1, homeTeam: "Mexico", awayTeam: "South Africa", homeScore: 1, awayScore: 0, probHomeWin: 46.7, probDraw: 34.0, probAwayWin: 19.4, confidence: "Medium", date: "2026-06-11" },
  { id: "A2", stage: "group", group: "A", matchday: 1, homeTeam: "South Korea", awayTeam: "Denmark", homeScore: 1, awayScore: 1, probHomeWin: 27.0, probDraw: 36.7, probAwayWin: 36.3, confidence: "Low", date: "2026-06-11" },
  { id: "A3", stage: "group", group: "A", matchday: 2, homeTeam: "Mexico", awayTeam: "South Korea", homeScore: 1, awayScore: 0, probHomeWin: 36.3, probDraw: 35.9, probAwayWin: 27.8, confidence: "Low", date: "2026-06-15" },
  { id: "A4", stage: "group", group: "A", matchday: 2, homeTeam: "South Africa", awayTeam: "Denmark", homeScore: 1, awayScore: 2, probHomeWin: 20.0, probDraw: 34.8, probAwayWin: 45.2, confidence: "Medium", date: "2026-06-15" },
  { id: "A5", stage: "group", group: "A", matchday: 3, homeTeam: "Mexico", awayTeam: "Denmark", homeScore: 2, awayScore: 1, probHomeWin: 34.3, probDraw: 31.8, probAwayWin: 33.8, confidence: "Low", date: "2026-06-19" },
  { id: "A6", stage: "group", group: "A", matchday: 3, homeTeam: "South Africa", awayTeam: "South Korea", homeScore: 1, awayScore: 2, probHomeWin: 18.7, probDraw: 36.4, probAwayWin: 44.8, confidence: "Medium", date: "2026-06-19" },
  { id: "B7", stage: "group", group: "B", matchday: 1, homeTeam: "Canada", awayTeam: "Italy", homeScore: 0, awayScore: 1, probHomeWin: 21.7, probDraw: 31.8, probAwayWin: 46.5, confidence: "Medium", date: "2026-06-12" },
  { id: "B8", stage: "group", group: "B", matchday: 1, homeTeam: "Qatar", awayTeam: "Switzerland", homeScore: 1, awayScore: 2, probHomeWin: 22.8, probDraw: 32.9, probAwayWin: 44.2, confidence: "Medium", date: "2026-06-12" },
  { id: "B9", stage: "group", group: "B", matchday: 2, homeTeam: "Canada", awayTeam: "Qatar", homeScore: 1, awayScore: 0, probHomeWin: 49.6, probDraw: 35.0, probAwayWin: 15.4, confidence: "Medium", date: "2026-06-16" },
  { id: "B10", stage: "group", group: "B", matchday: 2, homeTeam: "Italy", awayTeam: "Switzerland", homeScore: 1, awayScore: 1, probHomeWin: 32.2, probDraw: 35.1, probAwayWin: 32.7, confidence: "Low", date: "2026-06-16" },
  { id: "B11", stage: "group", group: "B", matchday: 3, homeTeam: "Canada", awayTeam: "Switzerland", homeScore: 1, awayScore: 1, probHomeWin: 25.5, probDraw: 42.7, probAwayWin: 31.8, confidence: "Medium", date: "2026-06-20" },
  { id: "B12", stage: "group", group: "B", matchday: 3, homeTeam: "Italy", awayTeam: "Qatar", homeScore: 1, awayScore: 0, probHomeWin: 46.7, probDraw: 34.8, probAwayWin: 18.6, confidence: "Medium", date: "2026-06-20" },
  { id: "C13", stage: "group", group: "C", matchday: 1, homeTeam: "Brazil", awayTeam: "Morocco", homeScore: 1, awayScore: 1, probHomeWin: 30.6, probDraw: 37.5, probAwayWin: 31.9, confidence: "Low", date: "2026-06-12" },
  { id: "C14", stage: "group", group: "C", matchday: 1, homeTeam: "Haiti", awayTeam: "Scotland", homeScore: 1, awayScore: 2, probHomeWin: 19.0, probDraw: 35.2, probAwayWin: 45.9, confidence: "Medium", date: "2026-06-12" },
  { id: "C15", stage: "group", group: "C", matchday: 2, homeTeam: "Brazil", awayTeam: "Haiti", homeScore: 2, awayScore: 1, probHomeWin: 52.2, probDraw: 31.0, probAwayWin: 16.9, confidence: "Medium", date: "2026-06-16" },
  { id: "C16", stage: "group", group: "C", matchday: 2, homeTeam: "Morocco", awayTeam: "Scotland", homeScore: 2, awayScore: 1, probHomeWin: 41.2, probDraw: 40.1, probAwayWin: 18.7, confidence: "Low", date: "2026-06-16" },
  { id: "C17", stage: "group", group: "C", matchday: 3, homeTeam: "Brazil", awayTeam: "Scotland", homeScore: 2, awayScore: 1, probHomeWin: 45.5, probDraw: 36.1, probAwayWin: 18.3, confidence: "Medium", date: "2026-06-20" },
  { id: "C18", stage: "group", group: "C", matchday: 3, homeTeam: "Morocco", awayTeam: "Haiti", homeScore: 1, awayScore: 0, probHomeWin: 44.6, probDraw: 37.2, probAwayWin: 18.2, confidence: "Medium", date: "2026-06-20" },
  { id: "D19", stage: "group", group: "D", matchday: 1, homeTeam: "United States", awayTeam: "Paraguay", homeScore: 2, awayScore: 1, probHomeWin: 41.1, probDraw: 36.4, probAwayWin: 22.5, confidence: "Low", date: "2026-06-13" },
  { id: "D20", stage: "group", group: "D", matchday: 1, homeTeam: "Australia", awayTeam: "Turkey", homeScore: 1, awayScore: 2, probHomeWin: 23.0, probDraw: 33.7, probAwayWin: 43.3, confidence: "Medium", date: "2026-06-13" },
  { id: "D21", stage: "group", group: "D", matchday: 2, homeTeam: "United States", awayTeam: "Australia", homeScore: 2, awayScore: 1, probHomeWin: 38.5, probDraw: 33.6, probAwayWin: 27.9, confidence: "Low", date: "2026-06-17" },
  { id: "D22", stage: "group", group: "D", matchday: 2, homeTeam: "Paraguay", awayTeam: "Turkey", homeScore: 0, awayScore: 1, probHomeWin: 20.8, probDraw: 36.5, probAwayWin: 42.7, confidence: "Medium", date: "2026-06-17" },
  { id: "D23", stage: "group", group: "D", matchday: 3, homeTeam: "United States", awayTeam: "Turkey", homeScore: 1, awayScore: 1, probHomeWin: 34.0, probDraw: 35.0, probAwayWin: 31.0, confidence: "Low", date: "2026-06-21" },
  { id: "D24", stage: "group", group: "D", matchday: 3, homeTeam: "Paraguay", awayTeam: "Australia", homeScore: 1, awayScore: 2, probHomeWin: 21.4, probDraw: 38.4, probAwayWin: 40.2, confidence: "Low", date: "2026-06-21" },
  { id: "E25", stage: "group", group: "E", matchday: 1, homeTeam: "Germany", awayTeam: "Cura\u00e7ao", homeScore: 2, awayScore: 1, probHomeWin: 55.1, probDraw: 28.1, probAwayWin: 16.8, confidence: "High", date: "2026-06-13" },
  { id: "E26", stage: "group", group: "E", matchday: 1, homeTeam: "C\u00f4te d'Ivoire", awayTeam: "Ecuador", homeScore: 1, awayScore: 2, probHomeWin: 25.0, probDraw: 36.3, probAwayWin: 38.7, confidence: "Low", date: "2026-06-13" },
  { id: "E27", stage: "group", group: "E", matchday: 2, homeTeam: "Germany", awayTeam: "C\u00f4te d'Ivoire", homeScore: 2, awayScore: 1, probHomeWin: 42.6, probDraw: 38.4, probAwayWin: 19.0, confidence: "Medium", date: "2026-06-17" },
  { id: "E28", stage: "group", group: "E", matchday: 2, homeTeam: "Cura\u00e7ao", awayTeam: "Ecuador", homeScore: 1, awayScore: 2, probHomeWin: 14.2, probDraw: 33.6, probAwayWin: 52.2, confidence: "Medium", date: "2026-06-17" },
  { id: "E29", stage: "group", group: "E", matchday: 3, homeTeam: "Germany", awayTeam: "Ecuador", homeScore: 1, awayScore: 0, probHomeWin: 47.1, probDraw: 34.2, probAwayWin: 18.7, confidence: "Medium", date: "2026-06-21" },
  { id: "E30", stage: "group", group: "E", matchday: 3, homeTeam: "Cura\u00e7ao", awayTeam: "C\u00f4te d'Ivoire", homeScore: 1, awayScore: 2, probHomeWin: 17.3, probDraw: 34.6, probAwayWin: 48.1, confidence: "Medium", date: "2026-06-21" },
  { id: "F31", stage: "group", group: "F", matchday: 1, homeTeam: "Netherlands", awayTeam: "Japan", homeScore: 2, awayScore: 1, probHomeWin: 40.4, probDraw: 34.2, probAwayWin: 25.4, confidence: "Low", date: "2026-06-14" },
  { id: "F32", stage: "group", group: "F", matchday: 1, homeTeam: "Ukraine", awayTeam: "Tunisia", homeScore: 1, awayScore: 1, probHomeWin: 33.7, probDraw: 40.0, probAwayWin: 26.3, confidence: "Low", date: "2026-06-14" },
  { id: "F33", stage: "group", group: "F", matchday: 2, homeTeam: "Netherlands", awayTeam: "Ukraine", homeScore: 2, awayScore: 0, probHomeWin: 49.8, probDraw: 35.0, probAwayWin: 15.2, confidence: "Medium", date: "2026-06-18" },
  { id: "F34", stage: "group", group: "F", matchday: 2, homeTeam: "Japan", awayTeam: "Tunisia", homeScore: 1, awayScore: 0, probHomeWin: 45.2, probDraw: 37.4, probAwayWin: 17.4, confidence: "Medium", date: "2026-06-18" },
  { id: "F35", stage: "group", group: "F", matchday: 3, homeTeam: "Netherlands", awayTeam: "Tunisia", homeScore: 1, awayScore: 0, probHomeWin: 46.4, probDraw: 41.0, probAwayWin: 12.6, confidence: "Medium", date: "2026-06-22" },
  { id: "F36", stage: "group", group: "F", matchday: 3, homeTeam: "Japan", awayTeam: "Ukraine", homeScore: 0, awayScore: 0, probHomeWin: 38.3, probDraw: 39.1, probAwayWin: 22.6, confidence: "Low", date: "2026-06-22" },
  { id: "G37", stage: "group", group: "G", matchday: 1, homeTeam: "Belgium", awayTeam: "Egypt", homeScore: 2, awayScore: 1, probHomeWin: 41.8, probDraw: 40.0, probAwayWin: 18.2, confidence: "Low", date: "2026-06-14" },
  { id: "G38", stage: "group", group: "G", matchday: 1, homeTeam: "IR Iran", awayTeam: "New Zealand", homeScore: 1, awayScore: 0, probHomeWin: 51.3, probDraw: 32.4, probAwayWin: 16.3, confidence: "Medium", date: "2026-06-14" },
  { id: "G39", stage: "group", group: "G", matchday: 2, homeTeam: "Belgium", awayTeam: "IR Iran", homeScore: 2, awayScore: 1, probHomeWin: 45.4, probDraw: 35.0, probAwayWin: 19.6, confidence: "Medium", date: "2026-06-18" },
  { id: "G40", stage: "group", group: "G", matchday: 2, homeTeam: "Egypt", awayTeam: "New Zealand", homeScore: 1, awayScore: 0, probHomeWin: 47.4, probDraw: 35.2, probAwayWin: 17.3, confidence: "Medium", date: "2026-06-18" },
  { id: "G41", stage: "group", group: "G", matchday: 3, homeTeam: "Belgium", awayTeam: "New Zealand", homeScore: 2, awayScore: 1, probHomeWin: 53.8, probDraw: 29.9, probAwayWin: 16.3, confidence: "Medium", date: "2026-06-22" },
  { id: "G42", stage: "group", group: "G", matchday: 3, homeTeam: "Egypt", awayTeam: "IR Iran", homeScore: 0, awayScore: 1, probHomeWin: 23.9, probDraw: 34.3, probAwayWin: 41.8, confidence: "Low", date: "2026-06-22" },
  { id: "H43", stage: "group", group: "H", matchday: 1, homeTeam: "Spain", awayTeam: "Cape Verde", homeScore: 1, awayScore: 0, probHomeWin: 55.6, probDraw: 29.9, probAwayWin: 14.5, confidence: "High", date: "2026-06-15" },
  { id: "H44", stage: "group", group: "H", matchday: 1, homeTeam: "Saudi Arabia", awayTeam: "Uruguay", homeScore: 1, awayScore: 2, probHomeWin: 19.5, probDraw: 31.0, probAwayWin: 49.5, confidence: "Medium", date: "2026-06-15" },
  { id: "H45", stage: "group", group: "H", matchday: 2, homeTeam: "Spain", awayTeam: "Saudi Arabia", homeScore: 2, awayScore: 0, probHomeWin: 57.5, probDraw: 32.1, probAwayWin: 10.4, confidence: "High", date: "2026-06-19" },
  { id: "H46", stage: "group", group: "H", matchday: 2, homeTeam: "Cape Verde", awayTeam: "Uruguay", homeScore: 1, awayScore: 2, probHomeWin: 19.4, probDraw: 31.9, probAwayWin: 48.7, confidence: "Medium", date: "2026-06-19" },
  { id: "H47", stage: "group", group: "H", matchday: 3, homeTeam: "Spain", awayTeam: "Uruguay", homeScore: 2, awayScore: 0, probHomeWin: 51.7, probDraw: 34.2, probAwayWin: 14.1, confidence: "Medium", date: "2026-06-23" },
  { id: "H48", stage: "group", group: "H", matchday: 3, homeTeam: "Cape Verde", awayTeam: "Saudi Arabia", homeScore: 0, awayScore: 0, probHomeWin: 30.5, probDraw: 40.2, probAwayWin: 29.3, confidence: "Low", date: "2026-06-23" },
  { id: "I49", stage: "group", group: "I", matchday: 1, homeTeam: "France", awayTeam: "Senegal", homeScore: 2, awayScore: 1, probHomeWin: 41.3, probDraw: 37.1, probAwayWin: 21.6, confidence: "Low", date: "2026-06-15" },
  { id: "I50", stage: "group", group: "I", matchday: 1, homeTeam: "Iraq", awayTeam: "Norway", homeScore: 1, awayScore: 2, probHomeWin: 17.3, probDraw: 35.3, probAwayWin: 47.4, confidence: "Medium", date: "2026-06-15" },
  { id: "I51", stage: "group", group: "I", matchday: 2, homeTeam: "France", awayTeam: "Iraq", homeScore: 2, awayScore: 1, probHomeWin: 54.0, probDraw: 31.4, probAwayWin: 14.5, confidence: "Medium", date: "2026-06-19" },
  { id: "I52", stage: "group", group: "I", matchday: 2, homeTeam: "Senegal", awayTeam: "Norway", homeScore: 1, awayScore: 1, probHomeWin: 37.1, probDraw: 40.7, probAwayWin: 22.2, confidence: "Low", date: "2026-06-19" },
  { id: "I53", stage: "group", group: "I", matchday: 3, homeTeam: "France", awayTeam: "Norway", homeScore: 2, awayScore: 1, probHomeWin: 51.2, probDraw: 33.1, probAwayWin: 15.7, confidence: "Medium", date: "2026-06-23" },
  { id: "I54", stage: "group", group: "I", matchday: 3, homeTeam: "Senegal", awayTeam: "Iraq", homeScore: 2, awayScore: 1, probHomeWin: 44.1, probDraw: 36.5, probAwayWin: 19.4, confidence: "Medium", date: "2026-06-23" },
  { id: "J55", stage: "group", group: "J", matchday: 1, homeTeam: "Argentina", awayTeam: "Algeria", homeScore: 2, awayScore: 1, probHomeWin: 57.0, probDraw: 29.6, probAwayWin: 13.4, confidence: "High", date: "2026-06-16" },
  { id: "J56", stage: "group", group: "J", matchday: 1, homeTeam: "Austria", awayTeam: "Jordan", homeScore: 2, awayScore: 1, probHomeWin: 43.0, probDraw: 34.5, probAwayWin: 22.5, confidence: "Medium", date: "2026-06-16" },
  { id: "J57", stage: "group", group: "J", matchday: 2, homeTeam: "Argentina", awayTeam: "Austria", homeScore: 2, awayScore: 1, probHomeWin: 51.4, probDraw: 33.0, probAwayWin: 15.6, confidence: "Medium", date: "2026-06-20" },
  { id: "J58", stage: "group", group: "J", matchday: 2, homeTeam: "Algeria", awayTeam: "Jordan", homeScore: 1, awayScore: 1, probHomeWin: 36.1, probDraw: 42.0, probAwayWin: 21.8, confidence: "Medium", date: "2026-06-20" },
  { id: "J59", stage: "group", group: "J", matchday: 3, homeTeam: "Argentina", awayTeam: "Jordan", homeScore: 2, awayScore: 0, probHomeWin: 56.7, probDraw: 29.7, probAwayWin: 13.6, confidence: "High", date: "2026-06-24" },
  { id: "J60", stage: "group", group: "J", matchday: 3, homeTeam: "Algeria", awayTeam: "Austria", homeScore: 1, awayScore: 2, probHomeWin: 23.9, probDraw: 37.0, probAwayWin: 39.2, confidence: "Low", date: "2026-06-24" },
  { id: "K61", stage: "group", group: "K", matchday: 1, homeTeam: "Portugal", awayTeam: "Jamaica", homeScore: 1, awayScore: 0, probHomeWin: 46.2, probDraw: 37.9, probAwayWin: 16.0, confidence: "Medium", date: "2026-06-16" },
  { id: "K62", stage: "group", group: "K", matchday: 1, homeTeam: "Uzbekistan", awayTeam: "Colombia", homeScore: 1, awayScore: 2, probHomeWin: 17.3, probDraw: 31.5, probAwayWin: 51.2, confidence: "Medium", date: "2026-06-16" },
  { id: "K63", stage: "group", group: "K", matchday: 2, homeTeam: "Portugal", awayTeam: "Uzbekistan", homeScore: 2, awayScore: 1, probHomeWin: 47.7, probDraw: 36.5, probAwayWin: 15.8, confidence: "Medium", date: "2026-06-20" },
  { id: "K64", stage: "group", group: "K", matchday: 2, homeTeam: "Jamaica", awayTeam: "Colombia", homeScore: 0, awayScore: 1, probHomeWin: 17.2, probDraw: 32.2, probAwayWin: 50.6, confidence: "Medium", date: "2026-06-20" },
  { id: "K65", stage: "group", group: "K", matchday: 3, homeTeam: "Portugal", awayTeam: "Colombia", homeScore: 1, awayScore: 1, probHomeWin: 35.2, probDraw: 37.3, probAwayWin: 27.4, confidence: "Low", date: "2026-06-24" },
  { id: "K66", stage: "group", group: "K", matchday: 3, homeTeam: "Jamaica", awayTeam: "Uzbekistan", homeScore: 0, awayScore: 0, probHomeWin: 34.4, probDraw: 39.6, probAwayWin: 26.0, confidence: "Low", date: "2026-06-24" },
  { id: "L67", stage: "group", group: "L", matchday: 1, homeTeam: "England", awayTeam: "Croatia", homeScore: 2, awayScore: 1, probHomeWin: 40.2, probDraw: 31.9, probAwayWin: 27.9, confidence: "Low", date: "2026-06-17" },
  { id: "L68", stage: "group", group: "L", matchday: 1, homeTeam: "Ghana", awayTeam: "Panama", homeScore: 0, awayScore: 0, probHomeWin: 24.9, probDraw: 38.5, probAwayWin: 36.6, confidence: "Low", date: "2026-06-17" },
  { id: "L69", stage: "group", group: "L", matchday: 2, homeTeam: "England", awayTeam: "Ghana", homeScore: 2, awayScore: 0, probHomeWin: 49.7, probDraw: 37.8, probAwayWin: 12.4, confidence: "Medium", date: "2026-06-21" },
  { id: "L70", stage: "group", group: "L", matchday: 2, homeTeam: "Croatia", awayTeam: "Panama", homeScore: 2, awayScore: 1, probHomeWin: 46.2, probDraw: 35.2, probAwayWin: 18.6, confidence: "Medium", date: "2026-06-21" },
  { id: "L71", stage: "group", group: "L", matchday: 3, homeTeam: "England", awayTeam: "Panama", homeScore: 1, awayScore: 0, probHomeWin: 53.1, probDraw: 31.6, probAwayWin: 15.4, confidence: "Medium", date: "2026-06-25" },
  { id: "L72", stage: "group", group: "L", matchday: 3, homeTeam: "Croatia", awayTeam: "Ghana", homeScore: 2, awayScore: 1, probHomeWin: 55.4, probDraw: 31.0, probAwayWin: 13.5, confidence: "High", date: "2026-06-25" },
];

export const GROUP_STANDINGS: Record<string, Standing[]> = {
  A: [
    { team: "Mexico", W: 3, D: 0, L: 0, GF: 4, GA: 1, GD: 3, Pts: 9 },
    { team: "Denmark", W: 1, D: 1, L: 1, GF: 4, GA: 4, GD: 0, Pts: 4 },
    { team: "South Korea", W: 1, D: 1, L: 1, GF: 3, GA: 3, GD: 0, Pts: 4 },
    { team: "South Africa", W: 0, D: 0, L: 3, GF: 2, GA: 5, GD: -3, Pts: 0 },
  ],
  B: [
    { team: "Italy", W: 2, D: 1, L: 0, GF: 3, GA: 1, GD: 2, Pts: 7 },
    { team: "Switzerland", W: 1, D: 2, L: 0, GF: 4, GA: 3, GD: 1, Pts: 5 },
    { team: "Canada", W: 1, D: 1, L: 1, GF: 2, GA: 2, GD: 0, Pts: 4 },
    { team: "Qatar", W: 0, D: 0, L: 3, GF: 1, GA: 4, GD: -3, Pts: 0 },
  ],
  C: [
    { team: "Brazil", W: 2, D: 1, L: 0, GF: 5, GA: 3, GD: 2, Pts: 7 },
    { team: "Morocco", W: 2, D: 1, L: 0, GF: 4, GA: 2, GD: 2, Pts: 7 },
    { team: "Scotland", W: 1, D: 0, L: 2, GF: 4, GA: 5, GD: -1, Pts: 3 },
    { team: "Haiti", W: 0, D: 0, L: 3, GF: 2, GA: 5, GD: -3, Pts: 0 },
  ],
  D: [
    { team: "United States", W: 2, D: 1, L: 0, GF: 5, GA: 3, GD: 2, Pts: 7 },
    { team: "Turkey", W: 2, D: 1, L: 0, GF: 4, GA: 2, GD: 2, Pts: 7 },
    { team: "Australia", W: 1, D: 0, L: 2, GF: 4, GA: 5, GD: -1, Pts: 3 },
    { team: "Paraguay", W: 0, D: 0, L: 3, GF: 2, GA: 5, GD: -3, Pts: 0 },
  ],
  E: [
    { team: "Germany", W: 3, D: 0, L: 0, GF: 5, GA: 2, GD: 3, Pts: 9 },
    { team: "Ecuador", W: 2, D: 0, L: 1, GF: 4, GA: 3, GD: 1, Pts: 6 },
    { team: "C\u00f4te d'Ivoire", W: 1, D: 0, L: 2, GF: 4, GA: 5, GD: -1, Pts: 3 },
    { team: "Cura\u00e7ao", W: 0, D: 0, L: 3, GF: 3, GA: 6, GD: -3, Pts: 0 },
  ],
  F: [
    { team: "Netherlands", W: 3, D: 0, L: 0, GF: 5, GA: 1, GD: 4, Pts: 9 },
    { team: "Japan", W: 1, D: 1, L: 1, GF: 2, GA: 2, GD: 0, Pts: 4 },
    { team: "Ukraine", W: 0, D: 2, L: 1, GF: 1, GA: 3, GD: -2, Pts: 2 },
    { team: "Tunisia", W: 0, D: 1, L: 2, GF: 1, GA: 3, GD: -2, Pts: 1 },
  ],
  G: [
    { team: "Belgium", W: 3, D: 0, L: 0, GF: 6, GA: 3, GD: 3, Pts: 9 },
    { team: "IR Iran", W: 2, D: 0, L: 1, GF: 3, GA: 2, GD: 1, Pts: 6 },
    { team: "Egypt", W: 1, D: 0, L: 2, GF: 2, GA: 3, GD: -1, Pts: 3 },
    { team: "New Zealand", W: 0, D: 0, L: 3, GF: 1, GA: 4, GD: -3, Pts: 0 },
  ],
  H: [
    { team: "Spain", W: 3, D: 0, L: 0, GF: 5, GA: 0, GD: 5, Pts: 9 },
    { team: "Uruguay", W: 2, D: 0, L: 1, GF: 4, GA: 4, GD: 0, Pts: 6 },
    { team: "Cape Verde", W: 0, D: 1, L: 2, GF: 1, GA: 3, GD: -2, Pts: 1 },
    { team: "Saudi Arabia", W: 0, D: 1, L: 2, GF: 1, GA: 4, GD: -3, Pts: 1 },
  ],
  I: [
    { team: "France", W: 3, D: 0, L: 0, GF: 6, GA: 3, GD: 3, Pts: 9 },
    { team: "Senegal", W: 1, D: 1, L: 1, GF: 4, GA: 4, GD: 0, Pts: 4 },
    { team: "Norway", W: 1, D: 1, L: 1, GF: 4, GA: 4, GD: 0, Pts: 4 },
    { team: "Iraq", W: 0, D: 0, L: 3, GF: 3, GA: 6, GD: -3, Pts: 0 },
  ],
  J: [
    { team: "Argentina", W: 3, D: 0, L: 0, GF: 6, GA: 2, GD: 4, Pts: 9 },
    { team: "Austria", W: 2, D: 0, L: 1, GF: 5, GA: 4, GD: 1, Pts: 6 },
    { team: "Algeria", W: 0, D: 1, L: 2, GF: 3, GA: 5, GD: -2, Pts: 1 },
    { team: "Jordan", W: 0, D: 1, L: 2, GF: 2, GA: 5, GD: -3, Pts: 1 },
  ],
  K: [
    { team: "Portugal", W: 2, D: 1, L: 0, GF: 4, GA: 2, GD: 2, Pts: 7 },
    { team: "Colombia", W: 2, D: 1, L: 0, GF: 4, GA: 2, GD: 2, Pts: 7 },
    { team: "Uzbekistan", W: 0, D: 1, L: 2, GF: 2, GA: 4, GD: -2, Pts: 1 },
    { team: "Jamaica", W: 0, D: 1, L: 2, GF: 0, GA: 2, GD: -2, Pts: 1 },
  ],
  L: [
    { team: "England", W: 3, D: 0, L: 0, GF: 5, GA: 1, GD: 4, Pts: 9 },
    { team: "Croatia", W: 2, D: 0, L: 1, GF: 5, GA: 4, GD: 1, Pts: 6 },
    { team: "Panama", W: 0, D: 1, L: 2, GF: 1, GA: 3, GD: -2, Pts: 1 },
    { team: "Ghana", W: 0, D: 1, L: 2, GF: 1, GA: 4, GD: -3, Pts: 1 },
  ],
};

export const KNOCKOUT_MATCHES: Match[] = [
  { id: "ko1", stage: "r32", homeTeam: "Mexico", awayTeam: "Switzerland", homeScore: 1, awayScore: 2, winner: "Switzerland", probHomeWin: 26.4, probDraw: 35.8, probAwayWin: 37.8, confidence: "Low" },
  { id: "ko2", stage: "r32", homeTeam: "Italy", awayTeam: "Denmark", homeScore: 2, awayScore: 1, winner: "Italy", probHomeWin: 40.6, probDraw: 31.2, probAwayWin: 28.2, confidence: "Low" },
  { id: "ko3", stage: "r32", homeTeam: "Brazil", awayTeam: "Turkey", homeScore: 2, awayScore: 1, winner: "Brazil", probHomeWin: 49.2, probDraw: 30.6, probAwayWin: 20.2, confidence: "Medium" },
  { id: "ko4", stage: "r32", homeTeam: "United States", awayTeam: "Morocco", homeScore: 1, awayScore: 2, winner: "Morocco", probHomeWin: 17.2, probDraw: 33.8, probAwayWin: 49.0, confidence: "Medium" },
  { id: "ko5", stage: "r32", homeTeam: "Germany", awayTeam: "Japan", homeScore: 1, awayScore: 1, winner: "Germany", probHomeWin: 32.5, probDraw: 36.8, probAwayWin: 30.7, confidence: "Low" },
  { id: "ko6", stage: "r32", homeTeam: "Netherlands", awayTeam: "Ecuador", homeScore: 1, awayScore: 0, winner: "Netherlands", probHomeWin: 45.1, probDraw: 38.5, probAwayWin: 16.3, confidence: "Medium" },
  { id: "ko7", stage: "r32", homeTeam: "Belgium", awayTeam: "Uruguay", homeScore: 1, awayScore: 1, winner: "Belgium", probHomeWin: 37.1, probDraw: 42.1, probAwayWin: 20.8, confidence: "Medium" },
  { id: "ko8", stage: "r32", homeTeam: "Spain", awayTeam: "IR Iran", homeScore: 2, awayScore: 1, winner: "Spain", probHomeWin: 43.3, probDraw: 40.2, probAwayWin: 16.5, confidence: "Medium" },
  { id: "ko9", stage: "r32", homeTeam: "France", awayTeam: "Austria", homeScore: 2, awayScore: 1, winner: "France", probHomeWin: 57.3, probDraw: 27.4, probAwayWin: 15.3, confidence: "High" },
  { id: "ko10", stage: "r32", homeTeam: "Argentina", awayTeam: "Senegal", homeScore: 2, awayScore: 0, winner: "Argentina", probHomeWin: 48.3, probDraw: 32.2, probAwayWin: 19.4, confidence: "Medium" },
  { id: "ko11", stage: "r32", homeTeam: "Portugal", awayTeam: "Croatia", homeScore: 2, awayScore: 1, winner: "Portugal", probHomeWin: 34.4, probDraw: 33.4, probAwayWin: 32.3, confidence: "Low" },
  { id: "ko12", stage: "r32", homeTeam: "England", awayTeam: "Colombia", homeScore: 1, awayScore: 0, winner: "England", probHomeWin: 42.6, probDraw: 32.6, probAwayWin: 24.8, confidence: "Medium" },
  { id: "ko13", stage: "r32", homeTeam: "Norway", awayTeam: "South Korea", homeScore: 1, awayScore: 2, winner: "South Korea", probHomeWin: 24.6, probDraw: 33.7, probAwayWin: 41.7, confidence: "Low" },
  { id: "ko14", stage: "r32", homeTeam: "Canada", awayTeam: "Scotland", homeScore: 1, awayScore: 1, winner: "Canada", probHomeWin: 36.8, probDraw: 40.0, probAwayWin: 23.2, confidence: "Low" },
  { id: "ko15", stage: "r32", homeTeam: "Australia", awayTeam: "C\u00f4te d'Ivoire", homeScore: 1, awayScore: 1, winner: "Australia", probHomeWin: 32.8, probDraw: 39.6, probAwayWin: 27.6, confidence: "Low" },
  { id: "ko16", stage: "r32", homeTeam: "Egypt", awayTeam: "Ukraine", homeScore: 0, awayScore: 0, winner: "Ukraine", probHomeWin: 27.5, probDraw: 38.2, probAwayWin: 34.3, confidence: "Low" },
  { id: "ko17", stage: "r16", homeTeam: "Switzerland", awayTeam: "Italy", homeScore: 1, awayScore: 2, winner: "Italy", probHomeWin: 19.4, probDraw: 34.4, probAwayWin: 46.2, confidence: "Medium" },
  { id: "ko18", stage: "r16", homeTeam: "Brazil", awayTeam: "Morocco", homeScore: 1, awayScore: 1, winner: "Morocco", probHomeWin: 30.6, probDraw: 37.5, probAwayWin: 31.9, confidence: "Low" },
  { id: "ko19", stage: "r16", homeTeam: "Germany", awayTeam: "Netherlands", homeScore: 1, awayScore: 1, winner: "Netherlands", probHomeWin: 24.1, probDraw: 39.0, probAwayWin: 36.8, confidence: "Low" },
  { id: "ko20", stage: "r16", homeTeam: "Belgium", awayTeam: "Spain", homeScore: 2, awayScore: 3, winner: "Spain", probHomeWin: 17.0, probDraw: 31.8, probAwayWin: 51.3, confidence: "Medium" },
  { id: "ko21", stage: "r16", homeTeam: "France", awayTeam: "Argentina", homeScore: 1, awayScore: 2, winner: "Argentina", probHomeWin: 26.0, probDraw: 36.8, probAwayWin: 37.2, confidence: "Low" },
  { id: "ko22", stage: "r16", homeTeam: "Portugal", awayTeam: "England", homeScore: 1, awayScore: 2, winner: "England", probHomeWin: 24.9, probDraw: 35.4, probAwayWin: 39.8, confidence: "Low" },
  { id: "ko23", stage: "r16", homeTeam: "South Korea", awayTeam: "Canada", homeScore: 0, awayScore: 1, winner: "Canada", probHomeWin: 24.9, probDraw: 33.3, probAwayWin: 41.8, confidence: "Low" },
  { id: "ko24", stage: "r16", homeTeam: "Australia", awayTeam: "Ukraine", homeScore: 1, awayScore: 2, winner: "Ukraine", probHomeWin: 28.7, probDraw: 35.3, probAwayWin: 36.0, confidence: "Low" },
  { id: "ko25", stage: "qf", homeTeam: "Italy", awayTeam: "Morocco", homeScore: 1, awayScore: 2, winner: "Morocco", probHomeWin: 24.6, probDraw: 34.9, probAwayWin: 40.5, confidence: "Low" },
  { id: "ko26", stage: "qf", homeTeam: "Netherlands", awayTeam: "Spain", homeScore: 1, awayScore: 1, winner: "Spain", probHomeWin: 24.8, probDraw: 39.6, probAwayWin: 35.5, confidence: "Low" },
  { id: "ko27", stage: "qf", homeTeam: "Argentina", awayTeam: "England", homeScore: 1, awayScore: 1, winner: "England", probHomeWin: 29.4, probDraw: 39.6, probAwayWin: 31.0, confidence: "Low" },
  { id: "ko28", stage: "qf", homeTeam: "Canada", awayTeam: "Ukraine", homeScore: 1, awayScore: 0, winner: "Canada", probHomeWin: 39.5, probDraw: 35.0, probAwayWin: 25.6, confidence: "Low" },
  { id: "ko29", stage: "sf", homeTeam: "Morocco", awayTeam: "Spain", homeScore: 1, awayScore: 2, winner: "Spain", probHomeWin: 19.4, probDraw: 35.1, probAwayWin: 45.4, confidence: "Medium" },
  { id: "ko30", stage: "sf", homeTeam: "England", awayTeam: "Canada", homeScore: 1, awayScore: 0, winner: "England", probHomeWin: 45.6, probDraw: 36.8, probAwayWin: 17.5, confidence: "Medium" },
  { id: "ko31", stage: "3rd", homeTeam: "Morocco", awayTeam: "Canada", homeScore: 0, awayScore: 0, winner: "Morocco", probHomeWin: 38.8, probDraw: 42.1, probAwayWin: 19.1, confidence: "Medium" },
  { id: "ko32", stage: "final", homeTeam: "Spain", awayTeam: "England", homeScore: 1, awayScore: 1, winner: "Spain", probHomeWin: 33.2, probDraw: 36.8, probAwayWin: 30.0, confidence: "Low" },
];

export const CHAMPION = "Spain";

export function getTeam(name: string): Team | undefined {
  return TEAMS.find(t => t.name === name);
}

export function flagUrl(code: string, size: number = 40): string {
  return `https://flagcdn.com/w${size}/${code}.png`;
}

export function getPredictedWinner(match: Match): string | undefined {
  if (match.winner) return match.winner;
  if (match.homeScore > match.awayScore) return match.homeTeam;
  if (match.awayScore > match.homeScore) return match.awayTeam;
  return undefined;
}

export function getConfidenceLabel(c: string | number): { color: string; label: string } {
  const label = typeof c === 'number'
    ? (c >= 55 ? 'High' : c >= 42 ? 'Medium' : 'Low')
    : c;
  if (label === 'High')   return { color: 'text-green-400 border-green-500/30 bg-green-500/10', label: 'High' };
  if (label === 'Medium') return { color: 'text-gold border-gold/30 bg-gold/10', label: 'Medium' };
  return { color: 'text-slate-400 border-slate-500/30 bg-slate-500/10', label: 'Low' };
}