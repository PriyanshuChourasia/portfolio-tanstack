import { createBank, type QuestionInput } from './types'

/**
 * IBPS PO (Prelims) Reasoning bank.
 *
 * Pattern-based questions written for IBPS PO Prelims practice. None of these is
 * an actual paper question; each is labelled `pyq_pattern`.
 */
const rows: QuestionInput[] = [
  // ── Analogy ────────────────────────────────────────────────────────────────
  {
    id: 'ibps-01',
    topic: 'Analogy',
    difficulty: 'easy',
    questionText: 'Pen : Write :: Knife : ?',
    options: ['Sharp', 'Cut', 'Steel', 'Kitchen'],
    correctOption: 'B',
    explanation: 'A pen is used to write, just as a knife is used to cut. The relation is "tool : function".',
    pattern: 'IBPS PO Prelims analogy',
  },
  {
    id: 'ibps-02',
    topic: 'Analogy',
    difficulty: 'moderate',
    questionText: '6 : 42 :: 8 : ?',
    options: ['64', '72', '80', '56'],
    correctOption: 'B',
    explanation: '6 × 7 = 42, so the relation is n × (n + 1): 8 × 9 = 72.',
    pattern: 'IBPS PO Prelims analogy',
  },
  {
    id: 'ibps-03',
    topic: 'Analogy',
    difficulty: 'moderate',
    questionText: 'Mason : Wall :: Cobbler : ?',
    options: ['Leather', 'Shoe', 'Hammer', 'Thread'],
    correctOption: 'B',
    explanation: 'A mason builds walls; a cobbler makes and repairs shoes.',
    pattern: 'IBPS PO Prelims analogy',
  },

  // ── Classification ─────────────────────────────────────────────────────────
  {
    id: 'ibps-04',
    topic: 'Classification',
    difficulty: 'easy',
    questionText: 'Find the odd one out: Rose, Lotus, Lily, Mango',
    options: ['Rose', 'Lotus', 'Lily', 'Mango'],
    correctOption: 'D',
    explanation: 'Rose, lotus and lily are flowers, while mango is a fruit.',
    pattern: 'IBPS PO Prelims odd-one-out',
  },
  {
    id: 'ibps-05',
    topic: 'Classification',
    difficulty: 'difficult',
    questionText: 'Find the odd one out: 3, 10, 29, 66, 128',
    options: ['3', '10', '66', '128'],
    correctOption: 'D',
    explanation:
      'The terms follow n³ + 2: 1+2 = 3, 8+2 = 10, 27+2 = 29, 64+2 = 66 and 125+2 = 127 — so 128 is the odd term.',
    pattern: 'IBPS PO Prelims odd-one-out',
  },

  // ── Series ─────────────────────────────────────────────────────────────────
  {
    id: 'ibps-06',
    topic: 'Series',
    difficulty: 'easy',
    questionText: 'Find the next term: 4, 12, 36, 108, ?',
    options: ['216', '324', '432', '312'],
    correctOption: 'B',
    explanation: 'Each term is the previous term multiplied by 3, so 108 × 3 = 324.',
    pattern: 'IBPS PO Prelims number series',
  },
  {
    id: 'ibps-07',
    topic: 'Series',
    difficulty: 'difficult',
    questionText: 'Find the missing term: 1, 4, 27, 256, ?',
    options: ['1024', '3125', '625', '2048'],
    correctOption: 'B',
    explanation: 'The terms are 1¹, 2², 3³, 4⁴, so the next is 5⁵ = 3125.',
    pattern: 'IBPS PO Prelims number series',
  },
  {
    id: 'ibps-08',
    topic: 'Series',
    difficulty: 'moderate',
    questionText: 'Find the wrong term: 2, 5, 11, 23, 47, 96',
    options: ['11', '23', '47', '96'],
    correctOption: 'D',
    explanation: 'Each term is (previous × 2) + 1: 47 × 2 + 1 = 95, so 96 is wrong.',
    pattern: 'IBPS PO Prelims wrong-term series',
  },

  // ── Coding-Decoding ────────────────────────────────────────────────────────
  {
    id: 'ibps-09',
    topic: 'Coding-Decoding',
    difficulty: 'easy',
    questionText: 'If TABLE is coded as UBCMF, how is CHAIR coded?',
    options: ['DIBJS', 'DIBJT', 'DHBJS', 'DIBKS'],
    correctOption: 'A',
    explanation: 'Each letter moves one step forward: C→D, H→I, A→B, I→J, R→S → DIBJS.',
    pattern: 'IBPS PO Prelims coding-decoding',
  },
  {
    id: 'ibps-10',
    topic: 'Coding-Decoding',
    difficulty: 'difficult',
    questionText:
      "In a certain code, 'sky is blue' is written as 'la ma ta', 'blue and green' as 'ta pa na' and 'green is fresh' as 'na ma re'. What is the code for 'sky'?",
    options: ['la', 'ma', 'ta', 'na'],
    correctOption: 'A',
    explanation:
      "Sentences 1 and 2 give 'ta' = blue; sentences 2 and 3 give 'na' = green; sentences 1 and 3 give 'ma' = is. The remaining word 'sky' is therefore 'la'.",
    pattern: 'IBPS PO Prelims coded language',
  },
  {
    id: 'ibps-11',
    topic: 'Coding-Decoding',
    difficulty: 'moderate',
    questionText:
      'If every letter is replaced by its alphabet position (A = 1, B = 2, … Z = 26), what is the sum of the digits used to code the word DOCTOR?',
    options: ['70', '72', '75', '78'],
    correctOption: 'C',
    explanation: 'D=4, O=15, C=3, T=20, O=15, R=18. The total is 4+15+3+20+15+18 = 75.',
    pattern: 'IBPS PO Prelims coding-decoding',
  },

  // ── Blood Relations ────────────────────────────────────────────────────────
  {
    id: 'ibps-12',
    topic: 'Blood Relations',
    difficulty: 'moderate',
    questionText: 'A is the mother of B. B is the wife of C. D is the son of C. How is A related to D?',
    options: ['Mother', 'Grandmother', 'Aunt', 'Sister'],
    correctOption: 'B',
    explanation: 'B is the wife of C and D is their son, so B is D\'s mother and A, B\'s mother, is D\'s grandmother.',
    pattern: 'IBPS PO Prelims blood relations',
  },
  {
    id: 'ibps-13',
    topic: 'Blood Relations',
    difficulty: 'moderate',
    questionText: 'Q is the brother of R. S is the father of Q. T is the sister of S. How is T related to R?',
    options: ['Aunt', 'Sister', 'Mother', 'Cousin'],
    correctOption: 'A',
    explanation: "T is the sister of R's father S, so T is R's aunt.",
    pattern: 'IBPS PO Prelims blood relations',
  },

  // ── Direction Sense ────────────────────────────────────────────────────────
  {
    id: 'ibps-14',
    topic: 'Direction Sense',
    difficulty: 'easy',
    questionText: 'Amit walks 6 km north, turns right and walks 8 km. How far is he from the starting point?',
    options: ['10 km', '14 km', '12 km', '8 km'],
    correctOption: 'A',
    explanation: 'The displacements are 6 km and 8 km at right angles, so the distance is √(36 + 64) = 10 km.',
    pattern: 'IBPS PO Prelims direction sense',
  },
  {
    id: 'ibps-15',
    topic: 'Direction Sense',
    difficulty: 'moderate',
    questionText: 'A girl walks 4 km west, then 3 km south, then 4 km east. How far and in which direction is she from the start?',
    options: ['3 km south', '4 km west', '5 km south', '7 km south'],
    correctOption: 'A',
    explanation: 'The 4 km west and 4 km east cancel each other, leaving a net displacement of 3 km towards the south.',
    pattern: 'IBPS PO Prelims direction sense',
  },

  // ── Ranking ────────────────────────────────────────────────────────────────
  {
    id: 'ibps-16',
    topic: 'Ranking',
    difficulty: 'easy',
    questionText: 'In a class of 45 students, Sita is 15th from the top. What is her rank from the bottom?',
    options: ['30', '31', '32', '29'],
    correctOption: 'B',
    explanation: 'Rank from bottom = 45 − 15 + 1 = 31.',
    pattern: 'IBPS PO Prelims ranking',
  },
  {
    id: 'ibps-17',
    topic: 'Ranking',
    difficulty: 'moderate',
    questionText:
      'In a row of 30 persons, X is 10th from the left end and Y is 15th from the right end. How many persons are between X and Y?',
    options: ['4', '5', '6', '7'],
    correctOption: 'B',
    explanation: "Y's position from the left = 30 − 15 + 1 = 16, so persons between X (10) and Y (16) = 16 − 10 − 1 = 5.",
    pattern: 'IBPS PO Prelims ranking',
  },

  // ── Syllogism ──────────────────────────────────────────────────────────────
  {
    id: 'ibps-18',
    topic: 'Syllogism',
    difficulty: 'moderate',
    questionText:
      'Statements: All roses are flowers. Some flowers fade quickly.\nConclusions: I. Some roses fade quickly. II. All flowers are roses.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'D',
    explanation:
      'The flowers that fade quickly need not be roses, so I does not follow. II is the converse of an "all" statement and does not follow either.',
    pattern: 'IBPS PO Prelims syllogism',
  },
  {
    id: 'ibps-19',
    topic: 'Syllogism',
    difficulty: 'moderate',
    questionText:
      'Statements: All chairs are tables. Some tables are wooden.\nConclusions: I. Some chairs are wooden. II. Some tables are chairs.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'B',
    explanation:
      '"All chairs are tables" converts to "some tables are chairs" (II). The wooden tables need not be chairs, so I does not follow.',
    pattern: 'IBPS PO Prelims syllogism',
  },

  // ── Inequality ─────────────────────────────────────────────────────────────
  {
    id: 'ibps-20',
    topic: 'Inequality',
    difficulty: 'moderate',
    questionText: 'Statements: A > B ≥ C < D. Conclusions: I. A > C. II. D > B.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'A',
    explanation: 'A > B ≥ C gives A > C (I). Since C is below both B and D, no definite relation between D and B can be established.',
    pattern: 'IBPS PO Prelims inequality',
  },
  {
    id: 'ibps-21',
    topic: 'Inequality',
    difficulty: 'difficult',
    questionText: 'Statements: P < Q = R ≤ S; T ≥ S. Conclusions: I. P < T. II. Q ≤ T.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'C',
    explanation: 'Chaining gives P < Q = R ≤ S ≤ T, so both P < T and Q ≤ T follow.',
    pattern: 'IBPS PO Prelims inequality',
  },

  // ── Seating Arrangement ────────────────────────────────────────────────────
  {
    id: 'ibps-22',
    topic: 'Seating Arrangement',
    subtopic: 'Circular',
    difficulty: 'difficult',
    questionText:
      'Six persons A, B, C, D, E and F sit around a circular table facing the centre. A sits second to the left of C and E sits immediately right of A. B sits opposite C and F sits opposite E. Who sits opposite A?',
    options: ['B', 'C', 'D', 'F'],
    correctOption: 'C',
    explanation:
      'With C and B opposite and E placed by A, the only person left opposite A is D once F is fixed opposite E.',
    pattern: 'IBPS PO Prelims circular seating',
  },
  {
    id: 'ibps-23',
    topic: 'Seating Arrangement',
    subtopic: 'Linear row',
    difficulty: 'moderate',
    questionText:
      'Seven persons A, B, C, D, E, F and G sit in a row facing north. C sits in the middle. B sits immediately right of C. A sits at the extreme left end and D at the extreme right end. E sits immediately right of A and F sits immediately left of D. Who sits third from the left end?',
    options: ['C', 'E', 'G', 'F'],
    correctOption: 'C',
    explanation: 'The row is A, E, G, C, B, F, D, so the third person from the left end is G.',
    pattern: 'IBPS PO Prelims linear seating',
  },
  {
    id: 'ibps-24',
    topic: 'Seating Arrangement',
    subtopic: 'Linear row',
    difficulty: 'difficult',
    questionText:
      'Six friends A, B, C, D, E and F sit in a row facing north. D sits at the extreme left end and B sits second from the left end. E sits immediately right of B. F sits third to the right of B and A sits immediately right of F. Who sits second from the right end?',
    options: ['A', 'E', 'F', 'C'],
    correctOption: 'C',
    explanation: 'The row is D, B, E, C, F, A. The second seat from the right end is occupied by F.',
    pattern: 'IBPS PO Prelims linear seating',
  },

  // ── Floor Puzzle ───────────────────────────────────────────────────────────
  {
    id: 'ibps-25',
    topic: 'Floor Puzzle',
    difficulty: 'difficult',
    questionText:
      'Six persons A, B, C, D, E and F live on six floors of a building, floors 1 (lowest) to 6 (highest). C lives on floor 1 and two persons live between C and D. A lives on an odd-numbered floor and B lives immediately below A. E lives below F. Who lives on floor 3?',
    options: ['A', 'E', 'F', 'D'],
    correctOption: 'C',
    explanation:
      'C = 1 and D = 4. A on an odd floor with B immediately below can only be A = 5, B = 6 (A = 3 is blocked by D). Of the remaining floors 2 and 3, E is below F, so E = 2 and F = 3.',
    pattern: 'IBPS PO Prelims floor puzzle',
  },
  {
    id: 'ibps-26',
    topic: 'Floor Puzzle',
    difficulty: 'moderate',
    questionText:
      'Four persons P, Q, R and S live on four floors of a building, floors 1 (lowest) to 4 (highest). R lives on floor 1. P lives above Q and S lives immediately above P. Who lives on floor 2?',
    options: ['P', 'Q', 'R', 'S'],
    correctOption: 'B',
    explanation:
      'S immediately above P cannot be (2, 3) because Q must be below P and floor 1 is taken by R. So P = 3, S = 4 and Q = 2.',
    pattern: 'IBPS PO Prelims floor puzzle',
  },

  // ── Box Puzzle ─────────────────────────────────────────────────────────────
  {
    id: 'ibps-27',
    topic: 'Box Puzzle',
    difficulty: 'difficult',
    questionText:
      'Eight boxes A, B, C, D, E, F, G and H are stacked one above another (position 1 is the bottom). A is at the 5th position from the bottom and F is immediately above A. Two boxes are between A and B, and B is below A. C is immediately below B. D is at the top and E is immediately below D. G is below H. Which box is at the 4th position from the bottom?',
    options: ['G', 'H', 'C', 'E'],
    correctOption: 'B',
    explanation:
      'A = 5, F = 6, D = 8, E = 7, B = 2, C = 1. The remaining positions 3 and 4 hold G and H, and since G is below H, H sits at position 4.',
    pattern: 'IBPS PO Prelims box puzzle',
  },
  {
    id: 'ibps-28',
    topic: 'Box Puzzle',
    difficulty: 'moderate',
    questionText:
      'Five boxes P, Q, R, S and T are stacked one above another (position 1 is the bottom). P is at the bottom and Q is immediately above P. Two boxes are between Q and T. R is above S. Which box is at the top?',
    options: ['P', 'Q', 'R', 'T'],
    correctOption: 'D',
    explanation: 'P = 1, Q = 2 and T = 5 (two boxes at 3 and 4 between them). R takes 4 and S takes 3, so T is at the top.',
    pattern: 'IBPS PO Prelims box puzzle',
  },

  // ── Scheduling ─────────────────────────────────────────────────────────────
  {
    id: 'ibps-29',
    topic: 'Scheduling',
    difficulty: 'difficult',
    questionText:
      'Six exams A, B, C, D, E and F are held on six consecutive days, the 1st to the 6th, one per day. A is on the 2nd and F is on the 5th. Three exams are held between A and D. B is held immediately before C. Which exam is held on the 1st?',
    options: ['A', 'B', 'E', 'F'],
    correctOption: 'C',
    explanation:
      'A = 2 and D = 6 (three exams at 3, 4 and 5 in between). With F at 5, the pair B immediately before C can only take days 3 and 4, leaving E on the 1st.',
    pattern: 'IBPS PO Prelims scheduling puzzle',
  },
  {
    id: 'ibps-30',
    topic: 'Scheduling',
    difficulty: 'moderate',
    questionText:
      'Five lectures P, Q, R, S and T are scheduled from Monday to Friday, one per day. P is on Wednesday, Q is on Thursday and T is on Friday. R is held immediately before S. Which lecture is on Tuesday?',
    options: ['P', 'Q', 'R', 'S'],
    correctOption: 'D',
    explanation: 'The remaining days are Monday and Tuesday, and R immediately before S fixes R on Monday and S on Tuesday.',
    pattern: 'IBPS PO Prelims scheduling puzzle',
  },

  // ── Input-Output ───────────────────────────────────────────────────────────
  {
    id: 'ibps-31',
    topic: 'Input-Output',
    difficulty: 'moderate',
    questionText:
      'A machine arranges a line of numbers in ascending order, fixing one more number in its final position at every step. Input: 42 18 65 30 54 → Step I: 18 42 65 30 54 → Step II: 18 30 65 42 54 → Step III: 18 30 42 65 54. For the input 55 27 61 14 39, what is Step II?',
    options: ['14 27 55 61 39', '14 27 61 55 39', '14 55 27 61 39', '27 14 55 61 39'],
    correctOption: 'A',
    explanation: 'Step I places 14 first: 14 55 27 61 39. Step II places 27 next: 14 27 55 61 39.',
    pattern: 'IBPS PO Prelims input-output',
  },
  {
    id: 'ibps-32',
    topic: 'Input-Output',
    difficulty: 'moderate',
    questionText:
      'A machine arranges a line of words in alphabetical order, fixing one word per step. Input: red blue green amber → Step I: amber red blue green → Step II: amber blue red green. For the input "pear apple fig mango", what is Step II?',
    options: ['apple fig pear mango', 'apple pear fig mango', 'apple fig mango pear', 'fig apple pear mango'],
    correctOption: 'A',
    explanation: 'Step I: apple pear fig mango. Step II: apple fig pear mango.',
    pattern: 'IBPS PO Prelims input-output',
  },

  // ── Data Sufficiency ───────────────────────────────────────────────────────
  {
    id: 'ibps-33',
    topic: 'Data Sufficiency',
    difficulty: 'moderate',
    questionText:
      'Question: What is the two-digit number X?\nI. The sum of the digits of X is 9.\nII. The digits of X are 4 and 5, in some order.',
    options: [
      'Statement I alone is sufficient',
      'Statement II alone is sufficient',
      'Both statements together are sufficient',
      'Both statements together are not sufficient',
    ],
    correctOption: 'C',
    explanation:
      'I alone allows 18, 27, 36 … and II alone allows 45 or 54. Together only 45 satisfies both (4 + 5 = 9).',
    pattern: 'IBPS PO Prelims data sufficiency',
  },
  {
    id: 'ibps-34',
    topic: 'Data Sufficiency',
    difficulty: 'difficult',
    questionText:
      'Question: Who sits at the extreme right end of the row?\nI. A sits at the extreme left end.\nII. B sits immediately right of A.',
    options: [
      'Statement I alone is sufficient',
      'Statement II alone is sufficient',
      'Both statements together are sufficient',
      'Both statements together are not sufficient',
    ],
    correctOption: 'D',
    explanation:
      'The statements together only fix positions 1 and 2 from the left. Nothing is said about the number of people, so the right end cannot be determined.',
    pattern: 'IBPS PO Prelims data sufficiency',
  },

  // ── Statement & Conclusion ─────────────────────────────────────────────────
  {
    id: 'ibps-35',
    topic: 'Statement & Conclusion',
    difficulty: 'moderate',
    questionText:
      'Statement: A notice at a railway station reads, "Passengers are requested not to leave their luggage unattended."\nConclusions: I. Unattended luggage may pose a security risk. II. Every passenger at the station follows the notice.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'A',
    explanation:
      'The request implies a security concern, so I follows. Nothing in the notice guarantees that every passenger complies, so II does not follow.',
    pattern: 'IBPS PO Prelims statement and conclusion',
  },
  {
    id: 'ibps-36',
    topic: 'Statement & Conclusion',
    difficulty: 'moderate',
    questionText:
      'Statement: An institute has decided to conduct free coaching for students who scored below 50% in the entrance test.\nConclusions: I. The institute wants to improve the performance of weaker students. II. All such students will score above 50% in the next test.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'A',
    explanation:
      'Free coaching for low scorers shows an intent to help them improve, so I follows. II predicts an outcome the statement does not guarantee.',
    pattern: 'IBPS PO Prelims statement and conclusion',
  },

  // ── Logical Reasoning ──────────────────────────────────────────────────────
  {
    id: 'ibps-37',
    topic: 'Logical Reasoning',
    subtopic: 'Symbol substitution',
    difficulty: 'moderate',
    questionText:
      'If A means +, B means −, C means × and D means ÷, what is the value of 18 D 3 A 4 B 2 C 2?',
    options: ['4', '6', '8', '10'],
    correctOption: 'B',
    explanation:
      'Applying the usual order of operations: 18 ÷ 3 + 4 − 2 × 2 = 6 + 4 − 4 = 6.',
    pattern: 'IBPS PO Prelims symbol substitution',
  },
  {
    id: 'ibps-38',
    topic: 'Logical Reasoning',
    subtopic: 'Coded language',
    difficulty: 'difficult',
    questionText:
      "In a code, 'run fast today' is written as 'zap hop skip', 'today was good' as 'skip kit jam' and 'good fast race' as 'jam hop lit'. Which word is coded 'hop'?",
    options: ['run', 'fast', 'today', 'good'],
    correctOption: 'B',
    explanation:
      "The first and third sentences share only 'fast', and their codes share only 'hop' — so 'hop' stands for fast.",
    pattern: 'IBPS PO Prelims coded language',
  },

  // ── Miscellaneous ──────────────────────────────────────────────────────────
  {
    id: 'ibps-39',
    topic: 'Miscellaneous',
    subtopic: 'Clocks',
    difficulty: 'difficult',
    questionText:
      'A clock gains 2 minutes every hour. If it shows the correct time at 8:00 AM, what time will it show at 2:00 PM (actual time) the same day?',
    options: ['2:06 PM', '2:12 PM', '2:10 PM', '2:24 PM'],
    correctOption: 'B',
    explanation: 'Six hours pass, so the clock gains 6 × 2 = 12 minutes and shows 2:12 PM.',
    pattern: 'IBPS PO Prelims clock questions',
  },
  {
    id: 'ibps-40',
    topic: 'Miscellaneous',
    subtopic: 'Clocks',
    difficulty: 'moderate',
    questionText: 'How many times do the hands of a clock coincide in 24 hours?',
    options: ['22', '24', '20', '12'],
    correctOption: 'A',
    explanation: 'The hands coincide 11 times in 12 hours (they do not coincide at 12-hour boundaries twice over), so 22 times in 24 hours.',
    pattern: 'IBPS PO Prelims clock questions',
  },
  {
    id: 'ibps-41',
    topic: 'Miscellaneous',
    subtopic: 'Calendar',
    difficulty: 'easy',
    questionText: 'If today is Monday, what day of the week will it be after 45 days?',
    options: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    correctOption: 'C',
    explanation: '45 ÷ 7 leaves a remainder of 3, so Monday + 3 = Thursday.',
    pattern: 'IBPS PO Prelims calendar questions',
  },
]

export const ibpsPoQuestions = createBank('IBPS_PO', rows)
