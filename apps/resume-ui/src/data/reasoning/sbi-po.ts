import { createBank, type QuestionInput } from './types'

/**
 * SBI PO (Prelims) Reasoning bank.
 *
 * Pattern-based questions written for SBI PO Prelims practice — puzzle-heavy and
 * more multi-step than the CHSL set. None of these is an actual paper question.
 */
const rows: QuestionInput[] = [
  // ── Analogy ────────────────────────────────────────────────────────────────
  {
    id: 'sbi-01',
    topic: 'Analogy',
    difficulty: 'moderate',
    questionText: '16 : 256 :: 9 : ?',
    options: ['72', '81', '90', '99'],
    correctOption: 'B',
    explanation: '16² = 256, so the second number is the square of the first: 9² = 81.',
    pattern: 'SBI PO Prelims analogy',
  },
  {
    id: 'sbi-02',
    topic: 'Analogy',
    difficulty: 'easy',
    questionText: 'Cup : Saucer :: Needle : ?',
    options: ['Sharp', 'Thread', 'Cloth', 'Pin'],
    correctOption: 'B',
    explanation: 'A saucer is the accessory used along with a cup, just as thread is used along with a needle.',
    pattern: 'SBI PO Prelims analogy',
  },
  {
    id: 'sbi-03',
    topic: 'Analogy',
    difficulty: 'moderate',
    questionText: 'Doctor : Stethoscope :: Carpenter : ?',
    options: ['Wood', 'Saw', 'Nail', 'Hammer'],
    correctOption: 'B',
    explanation: 'A stethoscope is the characteristic tool of a doctor; a saw is the characteristic tool of a carpenter.',
    pattern: 'IBPS-style analogy reused for SBI PO practice',
  },

  // ── Classification ─────────────────────────────────────────────────────────
  {
    id: 'sbi-04',
    topic: 'Classification',
    difficulty: 'moderate',
    questionText: 'Find the odd one out: 27, 64, 125, 100',
    options: ['27', '64', '125', '100'],
    correctOption: 'D',
    explanation: '27 = 3³, 64 = 4³ and 125 = 5³ are perfect cubes; 100 is not a perfect cube.',
    pattern: 'SBI PO Prelims odd-one-out',
  },
  {
    id: 'sbi-05',
    topic: 'Classification',
    difficulty: 'difficult',
    questionText: 'Find the odd one out: ADG, JMP, SVZ, BEH',
    options: ['ADG', 'JMP', 'SVZ', 'BEH'],
    correctOption: 'C',
    explanation:
      'In ADG, JMP and BEH every letter moves three steps forward (A→D→G, J→M→P, B→E→H). In SVZ the last step is +4 (V→Z), so SVZ is the odd group.',
    pattern: 'SBI PO Prelims letter classification',
  },

  // ── Series ─────────────────────────────────────────────────────────────────
  {
    id: 'sbi-06',
    topic: 'Series',
    difficulty: 'moderate',
    questionText: 'Find the wrong term: 3, 7, 15, 31, 62, 127',
    options: ['15', '31', '62', '127'],
    correctOption: 'C',
    explanation: 'Every term is (previous × 2) + 1: 3 → 7 → 15 → 31 → 63 → 127, so 62 should be 63.',
    pattern: 'SBI PO Prelims wrong-term series',
  },
  {
    id: 'sbi-07',
    topic: 'Series',
    difficulty: 'difficult',
    questionText: 'Find the next term: 5, 6, 14, 45, 184, ?',
    options: ['920', '925', '930', '915'],
    correctOption: 'B',
    explanation: 'The pattern is ×1 + 1, ×2 + 2, ×3 + 3, ×4 + 4, so the next term is 184 × 5 + 5 = 925.',
    pattern: 'SBI PO Prelims number series',
  },
  {
    id: 'sbi-08',
    topic: 'Series',
    difficulty: 'difficult',
    questionText: 'Find the next term: 2, 12, 36, 80, 150, ?',
    options: ['240', '252', '264', '272'],
    correctOption: 'B',
    explanation: 'Each term is n³ + n²: 1+1=2, 8+4=12, 27+9=36, 64+16=80, 125+25=150, so the next is 216 + 36 = 252.',
    pattern: 'SBI PO Prelims number series',
  },

  // ── Coding-Decoding ────────────────────────────────────────────────────────
  {
    id: 'sbi-09',
    topic: 'Coding-Decoding',
    difficulty: 'moderate',
    questionText: 'If ZEBRA is coded as 2652181, how is TIGER coded?',
    options: ['2097518', '2097519', '20975108', '2997518'],
    correctOption: 'A',
    explanation:
      'Each letter is replaced by its alphabet position: Z=26, E=5, B=2, R=18, A=1. So T(20) I(9) G(7) E(5) R(18) → 2097518.',
    pattern: 'SBI PO Prelims coding-decoding',
  },
  {
    id: 'sbi-10',
    topic: 'Coding-Decoding',
    difficulty: 'difficult',
    questionText:
      "In a certain code, 'come home now' is written as 'ta pa re', 'home is sweet' as 're ka mi' and 'now or never' as 'pa zo ni'. What is the code for 'come'?",
    options: ['ta', 'pa', 're', 'ka'],
    correctOption: 'A',
    explanation:
      "Comparing sentences 1 and 2, 're' = home. Comparing sentences 1 and 3, 'pa' = now. The remaining word of sentence 1, 'come', is therefore 'ta'.",
    pattern: 'SBI PO Prelims coded language',
  },
  {
    id: 'sbi-11',
    topic: 'Coding-Decoding',
    difficulty: 'moderate',
    questionText:
      'If every vowel of the word COMPUTER is replaced by the next letter of the alphabet and every consonant by the previous letter, what is the resulting word?',
    options: ['BPLOVSFQ', 'BPLOUSFQ', 'BPKOVSFQ', 'BQLOVSFQ'],
    correctOption: 'A',
    explanation:
      'C→B, O(vowel)→P, M→L, P→O, U(vowel)→V, T→S, E(vowel)→F, R→Q, giving BPLOVSFQ.',
    pattern: 'SBI PO Prelims coding-decoding',
  },

  // ── Blood Relations ────────────────────────────────────────────────────────
  {
    id: 'sbi-12',
    topic: 'Blood Relations',
    difficulty: 'moderate',
    questionText: 'P is the father of Q. Q is the sister of R. R is the son of S. How is P related to S?',
    options: ['Brother', 'Husband', 'Father', 'Son'],
    correctOption: 'B',
    explanation:
      'P is the father of both Q and R, and R is the son of S, so S is the mother of Q and R — making P the husband of S.',
    pattern: 'SBI PO Prelims blood relations',
  },
  {
    id: 'sbi-13',
    topic: 'Blood Relations',
    difficulty: 'difficult',
    questionText:
      'Introducing a woman, a man said, "Her mother is the only daughter of my mother." How is the woman related to the man?',
    options: ['Daughter', 'Niece', 'Sister', 'Cousin'],
    correctOption: 'B',
    explanation:
      "The only daughter of the man's mother is the man's sister, so the woman is the daughter of his sister — his niece.",
    pattern: 'SBI PO Prelims blood relations',
  },

  // ── Direction Sense ────────────────────────────────────────────────────────
  {
    id: 'sbi-14',
    topic: 'Direction Sense',
    difficulty: 'difficult',
    questionText:
      'A man walks 4 km north, turns right and walks 3 km, turns right and walks 4 km, then turns left and walks 5 km. How far is he from the starting point and in which direction?',
    options: ['8 km, east', '8 km, west', '5 km, east', '3 km, east'],
    correctOption: 'A',
    explanation:
      'North 4 km, east 3 km, south 4 km and then east 5 km leaves a net displacement of 3 + 5 = 8 km towards the east.',
    pattern: 'SBI PO Prelims direction sense',
  },
  {
    id: 'sbi-15',
    topic: 'Direction Sense',
    difficulty: 'moderate',
    questionText:
      'Pinky walks 10 m south, turns left and walks 10 m, then turns left again and walks 10 m. Which direction is she facing now and where is she with respect to the start?',
    options: [
      'Facing north, 10 m east of the start',
      'Facing east, 10 m south of the start',
      'Facing north, 10 m west of the start',
      'Facing south, 10 m east of the start',
    ],
    correctOption: 'A',
    explanation:
      'After south → left is east → left is north. The southward and northward 10 m walks cancel, leaving her 10 m east of the start and facing north.',
    pattern: 'SBI PO Prelims direction sense',
  },

  // ── Ranking ────────────────────────────────────────────────────────────────
  {
    id: 'sbi-16',
    topic: 'Ranking',
    difficulty: 'moderate',
    questionText:
      'In a row of 60 students, A is 20th from the left end and B is 25th from the right end. How many students are between A and B?',
    options: ['14', '15', '16', '17'],
    correctOption: 'B',
    explanation: "B's position from the left = 60 − 25 + 1 = 36, so students between A (20) and B (36) = 36 − 20 − 1 = 15.",
    pattern: 'SBI PO Prelims ranking',
  },
  {
    id: 'sbi-17',
    topic: 'Ranking',
    difficulty: 'easy',
    questionText: 'In a class, Anil is 7th from the top and 26th from the bottom. How many students are there in the class?',
    options: ['32', '33', '31', '34'],
    correctOption: 'A',
    explanation: 'Total = rank from top + rank from bottom − 1 = 7 + 26 − 1 = 32.',
    pattern: 'SBI PO Prelims ranking',
  },

  // ── Syllogism ──────────────────────────────────────────────────────────────
  {
    id: 'sbi-18',
    topic: 'Syllogism',
    difficulty: 'moderate',
    questionText:
      'Statements: All windows are doors. No door is a wall.\nConclusions: I. No window is a wall. II. Some doors are windows.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'C',
    explanation:
      'Windows are doors and no door is a wall, so no window is a wall (I follows). "All windows are doors" also converts to "some doors are windows" (II follows).',
    pattern: 'SBI PO Prelims syllogism',
  },
  {
    id: 'sbi-19',
    topic: 'Syllogism',
    difficulty: 'difficult',
    questionText:
      'Statements: Some tablets are medicines. All medicines are capsules. No capsule is a syrup.\nConclusions: I. Some tablets are capsules. II. Some tablets are not syrups.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'C',
    explanation:
      'The tablets that are medicines are capsules (I). Those same tablets are capsules and no capsule is a syrup, so some tablets are definitely not syrups (II).',
    pattern: 'SBI PO Prelims syllogism',
  },

  // ── Inequality ─────────────────────────────────────────────────────────────
  {
    id: 'sbi-20',
    topic: 'Inequality',
    difficulty: 'moderate',
    questionText: 'Statements: M ≥ N > O = P ≥ Q. Conclusions: I. M > P. II. Q ≤ N.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'C',
    explanation: 'M ≥ N > O = P gives M > P (I). Also Q ≤ P = O < N, so Q ≤ N (II).',
    pattern: 'SBI PO Prelims inequality',
  },
  {
    id: 'sbi-21',
    topic: 'Inequality',
    difficulty: 'moderate',
    questionText: 'Statements: E < F ≤ G = H; I ≥ H. Conclusions: I. E < I. II. F ≤ I.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'C',
    explanation: 'Chaining gives E < F ≤ G = H ≤ I, so both E < I and F ≤ I follow.',
    pattern: 'SBI PO Prelims inequality',
  },

  // ── Seating Arrangement ────────────────────────────────────────────────────
  {
    id: 'sbi-22',
    topic: 'Seating Arrangement',
    subtopic: 'Circular',
    difficulty: 'difficult',
    questionText:
      'Six persons P, Q, R, S, T and U sit around a circular table, all facing the centre. P sits opposite S and Q sits to the immediate right of P. R sits opposite Q and T sits to the immediate left of S. Who sits opposite T?',
    options: ['P', 'Q', 'R', 'U'],
    correctOption: 'D',
    explanation:
      'Using P and S opposite, Q immediately right of P and T immediately left of S, only U remains and it falls directly opposite T.',
    pattern: 'SBI PO Prelims circular seating',
  },
  {
    id: 'sbi-23',
    topic: 'Seating Arrangement',
    subtopic: 'Linear row',
    difficulty: 'difficult',
    questionText:
      'Eight persons A, B, C, D, E, F, G and H sit in a row facing north. A sits fourth from the left end and B sits immediately right of A. F sits second to the right of A. Three persons sit between B and C. E sits at the extreme right end. D sits immediately left of H. Who sits at the extreme left end?',
    options: ['A', 'C', 'D', 'G'],
    correctOption: 'B',
    explanation:
      'Positions 1–8: C = 1, A = 4, B = 5, F = 6, E = 8, then D = 2 and H = 3 with G = 7. The extreme left end is C.',
    pattern: 'SBI PO Prelims linear seating',
  },
  {
    id: 'sbi-24',
    topic: 'Seating Arrangement',
    subtopic: 'Linear row',
    difficulty: 'moderate',
    questionText:
      'Five people A, B, C, D and E sit in a row facing north. C sits at the extreme left end and E sits second to the right of C. A sits adjacent to E and D sits at the extreme right end. Who sits in the middle of the row?',
    options: ['A', 'B', 'C', 'E'],
    correctOption: 'D',
    explanation:
      'C = 1, E = 3 and D = 5. A occupies either position 2 or 4, leaving B in the other, but position 3 — the middle — is always E.',
    pattern: 'SBI PO Prelims linear seating',
  },

  // ── Floor Puzzle ───────────────────────────────────────────────────────────
  {
    id: 'sbi-25',
    topic: 'Floor Puzzle',
    difficulty: 'difficult',
    questionText:
      'Eight persons A, B, C, D, E, F, G and H live on eight floors of a building, floors 1 (lowest) to 8 (highest). A lives on floor 4 and D lives on floor 1. E lives on the topmost floor and F lives immediately below E. Three persons live between B and G, and G lives above A. C lives immediately below G. On which floor does H live?',
    options: ['2', '3', '5', '6'],
    correctOption: 'B',
    explanation:
      'E = 8, F = 7, A = 4, D = 1. Three floors between B and G with G above A and C immediately below G forces G = 6, C = 5, B = 2. The only floor left for H is 3.',
    pattern: 'SBI PO Prelims floor puzzle',
  },
  {
    id: 'sbi-26',
    topic: 'Floor Puzzle',
    difficulty: 'moderate',
    questionText:
      'Five persons P, Q, R, S and T live on five floors of a building, floors 1 (lowest) to 5 (highest). P lives on floor 3 and T lives immediately above P. Q lives on floor 1. R lives above T. Who lives on floor 4?',
    options: ['P', 'Q', 'R', 'T'],
    correctOption: 'D',
    explanation: 'P = 3 and T immediately above P gives T = 4. R takes floor 5 and S floor 2.',
    pattern: 'SBI PO Prelims floor puzzle',
  },

  // ── Box Puzzle ─────────────────────────────────────────────────────────────
  {
    id: 'sbi-27',
    topic: 'Box Puzzle',
    difficulty: 'difficult',
    questionText:
      'Seven boxes A, B, C, D, E, F and G are placed one above another (position 1 is the bottom). A is at the 3rd position from the bottom, D is at the top and E is immediately below D. F is immediately above A. Two boxes are between B and G, and C is immediately below B. Which box is at the 2nd position from the top?',
    options: ['E', 'G', 'B', 'F'],
    correctOption: 'A',
    explanation:
      'D = 7, E = 6, A = 3, F = 4. Two boxes between B and G can only be the pair (2, 5); C immediately below B forces B = 2 and C = 1, so G = 5. Position 6, the second from the top, is E.',
    pattern: 'SBI PO Prelims box puzzle',
  },
  {
    id: 'sbi-28',
    topic: 'Box Puzzle',
    difficulty: 'moderate',
    questionText:
      'Six boxes P, Q, R, S, T and U are stacked one above another (position 1 is the bottom). P is immediately above S. T is at the top and two boxes are between Q and T. R is at the bottom. Which box is immediately above R?',
    options: ['P', 'Q', 'U', 'S'],
    correctOption: 'C',
    explanation: 'T = 6, Q = 3, R = 1, and P immediately above S gives P = 5, S = 4, leaving U = 2 immediately above R.',
    pattern: 'SBI PO Prelims box puzzle',
  },

  // ── Scheduling ─────────────────────────────────────────────────────────────
  {
    id: 'sbi-29',
    topic: 'Scheduling',
    difficulty: 'difficult',
    questionText:
      'Seven presentations A, B, C, D, E, F and G are scheduled on seven consecutive days, the 1st to the 7th, one per day. A is on the 3rd and D is on the 1st. Two presentations are held between A and B, where B is after A, and C is immediately after B. F is immediately before E. Which presentation is scheduled on the 2nd?',
    options: ['E', 'F', 'G', 'A'],
    correctOption: 'C',
    explanation:
      'D = 1, A = 3, B = 6, C = 7. F immediately before E must be the pair (4, 5), so the only remaining day, the 2nd, belongs to G.',
    pattern: 'SBI PO Prelims scheduling puzzle',
  },
  {
    id: 'sbi-30',
    topic: 'Scheduling',
    difficulty: 'moderate',
    questionText:
      'Five meetings P, Q, R, S and T are held on five consecutive days, Monday to Friday, one per day. P is on Monday and T is on Friday. S is held on Thursday and R is held immediately after Q. Which meeting is held on Tuesday?',
    options: ['P', 'Q', 'R', 'S'],
    correctOption: 'B',
    explanation:
      'Monday and Friday are fixed, and Thursday is S, so R immediately after Q must be the pair (Tuesday, Wednesday). Tuesday therefore has Q.',
    pattern: 'SBI PO Prelims scheduling puzzle',
  },

  // ── Input-Output ───────────────────────────────────────────────────────────
  {
    id: 'sbi-31',
    topic: 'Input-Output',
    difficulty: 'difficult',
    questionText:
      'A machine rearranges a line of numbers in descending order, fixing one more number in its final position at every step. Input: 34 78 12 56 90 → Step I: 90 34 78 12 56 → Step II: 90 78 34 12 56 → Step III: 90 78 56 34 12. For the input 23 89 10 67 45, what is Step III?',
    options: ['89 67 45 23 10', '89 67 23 45 10', '89 67 45 10 23', '89 45 67 23 10'],
    correctOption: 'A',
    explanation: 'Step I: 89 23 10 67 45. Step II: 89 67 23 10 45. Step III fixes 45: 89 67 45 23 10.',
    pattern: 'SBI PO Prelims input-output',
  },
  {
    id: 'sbi-32',
    topic: 'Input-Output',
    difficulty: 'moderate',
    questionText:
      'A word arrangement machine rearranges a line of words in reverse alphabetical order, fixing one word per step. Input: apple mango kiwi banana → Step I: mango apple kiwi banana → Step II: mango kiwi apple banana. For the input "fig guava cherry pear", what is Step II?',
    options: ['pear guava fig cherry', 'pear fig cherry guava', 'guava pear fig cherry', 'pear guava cherry fig'],
    correctOption: 'A',
    explanation:
      'Reverse alphabetical order is pear > guava > fig > cherry. Step I: pear fig guava cherry. Step II: pear guava fig cherry.',
    pattern: 'SBI PO Prelims input-output',
  },

  // ── Data Sufficiency ───────────────────────────────────────────────────────
  {
    id: 'sbi-33',
    topic: 'Data Sufficiency',
    difficulty: 'moderate',
    questionText:
      'Question: How many students are there in the class?\nI. Ravi ranks 15th from the top.\nII. Ravi ranks 20th from the bottom.',
    options: [
      'Statement I alone is sufficient',
      'Statement II alone is sufficient',
      'Both statements together are sufficient',
      'Both statements together are not sufficient',
    ],
    correctOption: 'C',
    explanation:
      'Either rank alone is insufficient, but together the class size is 15 + 20 − 1 = 34 students.',
    pattern: 'SBI PO Prelims data sufficiency',
  },
  {
    id: 'sbi-34',
    topic: 'Data Sufficiency',
    difficulty: 'difficult',
    questionText:
      'Question: Who is the tallest among P, Q, R and S?\nI. P is taller than Q but shorter than R.\nII. S is taller than Q.',
    options: [
      'Statement I alone is sufficient',
      'Statement II alone is sufficient',
      'Both statements together are sufficient',
      'Both statements together are not sufficient',
    ],
    correctOption: 'D',
    explanation:
      'I gives R > P > Q and II gives S > Q, but the relative heights of R and S are never fixed. Together they still cannot decide between R and S.',
    pattern: 'SBI PO Prelims data sufficiency',
  },

  // ── Statement & Conclusion ─────────────────────────────────────────────────
  {
    id: 'sbi-35',
    topic: 'Statement & Conclusion',
    difficulty: 'moderate',
    questionText:
      'Statement: Many people in the city were reported to be suffering from dengue last month.\nConclusions: I. The civic body should take steps to control mosquito breeding. II. All the patients recovered completely.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'A',
    explanation:
      'A dengue outbreak calls for mosquito-control measures, so I follows. The statement says nothing about recovery, so II does not follow.',
    pattern: 'SBI PO Prelims statement and conclusion',
  },
  {
    id: 'sbi-36',
    topic: 'Statement & Conclusion',
    difficulty: 'moderate',
    questionText:
      'Statement: The number of night-time road accidents on a highway increased after its street lighting was switched off.\nConclusions: I. Adequate lighting helps reduce night-time accidents. II. People drive more carelessly at night.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'A',
    explanation:
      'The statement links the loss of lighting to more accidents, so I follows. Careless driving is not supported by the given statement.',
    pattern: 'SBI PO Prelims statement and conclusion',
  },

  // ── Logical Reasoning ──────────────────────────────────────────────────────
  {
    id: 'sbi-37',
    topic: 'Logical Reasoning',
    subtopic: 'Coded statements',
    difficulty: 'moderate',
    questionText:
      'In a certain code, "7 8 6" means "floors are clean", "5 6 3" means "clean the window" and "8 9 1" means "floors need paint". What does "6" stand for?',
    options: ['floors', 'clean', 'window', 'paint'],
    correctOption: 'B',
    explanation: 'The digit 6 appears only in the first two lines, whose only common word is "clean". Hence 6 = clean.',
    pattern: 'SBI PO Prelims coded statements',
  },
  {
    id: 'sbi-38',
    topic: 'Logical Reasoning',
    subtopic: 'Ordering',
    difficulty: 'moderate',
    questionText:
      'Six friends A, B, C, D, E and F have different heights. A is taller than only C. B is shorter than only D. F is taller than A but shorter than E. Who is the tallest?',
    options: ['A', 'B', 'C', 'D'],
    correctOption: 'D',
    explanation:
      'The order from tallest to shortest is D > B > E > F > A > C, so D is the tallest.',
    pattern: 'SBI PO Prelims ordering',
  },

  // ── Miscellaneous ──────────────────────────────────────────────────────────
  {
    id: 'sbi-39',
    topic: 'Miscellaneous',
    subtopic: 'Clocks',
    difficulty: 'moderate',
    questionText: 'What is the angle between the hour hand and the minute hand of a clock at 4:20?',
    options: ['0°', '10°', '20°', '30°'],
    correctOption: 'B',
    explanation:
      'Hour hand = 4 × 30 + 20 × 0.5 = 130°, minute hand = 20 × 6 = 120°. The angle between them is 130° − 120° = 10°.',
    pattern: 'SBI PO Prelims clock questions',
  },
  {
    id: 'sbi-40',
    topic: 'Miscellaneous',
    subtopic: 'Calendar',
    difficulty: 'moderate',
    questionText: 'In a year in which 1st March was a Wednesday, what day of the week was 1st April of the same year?',
    options: ['Friday', 'Saturday', 'Sunday', 'Thursday'],
    correctOption: 'B',
    explanation: 'March has 31 days = 3 odd days, so 1st April was Wednesday + 3 = Saturday.',
    pattern: 'SBI PO Prelims calendar questions',
  },
  {
    id: 'sbi-41',
    topic: 'Miscellaneous',
    subtopic: 'Calendar',
    difficulty: 'difficult',
    questionText: 'If 1st January 2026 is a Thursday, what day of the week is 1st January 2027?',
    options: ['Thursday', 'Friday', 'Saturday', 'Wednesday'],
    correctOption: 'B',
    explanation: '2026 is not a leap year, so the same date shifts by one day: Thursday + 1 = Friday.',
    pattern: 'SBI PO Prelims calendar questions',
  },
]

export const sbiPoQuestions = createBank('SBI_PO', rows)
