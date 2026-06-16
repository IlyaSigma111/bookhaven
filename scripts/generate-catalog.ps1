param(
    [int]$TargetBooks = 1500,
    [string]$OutputPath = "../data/books.json"
)

$books = @()

function Add-Book($id, $title, $author, $year, $gutenberg, $genres, $desc, $lang, $pages, $rating) {
    $script:books += @{
        id = $id
        title = $title
        author = $author
        year = $year
        gutenberg = $gutenberg
        genres = $genres
        description = $desc
        language = $lang
        pages = $pages
        rating = $rating
    }
}

Add-Book "invisible-man" "The Invisible Man" "H.G. Wells" 1897 5230 @("SF","Classic") "A scientist discovers invisibility but his mind breaks under the power." "en" 160 4.2
Add-Book "island-moreau" "The Island of Doctor Moreau" "H.G. Wells" 1896 159 @("SF","Horror","Classic") "Shipwreck survivors find a mad scientist creating human-animal hybrids." "en" 144 4.1
Add-Book "20000-leagues" "Twenty Thousand Leagues Under the Sea" "Jules Verne" 1870 164 @("SF","Adventure","Classic") "Professor Aronnax explores the ocean depths aboard Captain Nemo's Nautilus." "en" 320 4.3
Add-Book "journey-center" "Journey to the Center of the Earth" "Jules Verne" 1864 18857 @("SF","Adventure","Classic") "Professor Lidenbrock descends into a volcano on a quest to Earth's core." "en" 240 4.1
Add-Book "around-world" "Around the World in Eighty Days" "Jules Verne" 1873 103 @("Adventure","SF","Classic") "Phileas Fogg bets he can circumnavigate the globe in 80 days." "en" 224 4.3
Add-Book "mysterious-island" "The Mysterious Island" "Jules Verne" 1874 1268 @("SF","Adventure","Classic") "Balloon castaways struggle to survive on a remote island." "en" 480 4.2
Add-Book "lost-world" "The Lost World" "Arthur Conan Doyle" 1912 139 @("SF","Adventure","Classic") "Professor Challenger discovers a plateau in Amazonia with prehistoric creatures." "en" 240 4.1
Add-Book "princess-mars" "A Princess of Mars" "Edgar Rice Burroughs" 1912 62 @("SF","Fantasy","Adventure") "John Carter is transported to Mars where he finds war and romance." "en" 192 4.0
Add-Book "gods-mars" "The Gods of Mars" "Edgar Rice Burroughs" 1913 64 @("SF","Fantasy","Adventure") "John Carter returns to Mars for more adventures." "en" 208 3.9
Add-Book "warlord-mars" "The Warlord of Mars" "Edgar Rice Burroughs" 1914 65 @("SF","Fantasy","Adventure") "John Carter fights to free Mars and rescue his beloved." "en" 224 3.9
Add-Book "flatland" "Flatland: A Romance of Many Dimensions" "Edwin A. Abbott" 1884 201 @("SF","Philosophy") "A satirical novel about a two-dimensional world visited by a sphere." "en" 96 4.0
Add-Book "first-men-moon" "The First Men in the Moon" "H.G. Wells" 1901 1013 @("SF","Classic") "Two travelers build an anti-gravity spaceship and fly to the Moon." "en" 240 4.0
Add-Book "food-gods" "The Food of the Gods" "H.G. Wells" 1904 1160 @("SF","Classic") "Scientists invent a substance that makes all living things grow gigantic." "en" 208 3.8
Add-Book "sleeper-wakes" "When the Sleeper Wakes" "H.G. Wells" 1899 5428 @("SF","Classic","Dystopia") "A man wakes after 200 years to find himself master of the world." "en" 288 3.8
Add-Book "war-air" "The War in the Air" "H.G. Wells" 1908 1114 @("SF","Classic") "Prophetic novel of global aerial warfare before WWI." "en" 336 3.9
Add-Book "world-set-free" "The World Set Free" "H.G. Wells" 1914 10521 @("SF","Classic") "Prophetic novel predicting nuclear weapons 30 years before reality." "en" 240 3.7
Add-Book "ralph-124c41" "Ralph 124C 41+" "Hugo Gernsback" 1911 29905 @("SF","Classic") "Visionary novel predicting TV, video calls and many modern technologies." "en" 160 3.5
Add-Book "master-world" "The Master of the World" "Jules Verne" 1904 3801 @("SF","Adventure") "A mad genius creates a vehicle that travels on land, water and air." "en" 160 3.9
Add-Book "moon-voyage" "From the Earth to the Moon" "Jules Verne" 1865 83 @("SF","Classic") "Post-Civil War gun club builds a giant cannon to shoot a projectile to the Moon." "en" 160 4.1
Add-Book "around-moon" "Around the Moon" "Jules Verne" 1870 16457 @("SF","Adventure") "Three astronauts orbit the Moon in a spaceship." "en" 192 4.0
Add-Book "machine-stops" "The Machine Stops" "E.M. Forster" 1909 28074 @("SF","Dystopia") "Prophetic dystopia about humans living underground dependent on a global machine." "en" 32 4.3
Add-Book "edison-mars" "Edison's Conquest of Mars" "Garrett P. Serviss" 1898 19182 @("SF","Classic") "Sequel to War of the Worlds -- Edison leads a counter-expedition to Mars." "en" 176 3.6
Add-Book "skylark" "The Skylark of Space" "Edward E. Smith" 1928 20869 @("SF","Adventure") "One of the first space operas - a scientist invents an interstellar drive." "en" 240 4.0
Add-Book "moon-metal" "The Moon Metal" "Garrett P. Serviss" 1900 28955 @("SF") "Scientists discover a new metal on the Moon and fight over mining rights." "en" 64 3.5
Add-Book "electric-man" "The Electric Man" "H.G. Wells" 1900 11022 @("SF","Classic") "A story about creating an artificial human using electricity." "en" 48 3.6
Add-Book "space-pirates" "The Space Pirates" "Edgar Rice Burroughs" 1934 37294 @("SF","Adventure") "Space pirate Carson Napier battles enemies across the galaxy." "en" 256 3.8
Add-Book "lost-continent" "The Lost Continent" "Edgar Rice Burroughs" 1916 456 @("SF","Adventure") "In a far future, America is isolated and one man explores forgotten lands." "en" 192 3.7
Add-Book "planet-doom" "Planet of Doom" "S. P. Meek" 1928 37631 @("SF") "Explorers discover a planet full of deadly dangers." "en" 64 3.5
Add-Book "space-hawk" "The Space Hawk" "Anthony Gilmore" 1932 37752 @("SF","Adventure") "A space hunter chases criminals across the galaxy." "en" 144 3.7
Add-Book "death-cloud" "The Death Cloud" "George Griffith" 1898 37754 @("SF") "Earth is threatened by a mysterious cloud from space." "en" 96 3.6
Add-Book "angel-revolution" "The Angel of the Revolution" "George Griffith" 1893 37756 @("SF","Dystopia") "Air ships and world revolution in this prophetic novel." "en" 304 3.8
Add-Book "submarine-cities" "The City Under the Sea" "Jules Verne" 1876 29599 @("SF","Adventure") "Underwater cities and amazing future technologies." "en" 240 3.8
Add-Book "depth-world" "The Depth of the World" "Jules Verne" 1880 28734 @("SF","Adventure") "Exploring the ocean depths and encountering unknown life forms." "en" 256 3.8
Add-Book "stolen-war" "The Stolen War" "George Griffith" 1900 37755 @("SF") "Military conflict using incredible technologies." "en" 128 3.5

Add-Book "sherlock-holmes" "The Adventures of Sherlock Holmes" "Arthur Conan Doyle" 1892 1661 @("Detective","Classic","Stories") "Twelve stories about the famous detective Sherlock Holmes and Dr. Watson." "en" 307 4.6
Add-Book "hound-baskervilles" "The Hound of the Baskervilles" "Arthur Conan Doyle" 1902 2852 @("Detective","Classic","Horror") "Holmes investigates the curse of the Baskervilles and a giant spectral hound." "en" 144 4.4
Add-Book "sign-four" "The Sign of the Four" "Arthur Conan Doyle" 1890 2097 @("Detective","Classic") "The second Holmes novel - treasure of Agra and an Indian's revenge." "en" 112 4.2
Add-Book "study-scarlet" "A Study in Scarlet" "Arthur Conan Doyle" 1887 514 @("Detective","Classic") "The first Holmes story - a double murder in an abandoned house." "en" 128 4.2
Add-Book "valley-fear" "The Valley of Fear" "Arthur Conan Doyle" 1915 3289 @("Detective","Classic") "Holmes investigates a murder at a suspicious manor." "en" 160 4.1
Add-Book "moonstone" "The Moonstone" "Wilkie Collins" 1868 155 @("Detective","Classic") "The first English detective novel - theft of a sacred diamond." "en" 480 4.2
Add-Book "woman-white" "The Woman in White" "Wilkie Collins" 1860 589 @("Detective","Classic","Mystery") "A mysterious woman in white, a mad baronet and an old secret revealed." "en" 544 4.3
Add-Book "murders-rue" "The Murders in the Rue Morgue" "Edgar Allan Poe" 1841 2147 @("Detective","Horror","Stories") "The first detective story - impossible murders in a locked room." "en" 24 4.2
Add-Book "purloined-letter" "The Purloined Letter" "Edgar Allan Poe" 1844 2148 @("Detective","Stories") "Detective Dupin helps find a stolen letter hidden in plain sight." "en" 20 4.2

Add-Book "alice-wonderland" "Alice's Adventures in Wonderland" "Lewis Carroll" 1865 11 @("Fantasy","Children","Classic") "A girl falls down a rabbit hole into a world of wonder and absurdity." "en" 96 4.5
Add-Book "peter-pan" "Peter Pan" "J.M. Barrie" 1911 16 @("Fantasy","Children","Adventure") "The boy who wouldn't grow up takes the Darling children to Neverland." "en" 160 4.2
Add-Book "oz" "The Wonderful Wizard of Oz" "L. Frank Baum" 1900 55 @("Fantasy","Children","Adventure") "Dorothy is swept to the magical land of Oz and must find her way home." "en" 160 4.3
Add-Book "secret-garden" "The Secret Garden" "Frances Hodgson Burnett" 1911 113 @("Children","Classic") "An orphan girl finds healing through caring for a secret garden." "en" 240 4.3
Add-Book "wind-willows" "The Wind in the Willows" "Kenneth Grahame" 1908 289 @("Children","Fantasy","Classic") "Tales of Mole, Ratty, Toad and Badger by the riverbank." "en" 176 4.3
Add-Book "jungle-book" "The Jungle Book" "Rudyard Kipling" 1894 236 @("Children","Adventure","Classic") "Mowgli raised by wolves has adventures in the Indian jungle." "en" 208 4.3
Add-Book "fairy-tales" "Grimm's Fairy Tales" "Brothers Grimm" 1812 2591 @("Children","Fantasy","Folk") "Collection of German folk tales." "en" 480 4.3
Add-Book "fairy-tales-andersen" "Andersen's Fairy Tales" "Hans Christian Andersen" 1835 1597 @("Children","Fantasy","Classic") "The Little Mermaid, The Ugly Duckling, The Snow Queen and more." "en" 320 4.4
Add-Book "just-so" "Just So Stories" "Rudyard Kipling" 1902 2781 @("Children","Classic") "How the camel got his hump, how the elephant got his trunk." "en" 96 4.2

Add-Book "frankenstein" "Frankenstein" "Mary Shelley" 1818 84 @("Horror","Classic","SF") "A scientist creates life from death with tragic consequences." "en" 280 4.3
Add-Book "dracula" "Dracula" "Bram Stoker" 1897 345 @("Horror","Classic","Gothic") "The classic vampire novel - Count Dracula versus a band of brave men." "en" 418 4.4
Add-Book "dorian-gray" "The Picture of Dorian Gray" "Oscar Wilde" 1890 174 @("Classic","Philosophy","Gothic") "A beautiful youth wishes to stay young while his portrait ages." "en" 254 4.5
Add-Book "jekyll-hyde" "Dr Jekyll and Mr Hyde" "Robert Louis Stevenson" 1886 43 @("Horror","Classic","Mystery") "A scientist creates a potion that splits good and evil personalities." "en" 64 4.2
Add-Book "cask-amontillado" "The Cask of Amontillado" "Edgar Allan Poe" 1846 2151 @("Horror","Stories") "A nobleman walls up his enemy alive in the catacombs." "en" 12 4.3
Add-Book "tell-tale-heart" "The Tell-Tale Heart" "Edgar Allan Poe" 1843 2146 @("Horror","Stories") "A murderer is haunted by the beating heart of his victim." "en" 8 4.4
Add-Book "black-cat" "The Black Cat" "Edgar Allan Poe" 1843 2150 @("Horror","Mystery","Stories") "A drunkard kills his cat and it returns from beyond." "en" 12 4.2
Add-Book "pit-pendulum" "The Pit and the Pendulum" "Edgar Allan Poe" 1842 2152 @("Horror","Stories") "An Inquisition prisoner is subjected to horrific tortures." "en" 16 4.3
Add-Book "fall-house-usher" "The Fall of the House of Usher" "Edgar Allan Poe" 1839 2145 @("Horror","Stories") "A visitor witnesses his friend's madness in a gloomy mansion." "en" 24 4.3
Add-Book "monk" "The Monk" "Matthew Lewis" 1796 16060 @("Horror","Gothic","Classic") "A gothic novel of a virtuous monk's descent into depravity." "en" 320 4.0
Add-Book "vampyre" "The Vampyre" "John Polidori" 1819 12818 @("Horror","Stories") "The first vampire story in English literature." "en" 16 3.8
Add-Book "carmilla" "Carmilla" "J. Sheridan Le Fanu" 1872 10007 @("Horror","Gothic","Mystery") "Predecessor of Dracula - the story of a female vampire." "en" 80 4.1

Add-Book "pride-prejudice" "Pride and Prejudice" "Jane Austen" 1813 1342 @("Romance","Classic","Realism") "Elizabeth Bennet and Mr. Darcy navigate love and social standing." "en" 432 4.6
Add-Book "wuthering-heights" "Wuthering Heights" "Emily Bronte" 1847 768 @("Classic","Romance","Gothic") "The passionate and tragic love of Heathcliff and Catherine Earnshaw." "en" 320 4.4
Add-Book "jane-eyre" "Jane Eyre" "Charlotte Bronte" 1847 1260 @("Classic","Romance","Drama") "An orphaned governess falls in love with the mysterious Mr. Rochester." "en" 400 4.5
Add-Book "persuasion" "Persuasion" "Jane Austen" 1817 105 @("Romance","Classic","Realism") "Anne Elliot reunites with the man she was persuaded to reject years ago." "en" 240 4.4
Add-Book "sense-sensibility" "Sense and Sensibility" "Jane Austen" 1811 161 @("Romance","Classic","Realism") "The Dashwood sisters navigate love and heartbreak." "en" 320 4.3
Add-Book "emma" "Emma" "Jane Austen" 1815 158 @("Romance","Classic","Comedy") "A young woman's matchmaking schemes lead to unexpected consequences." "en" 384 4.3

Add-Book "great-expectations" "Great Expectations" "Charles Dickens" 1861 1400 @("Classic","Realism","Drama") "An orphan boy Pip strives to become a gentleman and win Estella's heart." "en" 544 4.3
Add-Book "oliver-twist" "Oliver Twist" "Charles Dickens" 1838 730 @("Classic","Realism","Drama") "A workhouse boy escapes to London and joins Fagin's gang of pickpockets." "en" 416 4.2
Add-Book "tale-cities" "A Tale of Two Cities" "Charles Dickens" 1859 98 @("Classic","Drama","History") "A story of love and sacrifice set against the French Revolution." "en" 400 4.3
Add-Book "scarlet-letter" "The Scarlet Letter" "Nathaniel Hawthorne" 1850 253 @("Classic","Drama") "A woman forced to wear a scarlet A for adultery in Puritan New England." "en" 240 4.2
Add-Book "moby-dick" "Moby-Dick" "Herman Melville" 1851 2701 @("Classic","Adventure","Realism") "Captain Ahab's obsessive hunt for the white whale." "en" 544 4.3

Add-Book "treasure-island" "Treasure Island" "Robert Louis Stevenson" 1883 120 @("Adventure","Classic","Children") "Young Jim Hawkins sails in search of pirate treasure." "en" 240 4.3
Add-Book "tom-sawyer" "The Adventures of Tom Sawyer" "Mark Twain" 1876 74 @("Adventure","Children","Classic") "The mischievous Tom Sawyer has adventures along the Mississippi." "en" 224 4.3
Add-Book "huckleberry-finn" "Adventures of Huckleberry Finn" "Mark Twain" 1884 76 @("Adventure","Classic","Satire") "Huck Finn and runaway slave Jim raft down the Mississippi." "en" 304 4.4
Add-Book "call-of-wild" "The Call of the Wild" "Jack London" 1903 215 @("Adventure","Classic","Realism") "Buck the dog transforms from pet to wolf pack leader in the Klondike." "en" 88 4.3
Add-Book "heart-darkness" "Heart of Darkness" "Joseph Conrad" 1899 219 @("Classic","Adventure","Realism") "A journey into the African Congo and the darkness of the human soul." "en" 128 4.0
Add-Book "connecticut-yankee" "A Connecticut Yankee in King Arthur's Court" "Mark Twain" 1889 86 @("SF","Satire","Adventure") "A 19th-century engineer is transported to King Arthur's time." "en" 320 4.0

Add-Book "christmas-carol" "A Christmas Carol" "Charles Dickens" 1843 46 @("Classic","Holiday","Stories") "Scrooge is visited by ghosts who make him reconsider his miserly ways." "en" 80 4.4
Add-Book "metamorphosis" "Metamorphosis" "Franz Kafka" 1915 5200 @("Existential","Classic","Stories") "Gregor Samsa wakes up one morning transformed into a giant insect." "en" 56 4.3
Add-Book "yellow-wallpaper" "The Yellow Wallpaper" "Charlotte Perkins Gilman" 1892 1952 @("Horror","Stories","Feminism") "A woman goes mad confined in a room with yellow wallpaper." "en" 24 4.1
Add-Book "siddhartha" "Siddhartha" "Hermann Hesse" 1922 2500 @("Philosophy","Classic","Spiritual") "A young Brahmin's spiritual journey in the time of the Buddha." "en" 100 4.4
Add-Book "prophet" "The Prophet" "Kahlil Gibran" 1923 0 @("Poetry","Philosophy","Spiritual") "Philosophical essays on love, joy, sorrow and life." "en" 96 4.5
Add-Book "meditations" "Meditations" "Marcus Aurelius" 180 2680 @("Philosophy","Non-fiction","Classic") "The Roman emperor's personal notes on Stoic philosophy." "en" 112 4.4
Add-Book "prince" "The Prince" "Niccolo Machiavelli" 1532 1232 @("Philosophy","Non-fiction","History") "A political treatise on acquiring and maintaining power." "en" 140 4.1
Add-Book "art-of-war" "The Art of War" "Sun Tzu" -500 132 @("Philosophy","Non-fiction","History") "The ancient Chinese treatise on military strategy and tactics." "en" 68 4.4
Add-Book "war-of-worlds" "The War of the Worlds" "H.G. Wells" 1898 36 @("SF","Classic","Invasion") "Martians invade Earth and humanity faces extinction." "en" 192 4.2
Add-Book "time-machine" "The Time Machine" "H.G. Wells" 1895 35 @("SF","Classic","Adventure") "A time traveler journeys to a far future where humanity has split into two species." "en" 84 4.1

Add-Book "crime-punishment" "Crime and Punishment" "Fyodor Dostoevsky" 1866 2554 @("RussianClassic","Novel","Philosophy") "A poor student commits murder and tries to justify it with his theory of the superman." "en" 560 4.7
Add-Book "idiot" "The Idiot" "Fyodor Dostoevsky" 1869 2638 @("RussianClassic","Novel","Philosophy") "Prince Myshkin returns to Russia and confronts the cruelty of society." "en" 576 4.5
Add-Book "brothers" "The Brothers Karamazov" "Fyodor Dostoevsky" 1880 28054 @("RussianClassic","Novel","Philosophy") "Three brothers, a murdered father, and the search for God in Tsarist Russia." "en" 704 4.7
Add-Book "demons" "Demons" "Fyodor Dostoevsky" 1872 27340 @("RussianClassic","Novel","Politics") "A novel about revolutionary ideas and their destructive consequences." "en" 640 4.4
Add-Book "gambler" "The Gambler" "Fyodor Dostoevsky" 1867 64084 @("RussianClassic","Novel","Realism") "A novel about the destructive passion for gambling." "en" 192 4.2
Add-Book "poor-folk" "Poor Folk" "Fyodor Dostoevsky" 1846 19743 @("RussianClassic","Novel","Realism") "Dostoevsky's first novel - an epistolary tale of a poor clerk's tragic love." "en" 128 4.2

Add-Book "war-peace" "War and Peace" "Leo Tolstoy" 1869 2600 @("RussianClassic","Novel","History") "Epic saga of Russian society during the Napoleonic Wars." "en" 1200 4.7
Add-Book "anna-karenina" "Anna Karenina" "Leo Tolstoy" 1878 1399 @("RussianClassic","Novel","Realism") "The tragic love story of a married woman and an officer in high society." "en" 720 4.6
Add-Book "resurrection" "Resurrection" "Leo Tolstoy" 1899 1938 @("RussianClassic","Novel","Realism") "Prince Nekhlyudov tries to atone for his past sin." "en" 480 4.3
Add-Book "death-ivan" "The Death of Ivan Ilyich" "Leo Tolstoy" 1886 3657 @("RussianClassic","Stories","Philosophy") "A man's life is judged in the face of imminent death." "en" 64 4.5

Add-Book "evgeny-onegin" "Eugene Onegin" "Alexander Pushkin" 1833 17034 @("RussianClassic","Poetry","Novel") "A novel in verse about a disillusioned nobleman and Tatiana's tragic love." "en" 224 4.6
Add-Book "dead-souls" "Dead Souls" "Nikolai Gogol" 1842 2701 @("RussianClassic","Satire","Novel") "Chichikov travels Russia buying dead serfs in a get-rich scheme." "en" 320 4.5
Add-Book "hero-time" "A Hero of Our Time" "Mikhail Lermontov" 1840 17458 @("RussianClassic","Novel","Realism") "A psychological novel about Pechorin, the 'superfluous man'." "en" 192 4.4
Add-Book "fathers-sons" "Fathers and Sons" "Ivan Turgenev" 1862 17648 @("RussianClassic","Novel","Realism") "The generational conflict between liberals and nihilists in 1860s Russia." "en" 240 4.3
Add-Book "nose" "The Nose" "Nikolai Gogol" 1836 17379 @("RussianClassic","Satire","Stories") "A surreal tale of a nose that leaves its owner's face." "en" 40 4.1

Add-Book "divine-comedy" "The Divine Comedy" "Dante Alighieri" 1320 8800 @("Poetry","Classic","Epic") "The greatest medieval poem - journey through Hell, Purgatory and Paradise." "en" 720 4.5
Add-Book "sonnets" "Sonnets" "William Shakespeare" 1609 1041 @("Poetry","Classic") "154 sonnets - the pinnacle of English Renaissance lyric poetry." "en" 64 4.4
Add-Book "paradise-lost" "Paradise Lost" "John Milton" 1667 20 @("Poetry","Classic","Epic") "The epic poem of Satan's fall and mankind's temptation." "en" 320 4.3
Add-Book "rubaiyat" "Rubaiyat of Omar Khayyam" "Omar Khayyam" 1120 8525 @("Poetry","Philosophy") "Persian quatrains about life, wine and mortality." "en" 48 4.2
Add-Book "leaves-grass" "Leaves of Grass" "Walt Whitman" 1891 1322 @("Poetry","Classic") "Poems celebrating nature, democracy and the human body." "en" 480 4.3
Add-Book "iliad" "The Iliad" "Homer" -750 6130 @("Poetry","Epic","Classic") "The greatest epic of the Trojan War and the wrath of Achilles." "en" 480 4.5
Add-Book "odyssey" "The Odyssey" "Homer" -750 1727 @("Poetry","Epic","Classic") "Odysseus's ten-year journey home after the Trojan War." "en" 400 4.5

Add-Book "republic" "The Republic" "Plato" -380 1497 @("Philosophy","Classic","Ancient") "A dialogue on justice, the ideal state and the allegory of the cave." "en" 320 4.4
Add-Book "apology" "The Apology of Socrates" "Plato" -399 1656 @("Philosophy","Classic","Ancient") "Socrates' defense speech at his trial - which cost him his life." "en" 48 4.4
Add-Book "symposium" "The Symposium" "Plato" -380 1600 @("Philosophy","Classic","Ancient") "A dialogue on the nature of love told as a drinking party conversation." "en" 64 4.3
Add-Book "nicomachean" "Nicomachean Ethics" "Aristotle" -340 8438 @("Philosophy","Classic","Ancient") "The foundational treatise on ethics, virtue and happiness." "en" 240 4.3
Add-Book "poetics" "Poetics" "Aristotle" -335 1974 @("Philosophy","Classic","Ancient") "The foundational work on the nature of poetry and drama." "en" 64 4.2
Add-Book "leviathan" "Leviathan" "Thomas Hobbes" 1651 3207 @("Philosophy","Politics","Classic") "The classic work on the nature of the state and social contract." "en" 480 4.1
Add-Book "utopia" "Utopia" "Thomas More" 1516 2130 @("Philosophy","Classic") "A description of an ideal society on a fictional island." "en" 128 4.0
Add-Book "beyond-good-evil" "Beyond Good and Evil" "Friedrich Nietzsche" 1886 4363 @("Philosophy","Classic") "A critique of traditional morality and the 'will to power' philosophy." "en" 160 4.2
Add-Book "zarathustra" "Thus Spoke Zarathustra" "Friedrich Nietzsche" 1883 1998 @("Philosophy","Poetry","Classic") "A philosophical poem about Zarathustra who descends from the mountain." "en" 288 4.3
Add-Book "confessions" "Confessions" "Augustine of Hippo" 400 3296 @("Philosophy","Religion","Classic") "The autobiographical confession of one of Christianity's greatest thinkers." "en" 320 4.2

Add-Book "importance-earnest" "The Importance of Being Earnest" "Oscar Wilde" 1895 844 @("Comedy","Classic","Drama") "A trivial comedy for serious people - mistaken identity and witty dialogue." "en" 64 4.4
Add-Book "raven" "The Raven" "Edgar Allan Poe" 1845 17192 @("Poetry","Horror","Classic") "Nevermore - the most famous poem by Edgar Allan Poe." "en" 8 4.5
Add-Book "american-tragedy" "An American Tragedy" "Theodore Dreiser" 1925 53096 @("Realism","Drama","Classic") "A young man's American dream turns into a nightmare of murder." "en" 640 4.1
Add-Book "turn-screw" "The Turn of the Screw" "Henry James" 1898 209 @("Horror","Mystery","Classic") "A young governess suspects the children are possessed by ghosts." "en" 112 4.0
Add-Book "beast-jungle" "The Beast in the Jungle" "Henry James" 1903 26487 @("Drama","Psychology") "A man lives in expectation of a defining event that will change his life." "en" 48 3.9

Write-Host "Manually defined books: $($books.Count)"

$genresEnglish = @("SF","Adventure","Classic","Detective","Horror")
$authors = @(
    @{name = "Jules Verne"; birth = 1828; lang = "en"}
    @{name = "Arthur Conan Doyle"; birth = 1859; lang = "en"}
    @{name = "H.G. Wells"; birth = 1866; lang = "en"}
    @{name = "Edgar Rice Burroughs"; birth = 1875; lang = "en"}
    @{name = "Charles Dickens"; birth = 1812; lang = "en"}
    @{name = "Mark Twain"; birth = 1835; lang = "en"}
    @{name = "Robert Louis Stevenson"; birth = 1850; lang = "en"}
    @{name = "Bram Stoker"; birth = 1847; lang = "en"}
    @{name = "Jack London"; birth = 1876; lang = "en"}
    @{name = "Henry James"; birth = 1843; lang = "en"}
)

$numberWords = @("Secret","Mysterious","Great","Lost","Last","Dark","Strange","Wonderful","Incredible","Amazing","Hidden","Forgotten","Silver","Golden","Crimson","Sapphire","Midnight","Shadow","Crystal","Storm","Thunder","Iron","Bronze","Steel","Copper")
$nouns = @("Island","City","Valley","Mountain","River","Forest","Temple","Treasure","Legacy","Crown","Sword","Throne","Kingdom","Empire","Castle","Tower","Gateway","Portal","Journey","Quest","Mission","Adventure","Expedition","Discovery","World","Star","Planet","Moon","Comet","Galaxy","Horizon","Mystery","Secret","Legend","Prophecy","Curse","Crystal","Amulet","Ring")
$adjs = @("Ancient","Eternal","Forbidden","Sacred","Cursed","Haunted","Enchanted","Mystic","Fantastic","Extraordinary","Ultimate","Supreme","Royal","Imperial","Divine","Dark","Hidden","Silver","Golden","Crimson")

$existingTitles = @{}
foreach ($b in $books) { $existingTitles[$b.title.ToLower()] = $true }

$rng = [Random]::new(42)
$startId = 50000
$generated = 0
$maxGen = 1600

while ($generated -lt $maxGen) {
    $author = $authors[$rng.Next(0, $authors.Count)]
    $w1 = if ($rng.Next(0,3) -eq 0) { $adjs[$rng.Next(0,$adjs.Count)] } else { $numberWords[$rng.Next(0,$numberWords.Count)] }
    $w2 = $nouns[$rng.Next(0,$nouns.Count)]
    $prefix = if ($rng.Next(0,3) -ne 2) { "The " } else { "" }
    $title = $prefix + $w1 + " " + $w2

    if ($existingTitles.ContainsKey($title.ToLower())) { continue }
    $existingTitles[$title.ToLower()] = $true

    $gc = [Math]::Max(1, $rng.Next(1,4))
    $g = @()
    for ($j = 0; $j -lt $gc; $j++) {
        $gg = $genresEnglish[$rng.Next(0,$genresEnglish.Count)]
        if ($g -notcontains $gg) { $g += $gg }
    }

    $gid = $rng.Next(1000, 55000)
    $y = [Math]::Max(1800, $author.birth + 20 + $rng.Next(0, 55))
    $p = $rng.Next(40, 400)
    $r = [Math]::Round(3.5 + $rng.NextDouble() * 1.2, 1)
    $dw = @("Remarkable","Extraordinary","Fascinating","Captivating","Thrilling","Spellbinding","Breathtaking","Exciting")
    $da = @("set out on","embark on","find themselves in","discover","uncover","pursue","seek","confront")
    $dn = @("a perilous journey","an incredible adventure","a mysterious quest","a dangerous mission","an ancient secret","a forgotten treasure","a dark conspiracy","a supernatural mystery")
    $desc = "In this $($dw[$rng.Next(0,$dw.Count)]) tale, brave heroes $($da[$rng.Next(0,$da.Count)]) $($dn[$rng.Next(0,$dn.Count)]) that will change their world forever."

    $id = "gen-$($startId + $generated)"
    $generated++

    $books += @{
        id = $id
        title = $title
        author = $author.name
        year = $y
        gutenberg = $gid
        genres = $g + @()
        description = $desc
        language = $author.lang
        pages = $p
        rating = $r
    }
}

$genreMap = @{
    "SF" = "SF_RU"
    "Fantasy" = "FANTASY_RU"
    "Horror" = "HORROR_RU"
    "Classic" = "CLASSIC_RU"
    "Detective" = "DETECTIVE_RU"
    "Adventure" = "ADVENTURE_RU"
    "Philosophy" = "PHILOSOPHY_RU"
    "Romance" = "ROMANCE_RU"
    "Poetry" = "POETRY_RU"
    "Satire" = "SATIRE_RU"
    "Drama" = "DRAMA_RU"
    "Realism" = "REALISM_RU"
    "Non-fiction" = "NONFICTION_RU"
    "Mystery" = "MYSTERY_RU"
    "Gothic" = "GOTHIC_RU"
    "Children" = "CHILDREN_RU"
    "History" = "HISTORY_RU"
    "Stories" = "STORIES_RU"
    "Novel" = "NOVEL_RU"
    "Spiritual" = "SPIRITUAL_RU"
    "Existential" = "EXISTENTIAL_RU"
    "Dystopia" = "DYSTOPIA_RU"
    "Holiday" = "HOLIDAY_RU"
    "Comedy" = "COMEDY_RU"
    "Epic" = "EPIC_RU"
    "Psychology" = "PSYCHOLOGY_RU"
    "Politics" = "POLITICS_RU"
    "RussianClassic" = "RUSSIANCLASSIC_RU"
    "Invasion" = "INVASION_RU"
    "Folk" = "FOLK_RU"
    "Feminism" = "FEMINISM_RU"
    "Science" = "SCIENCE_RU"
    "Stoicism" = "STOICISM_RU"
    "Ancient" = "ANCIENT_RU"
    "Religion" = "RELIGION_RU"
    "Autobiography" = "AUTOBIOGRAPHY_RU"
}

foreach ($b in $books) {
    $b.genres = $b.genres | ForEach-Object {
        if ($genreMap.ContainsKey($_)) { $genreMap[$_] } else { $_ }
    }
}

# Convert placeholder names to actual Russian using ordinal byte arrays
$json = $books | ConvertTo-Json -Depth 10

# Replace Russian placeholders with actual Cyrillic
$replacements = @(
    @("SF_RU", "Научная фантастика"),
    @("FANTASY_RU", "Фэнтези"),
    @("HORROR_RU", "Ужасы"),
    @("CLASSIC_RU", "Классика"),
    @("DETECTIVE_RU", "Детектив"),
    @("ADVENTURE_RU", "Приключения"),
    @("PHILOSOPHY_RU", "Философия"),
    @("ROMANCE_RU", "Романтика"),
    @("POETRY_RU", "Поэзия"),
    @("SATIRE_RU", "Сатира"),
    @("DRAMA_RU", "Драма"),
    @("REALISM_RU", "Реализм"),
    @("NONFICTION_RU", "Нон-фикшн"),
    @("MYSTERY_RU", "Мистика"),
    @("GOTHIC_RU", "Готика"),
    @("CHILDREN_RU", "Детская"),
    @("HISTORY_RU", "История"),
    @("STORIES_RU", "Рассказы"),
    @("NOVEL_RU", "Роман"),
    @("SPIRITUAL_RU", "Духовное"),
    @("EXISTENTIAL_RU", "Экзистенциализм"),
    @("DYSTOPIA_RU", "Антиутопия"),
    @("HOLIDAY_RU", "Рождественская"),
    @("COMEDY_RU", "Комедия"),
    @("EPIC_RU", "Эпос"),
    @("PSYCHOLOGY_RU", "Психология"),
    @("POLITICS_RU", "Политика"),
    @("RUSSIANCLASSIC_RU", "Русская классика"),
    @("INVASION_RU", "Фантастика"),
    @("FOLK_RU", "Фольклор"),
    @("FEMINISM_RU", "Феминизм"),
    @("SCIENCE_RU", "Наука"),
    @("STOICISM_RU", "Стоицизм"),
    @("ANCIENT_RU", "Античность"),
    @("RELIGION_RU", "Религия"),
    @("AUTOBIOGRAPHY_RU", "Автобиография")
)

foreach ($r in $replacements) {
    $json = $json -replace $r[0], $r[1]
}

# Fix PS 5.1 single-element array bug
$json = [System.Text.RegularExpressions.Regex]::Replace($json, '"genres":\s+"([^"]+)"', '"genres": ["$1"]')

$outputFull = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot $OutputPath))
[System.IO.File]::WriteAllText($outputFull, $json, [System.Text.UTF8Encoding]::new($false))

$finalCount = ($books | ConvertFrom-Json).Count
Write-Host "Done! Generated $($books.Count) books -> $outputFull ($([Math]::Round((Get-Item $outputFull).Length/1KB)) KB)"

# Verify no null fields in the output
$test = Get-Content $outputFull -Encoding UTF8 | ConvertFrom-Json
$nullRating = $test | Where-Object { $null -eq $_.rating }
$stringGenres = $test | Where-Object { $_.genres -is [string] }
if ($nullRating) { Write-Host "WARNING: $($nullRating.Count) books with null rating!" -ForegroundColor Red }
if ($stringGenres) { Write-Host "WARNING: $($stringGenres.Count) books with string genres!" -ForegroundColor Red }
if (-not $nullRating -and -not $stringGenres) { Write-Host "ALL DATA VALID" -ForegroundColor Green }
