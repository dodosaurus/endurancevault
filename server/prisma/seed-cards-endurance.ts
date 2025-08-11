import { PrismaClient, CardRarity } from '@prisma/client'

const prisma = new PrismaClient()

interface CardData {
  name: string
  sport: string
  rarity: CardRarity
  description: string
  nationality: string
  birthYear: number
  imageUrl: string
  baseScore: number
}

const cardData: CardData[] = [
  // LEGENDARY (1 card) - Ultimate endurance GOAT
  {
    name: "Eliud Kipchoge",
    sport: "Marathon",
    rarity: CardRarity.LEGENDARY,
    description: "Marathon GOAT - 2:01:09 WR, 2x Olympic champion, first sub-2 hour",
    nationality: "Kenya", 
    birthYear: 1984,
    imageUrl: "https://via.placeholder.com/300x400/FFA500/FFFFFF?text=Eliud+Kipchoge",
    baseScore: 1000
  },

  // EPIC (4 cards) - Endurance Legends
  {
    name: "Eddy Merckx",
    sport: "Cycling",
    rarity: CardRarity.EPIC,
    description: "The Cannibal - 5x Tour de France, 525 wins, greatest cyclist ever",
    nationality: "Belgium",
    birthYear: 1945,
    imageUrl: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Eddy+Merckx",
    baseScore: 500
  },
  {
    name: "Kilian Jornet",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.EPIC,
    description: "UTMB 3x winner, speed ascents of Everest, ultra trail GOAT",
    nationality: "Spain",
    birthYear: 1987,
    imageUrl: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Kilian+Jornet",
    baseScore: 500
  },
  {
    name: "Emil Zátopek",
    sport: "Distance Running",
    rarity: CardRarity.EPIC,
    description: "The Locomotive - triple Olympic gold 1952, revolutionary training",
    nationality: "Czechoslovakia",
    birthYear: 1922,
    imageUrl: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Emil+Zatopek",
    baseScore: 500
  },
  {
    name: "Haile Gebrselassie",
    sport: "Marathon",
    rarity: CardRarity.EPIC,
    description: "Ethiopian legend - 27 world records, 2x Olympic 10k champion",
    nationality: "Ethiopia",
    birthYear: 1973,
    imageUrl: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Haile+Gebrselassie",
    baseScore: 500
  },

  // RARE (15 cards) - Hall of Famers & Record Holders
  // Cycling Legends (5)
  {
    name: "Bernard Hinault",
    sport: "Cycling",
    rarity: CardRarity.RARE,
    description: "The Badger - 5x Tour de France, last French winner",
    nationality: "France",
    birthYear: 1954,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Bernard+Hinault",
    baseScore: 100
  },
  {
    name: "Miguel Indurain",
    sport: "Cycling",
    rarity: CardRarity.RARE,
    description: "Big Mig - 5 consecutive Tours, time trial master",
    nationality: "Spain",
    birthYear: 1964,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Miguel+Indurain",
    baseScore: 100
  },
  {
    name: "Fausto Coppi",
    sport: "Cycling",
    rarity: CardRarity.RARE,
    description: "Il Campionissimo - 2x Tour, 5x Giro, Hour Record pioneer",
    nationality: "Italy",
    birthYear: 1919,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Fausto+Coppi",
    baseScore: 100
  },
  {
    name: "Greg LeMond",
    sport: "Cycling",
    rarity: CardRarity.RARE,
    description: "3x Tour winner, first American Tour champion",
    nationality: "USA",
    birthYear: 1961,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Greg+LeMond",
    baseScore: 100
  },
  {
    name: "Marianne Vos",
    sport: "Cycling",
    rarity: CardRarity.RARE,
    description: "3x World Champion, Olympic gold, cyclocross queen",
    nationality: "Netherlands",
    birthYear: 1987,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Marianne+Vos",
    baseScore: 100
  },

  // Marathon/Road Running Legends (5)
  {
    name: "Abebe Bikila",
    sport: "Marathon",
    rarity: CardRarity.RARE,
    description: "First African Olympic champion, won Rome marathon barefoot",
    nationality: "Ethiopia",
    birthYear: 1932,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Abebe+Bikila",
    baseScore: 100
  },
  {
    name: "Paula Radcliffe",
    sport: "Marathon",
    rarity: CardRarity.RARE,
    description: "Women's marathon WR 2:15:25, dominated distance running",
    nationality: "UK",
    birthYear: 1973,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Paula+Radcliffe",
    baseScore: 100
  },
  {
    name: "Grete Waitz",
    sport: "Marathon",
    rarity: CardRarity.RARE,
    description: "9x NYC Marathon winner, marathon pioneer for women",
    nationality: "Norway",
    birthYear: 1953,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Grete+Waitz",
    baseScore: 100
  },
  {
    name: "Frank Shorter",
    sport: "Marathon",
    rarity: CardRarity.RARE,
    description: "1972 Olympic champion, sparked US running boom",
    nationality: "USA",
    birthYear: 1947,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Frank+Shorter",
    baseScore: 100
  },
  {
    name: "Khalid Khannouchi",
    sport: "Marathon",
    rarity: CardRarity.RARE,
    description: "First sub-2:06 marathon, former world record holder",
    nationality: "Morocco/USA",
    birthYear: 1971,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Khalid+Khannouchi",
    baseScore: 100
  },

  // Trail/Ultra Running Legends (5)
  {
    name: "Ann Trason",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.RARE,
    description: "Ultra running legend, 14x Western States wins",
    nationality: "USA",
    birthYear: 1960,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Ann+Trason",
    baseScore: 100
  },
  {
    name: "Scott Jurek",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.RARE,
    description: "7x Western States champion, Appalachian Trail FKT",
    nationality: "USA",
    birthYear: 1973,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Scott+Jurek",
    baseScore: 100
  },
  {
    name: "Lizzy Hawker",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.RARE,
    description: "5x UTMB winner, 100k world record holder",
    nationality: "UK",
    birthYear: 1973,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Lizzy+Hawker",
    baseScore: 100
  },
  {
    name: "Yiannis Kouros",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.RARE,
    description: "Ultra distance legend, multiple world records",
    nationality: "Greece",
    birthYear: 1956,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Yiannis+Kouros",
    baseScore: 100
  },
  {
    name: "Dean Karnazes",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.RARE,
    description: "Ultra marathon icon, 50 marathons in 50 states",
    nationality: "USA",
    birthYear: 1962,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Dean+Karnazes",
    baseScore: 100
  },

  // UNCOMMON (30 cards) - Notable Champions
  // Cycling Champions (10)
  {
    name: "Tadej Pogačar",
    sport: "Cycling",
    rarity: CardRarity.UNCOMMON,
    description: "2x Tour de France winner, climbing specialist",
    nationality: "Slovenia",
    birthYear: 1998,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Tadej+Pogacar",
    baseScore: 25
  },
  {
    name: "Peter Sagan",
    sport: "Cycling",
    rarity: CardRarity.UNCOMMON,
    description: "3x World Champion, 7x Tour green jersey",
    nationality: "Slovakia",
    birthYear: 1990,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Peter+Sagan",
    baseScore: 25
  },
  {
    name: "Mark Cavendish",
    sport: "Cycling",
    rarity: CardRarity.UNCOMMON,
    description: "Manx Missile - 34 Tour stage wins, sprint legend",
    nationality: "UK",
    birthYear: 1985,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Mark+Cavendish",
    baseScore: 25
  },
  {
    name: "Chris Froome",
    sport: "Cycling",
    rarity: CardRarity.UNCOMMON,
    description: "4x Tour de France champion, climbing TT master",
    nationality: "UK",
    birthYear: 1985,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Chris+Froome",
    baseScore: 25
  },
  {
    name: "Alberto Contador",
    sport: "Cycling",
    rarity: CardRarity.UNCOMMON,
    description: "2x Tour winner, explosive climber",
    nationality: "Spain",
    birthYear: 1982,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Alberto+Contador",
    baseScore: 25
  },
  {
    name: "Marco Pantani",
    sport: "Cycling",
    rarity: CardRarity.UNCOMMON,
    description: "The Pirate - Tour/Giro double winner, climbing legend",
    nationality: "Italy",
    birthYear: 1970,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Marco+Pantani",
    baseScore: 25
  },
  {
    name: "Jan Ullrich",
    sport: "Cycling",
    rarity: CardRarity.UNCOMMON,
    description: "1997 Tour winner, time trial powerhouse",
    nationality: "Germany",
    birthYear: 1973,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Jan+Ullrich",
    baseScore: 25
  },
  {
    name: "Fabian Cancellara",
    sport: "Cycling",
    rarity: CardRarity.UNCOMMON,
    description: "Spartacus - 2x Olympic TT champion, classics specialist",
    nationality: "Switzerland",
    birthYear: 1981,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Fabian+Cancellara",
    baseScore: 25
  },
  {
    name: "Tom Boonen",
    sport: "Cycling",
    rarity: CardRarity.UNCOMMON,
    description: "Tornado Tom - 4x Paris-Roubaix winner",
    nationality: "Belgium",
    birthYear: 1980,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Tom+Boonen",
    baseScore: 25
  },
  {
    name: "Annemiek van Vleuten",
    sport: "Cycling",
    rarity: CardRarity.UNCOMMON,
    description: "Multiple World Champion, Olympic road race winner",
    nationality: "Netherlands",
    birthYear: 1982,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Annemiek+van+Vleuten",
    baseScore: 25
  },

  // Road Running Champions (10)
  {
    name: "Kelvin Kiptum",
    sport: "Marathon",
    rarity: CardRarity.UNCOMMON,
    description: "Marathon WR 2:01:09, Chicago Marathon champion",
    nationality: "Kenya",
    birthYear: 1999,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Kelvin+Kiptum",
    baseScore: 25
  },
  {
    name: "Brigid Kosgei",
    sport: "Marathon",
    rarity: CardRarity.UNCOMMON,
    description: "Women's marathon WR 2:14:04, Chicago winner",
    nationality: "Kenya",
    birthYear: 1994,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Brigid+Kosgei",
    baseScore: 25
  },
  {
    name: "Mo Farah",
    sport: "Distance Running",
    rarity: CardRarity.UNCOMMON,
    description: "4x Olympic gold in 5000m and 10000m",
    nationality: "UK",
    birthYear: 1983,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Mo+Farah",
    baseScore: 25
  },
  {
    name: "Kenenisa Bekele",
    sport: "Distance Running",
    rarity: CardRarity.UNCOMMON,
    description: "3x Olympic champion, 5k/10k world record holder",
    nationality: "Ethiopia",
    birthYear: 1982,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Kenenisa+Bekele",
    baseScore: 25
  },
  {
    name: "Wilson Kipsang",
    sport: "Marathon",
    rarity: CardRarity.UNCOMMON,
    description: "Former marathon WR holder, Berlin champion",
    nationality: "Kenya",
    birthYear: 1982,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Wilson+Kipsang",
    baseScore: 25
  },
  {
    name: "Dennis Kimetto",
    sport: "Marathon",
    rarity: CardRarity.UNCOMMON,
    description: "Former marathon WR 2:02:57, Berlin winner",
    nationality: "Kenya",
    birthYear: 1984,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Dennis+Kimetto",
    baseScore: 25
  },
  {
    name: "Catherine Ndereba",
    sport: "Marathon",
    rarity: CardRarity.UNCOMMON,
    description: "Catherine the Great - 2x World champion, Boston legend",
    nationality: "Kenya",
    birthYear: 1972,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Catherine+Ndereba",
    baseScore: 25
  },
  {
    name: "Tirunesh Dibaba",
    sport: "Distance Running",
    rarity: CardRarity.UNCOMMON,
    description: "3x Olympic champion, 5k/10k world record holder",
    nationality: "Ethiopia",
    birthYear: 1985,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Tirunesh+Dibaba",
    baseScore: 25
  },
  {
    name: "Meseret Defar",
    sport: "Distance Running",
    rarity: CardRarity.UNCOMMON,
    description: "2x Olympic 5000m champion, world record holder",
    nationality: "Ethiopia",
    birthYear: 1987,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Meseret+Defar",
    baseScore: 25
  },
  {
    name: "Geoffrey Mutai",
    sport: "Marathon",
    rarity: CardRarity.UNCOMMON,
    description: "Boston Marathon course record 2:03:02",
    nationality: "Kenya",
    birthYear: 1981,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Geoffrey+Mutai",
    baseScore: 25
  },

  // Trail/Ultra Champions (10)
  {
    name: "François D'Haene",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.UNCOMMON,
    description: "3x UTMB winner, French trail running star",
    nationality: "France",
    birthYear: 1985,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Francois+DHaene",
    baseScore: 25
  },
  {
    name: "Jim Walmsley",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.UNCOMMON,
    description: "100k world record holder, Western States champion",
    nationality: "USA",
    birthYear: 1990,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Jim+Walmsley",
    baseScore: 25
  },
  {
    name: "Courtney Dauwalter",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.UNCOMMON,
    description: "UTMB winner, ultra distance phenomenon",
    nationality: "USA",
    birthYear: 1985,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Courtney+Dauwalter",
    baseScore: 25
  },
  {
    name: "Xavier Thévenard",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.UNCOMMON,
    description: "3x UTMB winner, French mountain runner",
    nationality: "France",
    birthYear: 1988,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Xavier+Thevenard",
    baseScore: 25
  },
  {
    name: "Caroline Chaverot",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.UNCOMMON,
    description: "UTMB winner, French trail champion",
    nationality: "France",
    birthYear: 1981,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Caroline+Chaverot",
    baseScore: 25
  },
  {
    name: "Timothy Olson",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.UNCOMMON,
    description: "2x Western States champion, trail runner",
    nationality: "USA",
    birthYear: 1982,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Timothy+Olson",
    baseScore: 25
  },
  {
    name: "Rory Bosio",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.UNCOMMON,
    description: "UTMB course record holder, trail legend",
    nationality: "USA",
    birthYear: 1982,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Rory+Bosio",
    baseScore: 25
  },
  {
    name: "Nuria Picas",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.UNCOMMON,
    description: "Ultra-Trail World Tour champion",
    nationality: "Spain",
    birthYear: 1981,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Nuria+Picas",
    baseScore: 25
  },
  {
    name: "Ryan Sandes",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.UNCOMMON,
    description: "4 Deserts Grand Slam winner, South African ultra runner",
    nationality: "South Africa",
    birthYear: 1982,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Ryan+Sandes",
    baseScore: 25
  },
  {
    name: "Ellie Greenwood",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.UNCOMMON,
    description: "2x Comrades Marathon winner, ultra champion",
    nationality: "Canada/UK",
    birthYear: 1976,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Ellie+Greenwood",
    baseScore: 25
  },

  // COMMON (50 cards) - Strong athletes across disciplines
  // Cycling Athletes (17)
  {
    name: "Jonas Vingegaard",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "2x Tour de France winner, climbing specialist",
    nationality: "Denmark",
    birthYear: 1996,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Jonas+Vingegaard",
    baseScore: 5
  },
  {
    name: "Primož Roglič",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "3x Vuelta winner, former ski jumper",
    nationality: "Slovenia",
    birthYear: 1989,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Primoz+Roglic",
    baseScore: 5
  },
  {
    name: "Egan Bernal",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "Tour de France winner, Colombian climber",
    nationality: "Colombia",
    birthYear: 1997,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Egan+Bernal",
    baseScore: 5
  },
  {
    name: "Remco Evenepoel",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "Vuelta winner, world champion, time trial specialist",
    nationality: "Belgium",
    birthYear: 2000,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Remco+Evenepoel",
    baseScore: 5
  },
  {
    name: "Geraint Thomas",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "Tour de France winner, Welsh road captain",
    nationality: "UK",
    birthYear: 1986,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Geraint+Thomas",
    baseScore: 5
  },
  {
    name: "Julian Alaphilippe",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "2x World Champion, punchy classics rider",
    nationality: "France",
    birthYear: 1992,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Julian+Alaphilippe",
    baseScore: 5
  },
  {
    name: "Mathieu van der Poel",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "World Champion, cyclocross and road specialist",
    nationality: "Netherlands",
    birthYear: 1995,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Mathieu+van+der+Poel",
    baseScore: 5
  },
  {
    name: "Wout van Aert",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "Belgian all-rounder, sprinter and classics rider",
    nationality: "Belgium",
    birthYear: 1994,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Wout+van+Aert",
    baseScore: 5
  },
  {
    name: "Nairo Quintana",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "Giro/Vuelta winner, Colombian climber",
    nationality: "Colombia",
    birthYear: 1990,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Nairo+Quintana",
    baseScore: 5
  },
  {
    name: "Vincenzo Nibali",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "The Shark - Tour winner, all Grand Tours completed",
    nationality: "Italy",
    birthYear: 1984,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Vincenzo+Nibali",
    baseScore: 5
  },
  {
    name: "Richard Carapaz",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "Giro winner, Olympic champion, Ecuadorian climber",
    nationality: "Ecuador",
    birthYear: 1993,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Richard+Carapaz",
    baseScore: 5
  },
  {
    name: "Simon Yates",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "Vuelta winner, British stage race specialist",
    nationality: "UK",
    birthYear: 1992,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Simon+Yates",
    baseScore: 5
  },
  {
    name: "Adam Yates",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "Tour stage winner, British climber",
    nationality: "UK",
    birthYear: 1992,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Adam+Yates",
    baseScore: 5
  },
  {
    name: "Filippo Ganna",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "Time trial world champion, track and road star",
    nationality: "Italy",
    birthYear: 1996,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Filippo+Ganna",
    baseScore: 5
  },
  {
    name: "Caleb Ewan",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "Australian sprint sensation, Tour stage winner",
    nationality: "Australia",
    birthYear: 1994,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Caleb+Ewan",
    baseScore: 5
  },
  {
    name: "Elisa Longo Borghini",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "Olympic bronze medalist, Italian road champion",
    nationality: "Italy",
    birthYear: 1991,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Elisa+Longo+Borghini",
    baseScore: 5
  },
  {
    name: "Demi Vollering",
    sport: "Cycling",
    rarity: CardRarity.COMMON,
    description: "Tour de France Femmes winner, Dutch champion",
    nationality: "Netherlands",
    birthYear: 1996,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Demi+Vollering",
    baseScore: 5
  },

  // Road Running Athletes (17)
  {
    name: "Kipchoge Keino",
    sport: "Distance Running",
    rarity: CardRarity.COMMON,
    description: "2x Olympic champion, Kenyan running pioneer",
    nationality: "Kenya",
    birthYear: 1940,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Kipchoge+Keino",
    baseScore: 5
  },
  {
    name: "Lasse Virén",
    sport: "Distance Running",
    rarity: CardRarity.COMMON,
    description: "4x Olympic gold in 5k/10k, Finnish legend",
    nationality: "Finland",
    birthYear: 1949,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Lasse+Viren",
    baseScore: 5
  },
  {
    name: "Alberto Salazar",
    sport: "Marathon",
    rarity: CardRarity.COMMON,
    description: "3x NYC Marathon winner, American distance legend",
    nationality: "USA",
    birthYear: 1958,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Alberto+Salazar",
    baseScore: 5
  },
  {
    name: "Joan Benoit Samuelson",
    sport: "Marathon",
    rarity: CardRarity.COMMON,
    description: "First women's Olympic marathon champion 1984",
    nationality: "USA",
    birthYear: 1957,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Joan+Benoit+Samuelson",
    baseScore: 5
  },
  {
    name: "Ingrid Kristiansen",
    sport: "Marathon",
    rarity: CardRarity.COMMON,
    description: "Former marathon WR holder, Norwegian champion",
    nationality: "Norway",
    birthYear: 1956,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Ingrid+Kristiansen",
    baseScore: 5
  },
  {
    name: "Bill Rodgers",
    sport: "Marathon",
    rarity: CardRarity.COMMON,
    description: "4x Boston/NYC Marathon winner, American legend",
    nationality: "USA",
    birthYear: 1947,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Bill+Rodgers",
    baseScore: 5
  },
  {
    name: "Shalane Flanagan",
    sport: "Marathon",
    rarity: CardRarity.COMMON,
    description: "NYC Marathon winner, Olympic medalist",
    nationality: "USA",
    birthYear: 1981,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Shalane+Flanagan",
    baseScore: 5
  },
  {
    name: "Ryan Hall",
    sport: "Marathon",
    rarity: CardRarity.COMMON,
    description: "American marathon record holder (2:04:58)",
    nationality: "USA",
    birthYear: 1982,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Ryan+Hall",
    baseScore: 5
  },
  {
    name: "Deena Kastor",
    sport: "Marathon",
    rarity: CardRarity.COMMON,
    description: "Olympic bronze medalist, American record holder",
    nationality: "USA",
    birthYear: 1973,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Deena+Kastor",
    baseScore: 5
  },
  {
    name: "Meb Keflezighi",
    sport: "Marathon",
    rarity: CardRarity.COMMON,
    description: "Boston/NYC Marathon winner, Olympic medalist",
    nationality: "USA",
    birthYear: 1975,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Meb+Keflezighi",
    baseScore: 5
  },
  {
    name: "Rupp Galen",
    sport: "Distance Running",
    rarity: CardRarity.COMMON,
    description: "Olympic medalist, American distance runner",
    nationality: "USA",
    birthYear: 1986,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Galen+Rupp",
    baseScore: 5
  },
  {
    name: "Molly Huddle",
    sport: "Distance Running",
    rarity: CardRarity.COMMON,
    description: "American 10k record holder, multiple championships",
    nationality: "USA",
    birthYear: 1984,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Molly+Huddle",
    baseScore: 5
  },
  {
    name: "Almaz Ayana",
    sport: "Distance Running",
    rarity: CardRarity.COMMON,
    description: "Olympic 10k champion, world record holder",
    nationality: "Ethiopia",
    birthYear: 1991,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Almaz+Ayana",
    baseScore: 5
  },
  {
    name: "Vivian Cheruiyot",
    sport: "Distance Running",
    rarity: CardRarity.COMMON,
    description: "Olympic champion, world championship medalist",
    nationality: "Kenya",
    birthYear: 1983,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Vivian+Cheruiyot",
    baseScore: 5
  },
  {
    name: "Sally Kipyego",
    sport: "Distance Running",
    rarity: CardRarity.COMMON,
    description: "Olympic medalist, world cross country champion",
    nationality: "Kenya",
    birthYear: 1985,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Sally+Kipyego",
    baseScore: 5
  },
  {
    name: "Mare Dibaba",
    sport: "Marathon",
    rarity: CardRarity.COMMON,
    description: "Boston Marathon winner, Ethiopian champion",
    nationality: "Ethiopia",
    birthYear: 1989,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Mare+Dibaba",
    baseScore: 5
  },
  {
    name: "Dathan Ritzenhein",
    sport: "Distance Running",
    rarity: CardRarity.COMMON,
    description: "American record holder, Olympic marathoner",
    nationality: "USA",
    birthYear: 1982,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Dathan+Ritzenhein",
    baseScore: 5
  },

  // Trail/Ultra Athletes (16)
  {
    name: "Zach Miller",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.COMMON,
    description: "The North Face Endurance Challenge champion",
    nationality: "USA",
    birthYear: 1986,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Zach+Miller",
    baseScore: 5
  },
  {
    name: "Dylan Bowman",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.COMMON,
    description: "TNF 50 champion, trail running advocate",
    nationality: "USA",
    birthYear: 1985,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Dylan+Bowman",
    baseScore: 5
  },
  {
    name: "Sage Canaday",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.COMMON,
    description: "Ultra trail champion, running coach",
    nationality: "USA",
    birthYear: 1985,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Sage+Canaday",
    baseScore: 5
  },
  {
    name: "Max King",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.COMMON,
    description: "Mountain running world champion",
    nationality: "USA",
    birthYear: 1978,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Max+King",
    baseScore: 5
  },
  {
    name: "Nikki Kimball",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.UNCOMMON,
    description: "Vermont 100 champion, ultra running pioneer",
    nationality: "USA",
    birthYear: 1971,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Nikki+Kimball",
    baseScore: 5
  },
  {
    name: "Devon Yanko",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.COMMON,
    description: "Western States champion, ultra specialist",
    nationality: "USA",
    birthYear: 1982,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Devon+Yanko",
    baseScore: 5
  },
  {
    name: "Magda Boulet",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.COMMON,
    description: "Western States champion, ultra runner",
    nationality: "USA",
    birthYear: 1973,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Magda+Boulet",
    baseScore: 5
  },
  {
    name: "Hal Koerner",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.COMMON,
    description: "2x Western States champion",
    nationality: "USA",
    birthYear: 1976,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Hal+Koerner",
    baseScore: 5
  },
  {
    name: "Rob Krar",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.COMMON,
    description: "Western States champion, ultra specialist",
    nationality: "Canada",
    birthYear: 1977,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Rob+Krar",
    baseScore: 5
  },
  {
    name: "Stephanie Howe",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.COMMON,
    description: "Ultra trail champion, sports scientist",
    nationality: "USA",
    birthYear: 1984,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Stephanie+Howe",
    baseScore: 5
  },
  {
    name: "Zach Bitter",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.COMMON,
    description: "100 mile world record holder",
    nationality: "USA",
    birthYear: 1987,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Zach+Bitter",
    baseScore: 5
  },
  {
    name: "Camille Herron",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.COMMON,
    description: "100k world record holder, ultra champion",
    nationality: "USA",
    birthYear: 1981,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Camille+Herron",
    baseScore: 5
  },
  {
    name: "Yuki Kawauchi",
    sport: "Marathon",
    rarity: CardRarity.COMMON,
    description: "Boston Marathon winner, citizen runner",
    nationality: "Japan",
    birthYear: 1987,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Yuki+Kawauchi",
    baseScore: 5
  },
  {
    name: "Hayden Hawks",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.COMMON,
    description: "Ultra trail champion, mountain runner",
    nationality: "USA",
    birthYear: 1991,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Hayden+Hawks",
    baseScore: 5
  },
  {
    name: "Clare Gallagher",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.COMMON,
    description: "Leadville 100 champion, mountain runner",
    nationality: "USA",
    birthYear: 1993,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Clare+Gallagher",
    baseScore: 5
  },
  {
    name: "Cat Bradley",
    sport: "Trail/Ultra Running",
    rarity: CardRarity.COMMON,
    description: "Leadville 100 champion, ultra specialist",
    nationality: "USA",
    birthYear: 1982,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Cat+Bradley",
    baseScore: 5
  }
]

async function seedEnduranceCards() {
  console.log('🏃‍♂️ Starting endurance card seeding...')
  
  try {
    // Clear existing cards
    await prisma.card.deleteMany()
    console.log('Cleared existing cards')
    
    // Insert all endurance cards
    const result = await prisma.card.createMany({
      data: cardData
    })
    
    console.log(`✅ Successfully seeded ${result.count} endurance cards`)
    
    // Show distribution by rarity
    const rarityCount = await prisma.card.groupBy({
      by: ['rarity'],
      _count: {
        id: true
      }
    })
    
    console.log('\n📊 Endurance Card Distribution:')
    rarityCount.forEach(group => {
      console.log(`${group.rarity}: ${group._count.id} cards`)
    })
    
    // Show distribution by sport
    const sportCount = await prisma.card.groupBy({
      by: ['sport'],
      _count: {
        id: true
      }
    })
    
    console.log('\n🏃‍♂️ Sport Distribution:')
    sportCount.forEach(group => {
      console.log(`${group.sport}: ${group._count.id} cards`)
    })
    
  } catch (error) {
    console.error('❌ Error seeding endurance cards:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export { seedEnduranceCards, cardData }

if (require.main === module) {
  seedEnduranceCards()
}