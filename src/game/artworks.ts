// Teacher-editable game data: artworks, labels, themes, scoring and feedback.
export type Movement = "S" | "I";

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  movement: Movement;
  reference: string;
  feature: string;
  label: string;
  feedback: string;
  /** Default image URL. null = must be supplied by the teacher (copyright-protected work). */
  defaultImage: string | null;
  credit: string;
}

const commons = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1200`;

export const MOVEMENT_NAMES: Record<Movement, string> = { S: "Surrealism", I: "Impressionism" };

export const ARTWORKS: Artwork[] = [
  {
    id: "S1", title: "The Persistence of Memory", artist: "Salvador Dalí", year: 1931, movement: "S",
    reference: "https://www.moma.org/collection/works/79018",
    feature: "Melting clocks across a strange, silent landscape.",
    label: "Soft clocks appear in an impossible landscape, challenging our ordinary understanding of time.",
    feedback: "Melting clocks are impossible in real life — a classic example of dream logic.",
    defaultImage: null, credit: "The Museum of Modern Art, New York. © Salvador Dalí, Fundació Gala-Salvador Dalí.",
  },
  {
    id: "S2", title: "The Menaced Assassin", artist: "René Magritte", year: 1927, movement: "S",
    reference: "https://www.moma.org/collection/works/79267",
    feature: "A mysterious interior scene with strangely arranged characters and an unsettling narrative.",
    label: "An apparently ordinary room becomes an unsettling, mysterious scene that follows dreamlike logic.",
    feedback: "Magritte makes ordinary things feel strange — the story makes no logical sense, like a dream.",
    defaultImage: null, credit: "The Museum of Modern Art, New York. © C. Herscovici / Magritte estate.",
  },
  {
    id: "S3", title: "Celebes", artist: "Max Ernst", year: 1921, movement: "S",
    reference: "https://www.tate.org.uk/art/artworks/ernst-celebes-t01988",
    feature: "An enormous mechanical, elephant-like creature in an unusual setting.",
    label: "An impossible machine-like creature combines familiar and unfamiliar forms in a dreamlike world.",
    feedback: "Combining an animal with a machine creates an unexpected, impossible reality.",
    defaultImage: null, credit: "Tate, London. © Max Ernst estate.",
  },
  {
    id: "S4", title: "The Birth of the World", artist: "Joan Miró", year: 1925, movement: "S",
    reference: "https://www.moma.org/collection/works/79321",
    feature: "Floating shapes, expressive marks, and unexpected combinations.",
    label: "Unexpected shapes and spontaneous-looking paint effects reflect imagination and unconscious creative processes.",
    feedback: "Miró used spontaneous, 'automatic' techniques to let the unconscious mind guide the painting.",
    defaultImage: null, credit: "The Museum of Modern Art, New York. © Successió Miró.",
  },
  {
    id: "S5", title: "Green Tea", artist: "Leonora Carrington", year: 1942, movement: "S",
    reference: "https://www.moma.org/collection/works/297568",
    feature: "A strange human-like figure, a white horse, and a symbolic, unsettling landscape.",
    label: "Unusual figures and symbolic imagery create a mysterious scene suggesting inner experiences and dreams.",
    feedback: "Carrington's symbolic figures express inner experiences — a key Surrealist idea.",
    defaultImage: null, credit: "The Museum of Modern Art, New York. © Estate of Leonora Carrington.",
  },
  {
    id: "I1", title: "Impression, Sunrise", artist: "Claude Monet", year: 1872, movement: "I",
    reference: "https://www.nga.gov/stories/articles/what-impressionism-4-things-know",
    feature: "An orange sun, a hazy harbor, and reflections across water.",
    label: "Loose brushstrokes, soft colors, and reflected sunlight capture a brief atmospheric moment.",
    feedback: "This painting gave Impressionism its name: a quick impression of light on water.",
    defaultImage: commons("Monet - Impression, Sunrise.jpg"),
    credit: "Musée Marmottan Monet, Paris. Public domain, via Wikimedia Commons.",
  },
  {
    id: "I2", title: "Dance at Le Moulin de la Galette", artist: "Pierre-Auguste Renoir", year: 1876, movement: "I",
    reference: "https://www.musee-orsay.fr/en/artworks/bal-du-moulin-de-la-galette-497",
    feature: "People dancing and socializing beneath changing patches of light.",
    label: "A lively everyday gathering is represented through bright colors, visible brushstrokes, and shifting light.",
    feedback: "Look at the spots of sunlight through the trees — everyday leisure in changing light.",
    defaultImage: commons("Pierre-Auguste Renoir, Le Moulin de la Galette.jpg"),
    credit: "Musée d'Orsay, Paris. Public domain, via Wikimedia Commons.",
  },
  {
    id: "I3", title: "The Cradle", artist: "Berthe Morisot", year: 1872, movement: "I",
    reference: "https://www.musee-orsay.fr/en/artworks/le-berceau-1132",
    feature: "A woman quietly watching a sleeping baby.",
    label: "A quiet moment of everyday family life is captured with delicate details and soft visual effects.",
    feedback: "Morisot captured private, everyday moments with soft, delicate brushwork.",
    defaultImage: commons("Berthe Morisot - The Cradle - Google Art Project.jpg"),
    credit: "Musée d'Orsay, Paris. Public domain, via Wikimedia Commons.",
  },
  {
    id: "I4", title: "Boulevard des Italiens, Morning, Sunlight", artist: "Camille Pissarro", year: 1897, movement: "I",
    reference: "https://www.nga.gov/artworks/46673-boulevard-des-italiens-morning-sunlight",
    feature: "A busy Paris street seen from above, with pedestrians, carriages, and daylight.",
    label: "Quick brushstrokes capture the movement of city life and the changing effects of morning sunlight.",
    feedback: "Pissarro painted the same street at different times of day to study changing light.",
    defaultImage: commons("Camille Pissarro, Boulevard des Italiens, Morning, Sunlight, 1897, NGA 46673.jpg"),
    credit: "National Gallery of Art, Washington. Public domain (NGA Open Access).",
  },
  {
    id: "I5", title: "The Bridge at Villeneuve-la-Garenne", artist: "Alfred Sisley", year: 1872, movement: "I",
    reference: "https://www.metmuseum.org/art/collection/search/437680",
    feature: "A bridge above a river, people enjoying the outdoors, and sunlight reflected on the water.",
    label: "Outdoor scenery and colorful brushstrokes capture natural light and a passing moment along the river.",
    feedback: "Painted outdoors, it shows reflections on water — a favourite Impressionist subject.",
    defaultImage: commons("The Bridge at Villeneuve-la-Garenne MET DT1040.jpg"),
    credit: "The Metropolitan Museum of Art, New York. Public domain (Met Open Access).",
  },
];

export interface ThemeOption { id: string; text: string; correct: boolean }

export const THEMES: Record<Movement, { question: string; options: ThemeOption[] }> = {
  S: {
    question: "Which exhibition statement best explains the purpose of Surrealism?",
    options: [
      { id: "SA", correct: true, text: "Beyond Reality: Exploring dreams, imagination, and the unconscious mind through strange and unexpected visual combinations." },
      { id: "SB", correct: false, text: "Capturing the Moment: Recording natural light and familiar scenes from everyday life." },
      { id: "SC", correct: false, text: "Perfect Representations: Recreating the physical world through exact details and traditional rules." },
    ],
  },
  I: {
    question: "Which exhibition statement best explains the purpose of Impressionism?",
    options: [
      { id: "IA", correct: false, text: "Unconscious Worlds: Creating mysterious dream environments where impossible events feel real." },
      { id: "IB", correct: true, text: "Moments of Light: Capturing everyday experiences through changing sunlight, expressive brushstrokes, and vibrant color." },
      { id: "IC", correct: false, text: "Historical Perfection: Reconstructing ancient events through detailed and carefully controlled paintings." },
    ],
  },
};

export const POINTS = { placement: 5, label: 3, theme: 10 };

export interface Verdict { min: number; tier: string; headline: string; message: string; tone: "gold" | "silver" | "bronze" | "reno" }

export const VERDICTS: Verdict[] = [
  { min: 90, tier: "SOLD-OUT OPENING!", headline: "YOUR GALLERY IS A HIT!", tone: "gold",
    message: "Outstanding work, Curator! Your exhibition has impressed visitors and art critics alike. You have shown an excellent understanding of Surrealism and Impressionism. The museum is proud to have you leading its collection!" },
  { min: 75, tier: "CROWD FAVORITE!", headline: "A STRONG EXHIBITION!", tone: "silver",
    message: "Congratulations, Curator! Your exhibition has received excellent feedback. Most artworks were displayed and explained successfully. A few curatorial decisions could be improved, but your museum is attracting attention!" },
  { min: 60, tier: "MIXED REVIEWS!", headline: "YOUR GALLERY HAS POTENTIAL!", tone: "bronze",
    message: "Your exhibition has some great ideas, but a few paintings and descriptions need another look. The critics noticed some inconsistencies between the galleries. Review the artistic characteristics and prepare for an even better opening!" },
  { min: 0, tier: "BACK TO THE CURATOR'S DESK!", headline: "TIME TO REORGANIZE!", tone: "reno",
    message: "The museum's opening has received some unexpected reviews! Several artworks may be in the wrong rooms or have incorrect descriptions. Every curator needs practice. Review the collections, learn from your decisions, and try again!" },
];

export const FEEDBACK = {
  placement: "Review the differences between imaginary dreamscapes and everyday scenes.",
  label: "Take another look at how artists use symbolism, light, brushstrokes, and perception.",
  theme: "Review the main goals behind Surrealism and Impressionism.",
  excellent: "You successfully connected artistic movements with the visual characteristics of their paintings.",
};
