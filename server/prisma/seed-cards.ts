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
  // LEGENDARY (1 card) - Ultimate GOAT
  {
    name: "Muhammad Ali",
    sport: "Boxing",
    rarity: CardRarity.LEGENDARY,
    description: "The Greatest - 3x Heavyweight Champion, Olympic Gold, global icon",
    nationality: "USA", 
    birthYear: 1942,
    imageUrl: "https://via.placeholder.com/300x400/FFA500/FFFFFF?text=Muhammad+Ali",
    baseScore: 1000
  },

  // EPIC (4 cards) - Modern Legends
  {
    name: "Michael Jordan",
    sport: "Basketball",
    rarity: CardRarity.EPIC,
    description: "6x NBA Champion, 5x MVP, basketball's greatest icon",
    nationality: "USA",
    birthYear: 1963,
    imageUrl: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Michael+Jordan",
    baseScore: 500
  },
  {
    name: "Serena Williams",
    sport: "Tennis",
    rarity: CardRarity.EPIC,
    description: "23x Grand Slam champion, dominated women's tennis for two decades",
    nationality: "USA",
    birthYear: 1981,
    imageUrl: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Serena+Williams",
    baseScore: 500
  },
  {
    name: "Lionel Messi",
    sport: "Soccer",
    rarity: CardRarity.EPIC,
    description: "8x Ballon d'Or winner, World Cup champion, Barcelona legend",
    nationality: "Argentina",
    birthYear: 1987,
    imageUrl: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Lionel+Messi",
    baseScore: 500
  },
  {
    name: "Tom Brady",
    sport: "American Football",
    rarity: CardRarity.EPIC,
    description: "7x Super Bowl champion, greatest NFL quarterback of all time",
    nationality: "USA",
    birthYear: 1977,
    imageUrl: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Tom+Brady",
    baseScore: 500
  },

  // RARE (15 cards) - Hall of Famers & Record Holders
  {
    name: "Usain Bolt",
    sport: "Track & Field",
    rarity: CardRarity.RARE,
    description: "Fastest human ever - 100m & 200m world records, 8x Olympic gold",
    nationality: "Jamaica",
    birthYear: 1986,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Usain+Bolt",
    baseScore: 100
  },
  {
    name: "Michael Phelps",
    sport: "Swimming",
    rarity: CardRarity.RARE,
    description: "Most decorated Olympian ever with 28 medals, 23 gold",
    nationality: "USA",
    birthYear: 1985,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Michael+Phelps",
    baseScore: 100
  },
  {
    name: "Babe Ruth",
    sport: "Baseball",
    rarity: CardRarity.RARE,
    description: "The Sultan of Swat - revolutionized baseball with 714 home runs",
    nationality: "USA",
    birthYear: 1895,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Babe+Ruth",
    baseScore: 100
  },
  {
    name: "Wayne Gretzky",
    sport: "Ice Hockey",
    rarity: CardRarity.RARE,
    description: "The Great One - most goals and assists in NHL history",
    nationality: "Canada",
    birthYear: 1961,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Wayne+Gretzky",
    baseScore: 100
  },
  {
    name: "Pelé",
    sport: "Soccer",
    rarity: CardRarity.RARE,
    description: "3x World Cup winner, scored over 1000 career goals",
    nationality: "Brazil",
    birthYear: 1940,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Pele",
    baseScore: 100
  },
  {
    name: "Tiger Woods",
    sport: "Golf",
    rarity: CardRarity.RARE,
    description: "15x Major champion, dominated golf for two decades",
    nationality: "USA",
    birthYear: 1975,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Tiger+Woods",
    baseScore: 100
  },
  {
    name: "Simone Biles",
    sport: "Gymnastics",
    rarity: CardRarity.RARE,
    description: "Most decorated gymnast with 32 Olympic/World medals",
    nationality: "USA",
    birthYear: 1997,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Simone+Biles",
    baseScore: 100
  },
  {
    name: "Kareem Abdul-Jabbar",
    sport: "Basketball",
    rarity: CardRarity.RARE,
    description: "NBA all-time scoring leader (until LeBron), 6x champion",
    nationality: "USA",
    birthYear: 1947,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Kareem+Abdul-Jabbar",
    baseScore: 100
  },
  {
    name: "Jesse Owens",
    sport: "Track & Field",
    rarity: CardRarity.RARE,
    description: "4x Olympic gold in 1936 Berlin, shattered Nazi ideology",
    nationality: "USA",
    birthYear: 1913,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Jesse+Owens",
    baseScore: 100
  },
  {
    name: "Martina Navratilova",
    sport: "Tennis",
    rarity: CardRarity.RARE,
    description: "18x Grand Slam singles champion, 31x doubles champion",
    nationality: "USA",
    birthYear: 1956,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Martina+Navratilova",
    baseScore: 100
  },
  {
    name: "Jim Thorpe",
    sport: "Multi-Sport",
    rarity: CardRarity.RARE,
    description: "1912 Olympic decathlon/pentathlon champion, pro football pioneer",
    nationality: "USA",
    birthYear: 1887,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Jim+Thorpe",
    baseScore: 100
  },
  {
    name: "Cristiano Ronaldo",
    sport: "Soccer",
    rarity: CardRarity.RARE,
    description: "5x Ballon d'Or winner, all-time Champions League top scorer",
    nationality: "Portugal",
    birthYear: 1985,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Cristiano+Ronaldo",
    baseScore: 100
  },
  {
    name: "LeBron James",
    sport: "Basketball",
    rarity: CardRarity.RARE,
    description: "4x NBA champion, all-time NBA scoring leader",
    nationality: "USA",
    birthYear: 1984,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=LeBron+James",
    baseScore: 100
  },
  {
    name: "Joe Montana",
    sport: "American Football",
    rarity: CardRarity.RARE,
    description: "4x Super Bowl champion, clutch quarterback legend",
    nationality: "USA",
    birthYear: 1956,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Joe+Montana",
    baseScore: 100
  },
  {
    name: "Steffi Graf",
    sport: "Tennis",
    rarity: CardRarity.RARE,
    description: "Golden Grand Slam winner, 22x Grand Slam champion",
    nationality: "Germany",
    birthYear: 1969,
    imageUrl: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Steffi+Graf",
    baseScore: 100
  },

  // UNCOMMON (30 cards) - Olympic medalists, major tournament winners
  {
    name: "Carl Lewis",
    sport: "Track & Field",
    rarity: CardRarity.UNCOMMON,
    description: "9x Olympic gold medalist in sprints and long jump",
    nationality: "USA",
    birthYear: 1961,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Carl+Lewis",
    baseScore: 25
  },
  {
    name: "Florence Griffith-Joyner",
    sport: "Track & Field", 
    rarity: CardRarity.UNCOMMON,
    description: "World record holder in 100m and 200m, 3x Olympic gold",
    nationality: "USA",
    birthYear: 1959,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Flo-Jo",
    baseScore: 25
  },
  {
    name: "Mark Spitz",
    sport: "Swimming",
    rarity: CardRarity.UNCOMMON,
    description: "7x Olympic gold medals in 1972 Munich Olympics",
    nationality: "USA",
    birthYear: 1950,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Mark+Spitz",
    baseScore: 25
  },
  {
    name: "Nadia Comaneci",
    sport: "Gymnastics",
    rarity: CardRarity.UNCOMMON,
    description: "First perfect 10 in Olympic gymnastics history",
    nationality: "Romania",
    birthYear: 1961,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Nadia+Comaneci",
    baseScore: 25
  },
  {
    name: "Magic Johnson",
    sport: "Basketball",
    rarity: CardRarity.UNCOMMON,
    description: "5x NBA champion, revolutionized point guard position",
    nationality: "USA",
    birthYear: 1959,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Magic+Johnson",
    baseScore: 25
  },
  {
    name: "Larry Bird",
    sport: "Basketball",
    rarity: CardRarity.UNCOMMON,
    description: "3x NBA champion, 3x MVP, Boston Celtics legend",
    nationality: "USA",
    birthYear: 1956,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Larry+Bird",
    baseScore: 25
  },
  {
    name: "Joe DiMaggio",
    sport: "Baseball",
    rarity: CardRarity.UNCOMMON,
    description: "56-game hitting streak, 9x World Series champion",
    nationality: "USA",
    birthYear: 1914,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Joe+DiMaggio",
    baseScore: 25
  },
  {
    name: "Ted Williams",
    sport: "Baseball",
    rarity: CardRarity.UNCOMMON,
    description: "Last player to hit .400 in a season (.406 in 1941)",
    nationality: "USA",
    birthYear: 1918,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Ted+Williams",
    baseScore: 25
  },
  {
    name: "Gordie Howe",
    sport: "Ice Hockey",
    rarity: CardRarity.UNCOMMON,
    description: "Mr. Hockey - played 26 NHL seasons, 4x Stanley Cup champion",
    nationality: "Canada",
    birthYear: 1928,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Gordie+Howe",
    baseScore: 25
  },
  {
    name: "Maurice Richard",
    sport: "Ice Hockey",
    rarity: CardRarity.UNCOMMON,
    description: "The Rocket - first to score 50 goals in 50 games",
    nationality: "Canada",
    birthYear: 1921,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Maurice+Richard",
    baseScore: 25
  },
  {
    name: "John McEnroe",
    sport: "Tennis",
    rarity: CardRarity.UNCOMMON,
    description: "7x Grand Slam champion, known for fiery personality",
    nationality: "USA",
    birthYear: 1959,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=John+McEnroe",
    baseScore: 25
  },
  {
    name: "Björn Borg",
    sport: "Tennis",
    rarity: CardRarity.UNCOMMON,
    description: "11x Grand Slam champion, 5 consecutive Wimbledons",
    nationality: "Sweden",
    birthYear: 1956,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Bjorn+Borg",
    baseScore: 25
  },
  {
    name: "Jack Nicklaus",
    sport: "Golf",
    rarity: CardRarity.UNCOMMON,
    description: "The Golden Bear - 18x Major champion",
    nationality: "USA",
    birthYear: 1940,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Jack+Nicklaus",
    baseScore: 25
  },
  {
    name: "Arnold Palmer",
    sport: "Golf",
    rarity: CardRarity.UNCOMMON,
    description: "The King - 7x Major champion, popularized modern golf",
    nationality: "USA",
    birthYear: 1929,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Arnold+Palmer",
    baseScore: 25
  },
  {
    name: "Johnny Unitas",
    sport: "American Football",
    rarity: CardRarity.UNCOMMON,
    description: "3x NFL champion, Baltimore Colts legend",
    nationality: "USA",
    birthYear: 1933,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Johnny+Unitas",
    baseScore: 25
  },
  {
    name: "Jim Brown",
    sport: "American Football",
    rarity: CardRarity.UNCOMMON,
    description: "NFL rushing champion 8 of 9 seasons, Cleveland Browns icon",
    nationality: "USA",
    birthYear: 1936,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Jim+Brown",
    baseScore: 25
  },
  {
    name: "Maradona",
    sport: "Soccer",
    rarity: CardRarity.UNCOMMON,
    description: "1986 World Cup winner, 'Hand of God' and Goal of the Century",
    nationality: "Argentina",
    birthYear: 1960,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Maradona",
    baseScore: 25
  },
  {
    name: "Johan Cruyff",
    sport: "Soccer",
    rarity: CardRarity.UNCOMMON,
    description: "3x Ballon d'Or winner, total football pioneer",
    nationality: "Netherlands",
    birthYear: 1947,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Johan+Cruyff",
    baseScore: 25
  },
  {
    name: "Pelé",
    sport: "Soccer",
    rarity: CardRarity.UNCOMMON,
    description: "Brazilian legend, only player with 3 World Cups",
    nationality: "Brazil",
    birthYear: 1940,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Pele+2",
    baseScore: 25
  },
  {
    name: "Billie Jean King",
    sport: "Tennis",
    rarity: CardRarity.UNCOMMON,
    description: "12x Grand Slam singles champion, women's rights pioneer",
    nationality: "USA",
    birthYear: 1943,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Billie+Jean+King",
    baseScore: 25
  },
  {
    name: "Chris Evert",
    sport: "Tennis",
    rarity: CardRarity.UNCOMMON,
    description: "18x Grand Slam singles champion, dominated 1970s",
    nationality: "USA",
    birthYear: 1954,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Chris+Evert",
    baseScore: 25
  },
  {
    name: "Sugar Ray Robinson",
    sport: "Boxing",
    rarity: CardRarity.UNCOMMON,
    description: "Considered pound-for-pound greatest boxer ever",
    nationality: "USA",
    birthYear: 1921,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Sugar+Ray+Robinson",
    baseScore: 25
  },
  {
    name: "Joe Frazier",
    sport: "Boxing",
    rarity: CardRarity.UNCOMMON,
    description: "Olympic gold medalist, heavyweight champion",
    nationality: "USA",
    birthYear: 1944,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Joe+Frazier",
    baseScore: 25
  },
  {
    name: "Roberto Clemente",
    sport: "Baseball",
    rarity: CardRarity.UNCOMMON,
    description: "15x All-Star, first Latino player in Hall of Fame",
    nationality: "Puerto Rico",
    birthYear: 1934,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Roberto+Clemente",
    baseScore: 25
  },
  {
    name: "Willie Mays",
    sport: "Baseball",
    rarity: CardRarity.UNCOMMON,
    description: "Say Hey Kid - 660 home runs, amazing all-around player",
    nationality: "USA",
    birthYear: 1931,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Willie+Mays",
    baseScore: 25
  },
  {
    name: "Hank Aaron",
    sport: "Baseball",
    rarity: CardRarity.UNCOMMON,
    description: "Home run king for 33 years, broke Babe Ruth's record",
    nationality: "USA",
    birthYear: 1934,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Hank+Aaron",
    baseScore: 25
  },
  {
    name: "Sandy Koufax",
    sport: "Baseball",
    rarity: CardRarity.UNCOMMON,
    description: "3x Cy Young winner, perfect game pitcher",
    nationality: "USA",
    birthYear: 1935,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Sandy+Koufax",
    baseScore: 25
  },
  {
    name: "Jackie Robinson",
    sport: "Baseball",
    rarity: CardRarity.UNCOMMON,
    description: "Broke baseball's color barrier, civil rights pioneer",
    nationality: "USA",
    birthYear: 1919,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Jackie+Robinson",
    baseScore: 25
  },
  {
    name: "Mario Lemieux",
    sport: "Ice Hockey",
    rarity: CardRarity.UNCOMMON,
    description: "2x Stanley Cup champion, overcame health challenges",
    nationality: "Canada",
    birthYear: 1965,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Mario+Lemieux",
    baseScore: 25
  },
  {
    name: "Bobby Orr",
    sport: "Ice Hockey",
    rarity: CardRarity.UNCOMMON,
    description: "Revolutionary defenseman, 2x Stanley Cup champion",
    nationality: "Canada",
    birthYear: 1948,
    imageUrl: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Bobby+Orr",
    baseScore: 25
  },

  // COMMON (50 cards) - Regional/national champions and notable athletes
  {
    name: "Andre Agassi",
    sport: "Tennis",
    rarity: CardRarity.COMMON,
    description: "8x Grand Slam champion, charismatic baseline player",
    nationality: "USA",
    birthYear: 1970,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Andre+Agassi",
    baseScore: 5
  },
  {
    name: "Pete Sampras",
    sport: "Tennis",
    rarity: CardRarity.COMMON,
    description: "14x Grand Slam champion, dominated 1990s",
    nationality: "USA",
    birthYear: 1971,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Pete+Sampras",
    baseScore: 5
  },
  {
    name: "Roger Federer",
    sport: "Tennis",
    rarity: CardRarity.COMMON,
    description: "20x Grand Slam champion, elegant playing style",
    nationality: "Switzerland",
    birthYear: 1981,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Roger+Federer",
    baseScore: 5
  },
  {
    name: "Rafael Nadal",
    sport: "Tennis", 
    rarity: CardRarity.COMMON,
    description: "22x Grand Slam champion, King of Clay",
    nationality: "Spain",
    birthYear: 1986,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Rafael+Nadal",
    baseScore: 5
  },
  {
    name: "Novak Djokovic",
    sport: "Tennis",
    rarity: CardRarity.COMMON,
    description: "24x Grand Slam champion, incredible mental strength",
    nationality: "Serbia",
    birthYear: 1987,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Novak+Djokovic",
    baseScore: 5
  },
  {
    name: "Kobe Bryant",
    sport: "Basketball",
    rarity: CardRarity.COMMON,
    description: "5x NBA champion, Mamba Mentality legend",
    nationality: "USA",
    birthYear: 1978,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Kobe+Bryant",
    baseScore: 5
  },
  {
    name: "Shaquille O'Neal",
    sport: "Basketball",
    rarity: CardRarity.COMMON,
    description: "4x NBA champion, dominant center",
    nationality: "USA",
    birthYear: 1972,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Shaquille+ONeal",
    baseScore: 5
  },
  {
    name: "Tim Duncan",
    sport: "Basketball",
    rarity: CardRarity.COMMON,
    description: "5x NBA champion, fundamental excellence",
    nationality: "USA",
    birthYear: 1976,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Tim+Duncan",
    baseScore: 5
  },
  {
    name: "Hakeem Olajuwon",
    sport: "Basketball",
    rarity: CardRarity.COMMON,
    description: "2x NBA champion, Dream Shake master",
    nationality: "USA",
    birthYear: 1963,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Hakeem+Olajuwon",
    baseScore: 5
  },
  {
    name: "Charles Barkley",
    sport: "Basketball",
    rarity: CardRarity.COMMON,
    description: "NBA MVP, Round Mound of Rebound",
    nationality: "USA",
    birthYear: 1963,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Charles+Barkley",
    baseScore: 5
  },
  {
    name: "Karl Malone",
    sport: "Basketball",
    rarity: CardRarity.COMMON,
    description: "2x NBA MVP, second all-time scoring leader (retired)",
    nationality: "USA",
    birthYear: 1963,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Karl+Malone",
    baseScore: 5
  },
  {
    name: "John Stockton",
    sport: "Basketball",
    rarity: CardRarity.COMMON,
    description: "All-time assists and steals leader",
    nationality: "USA",
    birthYear: 1962,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=John+Stockton",
    baseScore: 5
  },
  {
    name: "Derek Jeter",
    sport: "Baseball",
    rarity: CardRarity.COMMON,
    description: "5x World Series champion, Yankees captain",
    nationality: "USA",
    birthYear: 1974,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Derek+Jeter",
    baseScore: 5
  },
  {
    name: "Ken Griffey Jr.",
    sport: "Baseball",
    rarity: CardRarity.COMMON,
    description: "Sweet swing, 630 home runs, 13x All-Star",
    nationality: "USA",
    birthYear: 1969,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Ken+Griffey+Jr",
    baseScore: 5
  },
  {
    name: "Barry Bonds",
    sport: "Baseball",
    rarity: CardRarity.COMMON,
    description: "All-time home run leader with 762",
    nationality: "USA",
    birthYear: 1964,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Barry+Bonds",
    baseScore: 5
  },
  {
    name: "Cal Ripken Jr.",
    sport: "Baseball",
    rarity: CardRarity.COMMON,
    description: "Iron Man - 2,632 consecutive games played",
    nationality: "USA",
    birthYear: 1960,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Cal+Ripken+Jr",
    baseScore: 5
  },
  {
    name: "Tony Gwynn",
    sport: "Baseball",
    rarity: CardRarity.COMMON,
    description: "Mr. Padre - 8x batting champion",
    nationality: "USA",
    birthYear: 1960,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Tony+Gwynn",
    baseScore: 5
  },
  {
    name: "Frank Thomas",
    sport: "Baseball",
    rarity: CardRarity.COMMON,
    description: "The Big Hurt - 2x MVP, 521 home runs",
    nationality: "USA",
    birthYear: 1968,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Frank+Thomas",
    baseScore: 5
  },
  {
    name: "Greg Maddux",
    sport: "Baseball",
    rarity: CardRarity.COMMON,
    description: "4 consecutive Cy Young awards, control master",
    nationality: "USA",
    birthYear: 1966,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Greg+Maddux",
    baseScore: 5
  },
  {
    name: "Randy Johnson",
    sport: "Baseball",
    rarity: CardRarity.COMMON,
    description: "The Big Unit - 5x Cy Young winner",
    nationality: "USA",
    birthYear: 1963,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Randy+Johnson",
    baseScore: 5
  },
  {
    name: "Brett Favre",
    sport: "American Football",
    rarity: CardRarity.COMMON,
    description: "3x NFL MVP, gunslinger quarterback",
    nationality: "USA",
    birthYear: 1969,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Brett+Favre",
    baseScore: 5
  },
  {
    name: "Peyton Manning",
    sport: "American Football",
    rarity: CardRarity.COMMON,
    description: "5x NFL MVP, 2x Super Bowl champion",
    nationality: "USA",
    birthYear: 1976,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Peyton+Manning",
    baseScore: 5
  },
  {
    name: "Jerry Rice",
    sport: "American Football",
    rarity: CardRarity.COMMON,
    description: "Greatest wide receiver ever, 3x Super Bowl champion",
    nationality: "USA",
    birthYear: 1962,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Jerry+Rice",
    baseScore: 5
  },
  {
    name: "Lawrence Taylor",
    sport: "American Football",
    rarity: CardRarity.COMMON,
    description: "Revolutionary linebacker, 2x Super Bowl champion",
    nationality: "USA",
    birthYear: 1959,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Lawrence+Taylor",
    baseScore: 5
  },
  {
    name: "Dan Marino",
    sport: "American Football",
    rarity: CardRarity.COMMON,
    description: "Pure passer, Miami Dolphins legend",
    nationality: "USA",
    birthYear: 1961,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Dan+Marino",
    baseScore: 5
  },
  {
    name: "Walter Payton",
    sport: "American Football",
    rarity: CardRarity.COMMON,
    description: "Sweetness - NFL rushing yards leader (retired)",
    nationality: "USA",
    birthYear: 1954,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Walter+Payton",
    baseScore: 5
  },
  {
    name: "Emmitt Smith",
    sport: "American Football",
    rarity: CardRarity.COMMON,
    description: "All-time NFL rushing leader, 3x Super Bowl champion",
    nationality: "USA",
    birthYear: 1969,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Emmitt+Smith",
    baseScore: 5
  },
  {
    name: "Patrick Roy",
    sport: "Ice Hockey",
    rarity: CardRarity.COMMON,
    description: "4x Stanley Cup champion goaltender",
    nationality: "Canada",
    birthYear: 1965,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Patrick+Roy",
    baseScore: 5
  },
  {
    name: "Mark Messier",
    sport: "Ice Hockey",
    rarity: CardRarity.COMMON,
    description: "The Captain - 6x Stanley Cup champion",
    nationality: "Canada",
    birthYear: 1961,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Mark+Messier",
    baseScore: 5
  },
  {
    name: "Jaromir Jagr",
    sport: "Ice Hockey",
    rarity: CardRarity.COMMON,
    description: "2x Stanley Cup champion, incredible longevity",
    nationality: "Czech Republic",
    birthYear: 1972,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Jaromir+Jagr",
    baseScore: 5
  },
  {
    name: "Steve Yzerman",
    sport: "Ice Hockey",
    rarity: CardRarity.COMMON,
    description: "3x Stanley Cup champion, Detroit Red Wings captain",
    nationality: "Canada",
    birthYear: 1965,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Steve+Yzerman",
    baseScore: 5
  },
  {
    name: "Pavel Bure",
    sport: "Ice Hockey",
    rarity: CardRarity.COMMON,
    description: "Russian Rocket - explosive scoring winger",
    nationality: "Russia",
    birthYear: 1971,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Pavel+Bure",
    baseScore: 5
  },
  {
    name: "Dominik Hasek",
    sport: "Ice Hockey",
    rarity: CardRarity.COMMON,
    description: "The Dominator - 2x Hart Trophy winning goalie",
    nationality: "Czech Republic",
    birthYear: 1965,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Dominik+Hasek",
    baseScore: 5
  },
  {
    name: "Phil Mickelson",
    sport: "Golf",
    rarity: CardRarity.COMMON,
    description: "Lefty - 6x Major champion",
    nationality: "USA",
    birthYear: 1970,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Phil+Mickelson",
    baseScore: 5
  },
  {
    name: "Gary Player",
    sport: "Golf",
    rarity: CardRarity.COMMON,
    description: "9x Major champion, fitness pioneer",
    nationality: "South Africa",
    birthYear: 1935,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Gary+Player",
    baseScore: 5
  },
  {
    name: "Lee Trevino",
    sport: "Golf",
    rarity: CardRarity.COMMON,
    description: "Merry Mex - 6x Major champion",
    nationality: "USA",
    birthYear: 1939,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Lee+Trevino",
    baseScore: 5
  },
  {
    name: "Ben Hogan",
    sport: "Golf",
    rarity: CardRarity.COMMON,
    description: "9x Major champion, golf swing technician",
    nationality: "USA",
    birthYear: 1912,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Ben+Hogan",
    baseScore: 5
  },
  {
    name: "Seve Ballesteros",
    sport: "Golf",
    rarity: CardRarity.COMMON,
    description: "5x Major champion, Spanish golf legend",
    nationality: "Spain",
    birthYear: 1957,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Seve+Ballesteros",
    baseScore: 5
  },
  {
    name: "Rory McIlroy",
    sport: "Golf",
    rarity: CardRarity.COMMON,
    description: "4x Major champion, Northern Ireland star",
    nationality: "Northern Ireland",
    birthYear: 1989,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Rory+McIlroy",
    baseScore: 5
  },
  {
    name: "Jordan Spieth",
    sport: "Golf",
    rarity: CardRarity.COMMON,
    description: "3x Major champion, youngest Masters winner in decades",
    nationality: "USA",
    birthYear: 1993,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Jordan+Spieth",
    baseScore: 5
  },
  {
    name: "Mo Farah",
    sport: "Track & Field",
    rarity: CardRarity.COMMON,
    description: "4x Olympic gold in 5000m and 10000m",
    nationality: "UK",
    birthYear: 1983,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Mo+Farah",
    baseScore: 5
  },
  {
    name: "Allyson Felix",
    sport: "Track & Field",
    rarity: CardRarity.COMMON,
    description: "Most decorated female track athlete with 11 Olympic medals",
    nationality: "USA",
    birthYear: 1985,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Allyson+Felix",
    baseScore: 5
  },
  {
    name: "Edwin Moses",
    sport: "Track & Field",
    rarity: CardRarity.COMMON,
    description: "400m hurdles legend, 107 consecutive race wins",
    nationality: "USA",
    birthYear: 1955,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Edwin+Moses",
    baseScore: 5
  },
  {
    name: "Jackie Joyner-Kersee",
    sport: "Track & Field",
    rarity: CardRarity.COMMON,
    description: "Greatest female athlete, heptathlon world record holder",
    nationality: "USA",
    birthYear: 1962,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Jackie+Joyner-Kersee",
    baseScore: 5
  },
  {
    name: "Sebastian Coe",
    sport: "Track & Field",
    rarity: CardRarity.COMMON,
    description: "2x Olympic 1500m champion, middle distance legend",
    nationality: "UK",
    birthYear: 1956,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Sebastian+Coe",
    baseScore: 5
  },
  {
    name: "Haile Gebrselassie",
    sport: "Track & Field",
    rarity: CardRarity.COMMON,
    description: "Ethiopian distance running legend, marathon world record",
    nationality: "Ethiopia",
    birthYear: 1973,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Haile+Gebrselassie",
    baseScore: 5
  },
  {
    name: "Katie Ledecky",
    sport: "Swimming",
    rarity: CardRarity.COMMON,
    description: "Distance freestyle dominator, 10x Olympic medalist",
    nationality: "USA",
    birthYear: 1997,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Katie+Ledecky",
    baseScore: 5
  },
  {
    name: "Adam Peaty",
    sport: "Swimming",
    rarity: CardRarity.COMMON,
    description: "Breaststroke world record holder, British sprint king",
    nationality: "UK",
    birthYear: 1994,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Adam+Peaty",
    baseScore: 5
  },
  {
    name: "Ian Thorpe",
    sport: "Swimming",
    rarity: CardRarity.COMMON,
    description: "Thorpedo - Australian freestyle legend",
    nationality: "Australia",
    birthYear: 1982,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Ian+Thorpe",
    baseScore: 5
  },
  {
    name: "Ryan Lochte",
    sport: "Swimming",
    rarity: CardRarity.COMMON,
    description: "12x Olympic medalist, individual medley specialist",
    nationality: "USA",
    birthYear: 1984,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Ryan+Lochte",
    baseScore: 5
  },
  {
    name: "Caeleb Dressel",
    sport: "Swimming",
    rarity: CardRarity.COMMON,
    description: "Sprint butterfly and freestyle champion",
    nationality: "USA",
    birthYear: 1996,
    imageUrl: "https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Caeleb+Dressel",
    baseScore: 5
  }
]

async function seedCards() {
  console.log('🃏 Starting card seeding...')
  
  try {
    // Clear existing cards
    await prisma.card.deleteMany()
    console.log('Cleared existing cards')
    
    // Insert all cards
    const result = await prisma.card.createMany({
      data: cardData
    })
    
    console.log(`✅ Successfully seeded ${result.count} cards`)
    
    // Show distribution by rarity
    const rarityCount = await prisma.card.groupBy({
      by: ['rarity'],
      _count: {
        id: true
      }
    })
    
    console.log('\n📊 Card Distribution:')
    rarityCount.forEach(group => {
      console.log(`${group.rarity}: ${group._count.id} cards`)
    })
    
  } catch (error) {
    console.error('❌ Error seeding cards:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export { seedCards, cardData }

if (require.main === module) {
  seedCards()
}