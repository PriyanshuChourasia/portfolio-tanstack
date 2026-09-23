import { createBank, type QuestionInput } from './types'

/**
 * SSC CHSL (Tier-1) Reasoning bank.
 *
 * Every question here is newly written to follow the SSC CHSL previous-year
 * pattern — none is a reproduction of an actual paper question, and each is
 * labelled `pyq_pattern` accordingly.
 */
const rows: QuestionInput[] = [
  // ── Analogy ────────────────────────────────────────────────────────────────
  {
    id: 'ssc-01',
    topic: 'Analogy',
    difficulty: 'easy',
    questionText: 'Book : Pages :: Ladder : ?',
    options: ['Rungs', 'Wood', 'Height', 'Nails'],
    correctOption: 'A',
    explanation: 'Pages are the successive steps of a book, just as rungs are the successive steps of a ladder.',
    pattern: 'SSC CHSL 2023 analogy questions',
  },
  {
    id: 'ssc-02',
    topic: 'Analogy',
    difficulty: 'easy',
    questionText: 'Doctor : Hospital :: Teacher : ?',
    options: ['Library', 'School', 'Laboratory', 'Museum'],
    correctOption: 'B',
    explanation: 'A doctor works in a hospital; a teacher works in a school. The relation is "workplace".',
    pattern: 'SSC CHSL 2022 analogy questions',
  },
  {
    id: 'ssc-03',
    topic: 'Analogy',
    difficulty: 'moderate',
    questionText: 'AZ : BY :: CX : ?',
    options: ['DW', 'DX', 'EW', 'DV'],
    correctOption: 'A',
    explanation:
      'The first letter moves one step forward (A→B→C→D) and the second moves one step backward (Z→Y→X→W). So CX → DW.',
    pattern: 'SSC CHSL 2024 letter-pair analogy',
  },

  // ── Classification ─────────────────────────────────────────────────────────
  {
    id: 'ssc-04',
    topic: 'Classification',
    difficulty: 'easy',
    questionText: 'Find the odd one out: 3, 5, 7, 9, 11',
    options: ['3', '5', '9', '11'],
    correctOption: 'C',
    explanation: '3, 5, 7 and 11 are prime numbers, while 9 = 3 × 3 is composite.',
    pattern: 'SSC CHSL 2023 odd-one-out',
  },
  {
    id: 'ssc-05',
    topic: 'Classification',
    difficulty: 'easy',
    questionText: 'Find the odd one out: Rectangle, Square, Rhombus, Triangle',
    options: ['Rectangle', 'Square', 'Rhombus', 'Triangle'],
    correctOption: 'D',
    explanation: 'Rectangle, square and rhombus are four-sided figures (quadrilaterals); a triangle has three sides.',
    pattern: 'SSC CHSL 2022 odd-one-out',
  },
  {
    id: 'ssc-06',
    topic: 'Classification',
    difficulty: 'moderate',
    questionText: 'Find the odd one out: 121, 169, 196, 289',
    options: ['121', '169', '196', '289'],
    correctOption: 'C',
    explanation:
      '121 = 11², 169 = 13² and 289 = 17² are squares of odd primes; 196 = 14² is the square of a composite number.',
    pattern: 'SSC CHSL 2024 odd-one-out',
  },

  // ── Series ─────────────────────────────────────────────────────────────────
  {
    id: 'ssc-07',
    topic: 'Series',
    difficulty: 'easy',
    questionText: 'Find the next term: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '44'],
    correctOption: 'C',
    explanation: 'The terms are 1×2, 2×3, 3×4, 4×5, 5×6, so the next is 6×7 = 42. (Differences increase by 2 each time.)',
    pattern: 'SSC CHSL 2023 number series',
  },
  {
    id: 'ssc-08',
    topic: 'Series',
    difficulty: 'moderate',
    questionText: 'Find the next term: 3, 8, 15, 24, 35, ?',
    options: ['42', '46', '48', '50'],
    correctOption: 'C',
    explanation: 'Each term is n² − 1 for n = 2, 3, 4, …: 4−1, 9−1, 16−1, 25−1, 36−1 and next 49 − 1 = 48.',
    pattern: 'SSC CHSL 2024 number series',
  },
  {
    id: 'ssc-09',
    topic: 'Series',
    difficulty: 'moderate',
    questionText: 'Find the next term: A, C, F, J, O, ?',
    options: ['T', 'U', 'V', 'S'],
    correctOption: 'B',
    explanation: 'Positions are 1, 3, 6, 10, 15 — differences 2, 3, 4, 5, so the next difference is 6 → position 21 → U.',
    pattern: 'SSC CHSL 2023 letter series',
  },

  // ── Coding-Decoding ────────────────────────────────────────────────────────
  {
    id: 'ssc-10',
    topic: 'Coding-Decoding',
    difficulty: 'easy',
    questionText: 'If TEACHER is coded as SDZBGDQ, how is DOCTOR coded?',
    options: ['CNBSNQ', 'CNBSQN', 'CMBSNQ', 'CNBRNQ'],
    correctOption: 'A',
    explanation: 'Every letter moves one step backward: D→C, O→N, C→B, T→S, O→N, R→Q, giving CNBSNQ.',
    pattern: 'SSC CHSL 2022 coding-decoding',
  },
  {
    id: 'ssc-11',
    topic: 'Coding-Decoding',
    difficulty: 'easy',
    questionText: 'In a certain code MOTHER is written as NPUIFS. How is FATHER written in that code?',
    options: ['GBUIFS', 'GBTIFS', 'GBUJFS', 'FZSEGQ'],
    correctOption: 'A',
    explanation: 'Each letter shifts one step forward: F→G, A→B, T→U, H→I, E→F, R→S → GBUIFS.',
    pattern: 'SSC CHSL 2023 coding-decoding',
  },
  {
    id: 'ssc-12',
    topic: 'Coding-Decoding',
    difficulty: 'moderate',
    questionText: 'If FRIEND is coded as HTKGPF, how is CANDLE coded?',
    options: ['ECPFNG', 'ECPNFG', 'ECQFNG', 'DCPFNG'],
    correctOption: 'A',
    explanation: 'Each letter moves two steps forward: C→E, A→C, N→P, D→F, L→N, E→G → ECPFNG.',
    pattern: 'SSC CHSL 2024 coding-decoding',
  },

  // ── Blood Relations ────────────────────────────────────────────────────────
  {
    id: 'ssc-13',
    topic: 'Blood Relations',
    difficulty: 'easy',
    questionText:
      'Pointing to a photograph, Ravi said, "She is the daughter of my grandfather\'s only son." How is the girl related to Ravi?',
    options: ['Cousin', 'Sister', 'Aunt', 'Niece'],
    correctOption: 'B',
    explanation: "Ravi's grandfather's only son is Ravi's father, so the girl is the daughter of Ravi's father — his sister.",
    pattern: 'SSC CHSL 2022 blood relations',
  },
  {
    id: 'ssc-14',
    topic: 'Blood Relations',
    difficulty: 'moderate',
    questionText: 'A is the brother of B. B is the sister of C. C is the father of D. How is A related to D?',
    options: ['Uncle', 'Brother', 'Father', 'Cousin'],
    correctOption: 'A',
    explanation: 'A and C are brothers (both siblings of B), and A is male, so A is the brother of D\'s father C — D\'s uncle.',
    pattern: 'SSC CHSL 2023 blood relations',
  },

  // ── Direction Sense ────────────────────────────────────────────────────────
  {
    id: 'ssc-15',
    topic: 'Direction Sense',
    difficulty: 'easy',
    questionText: 'Ramesh walks 5 km north, turns right and walks 3 km, then turns right again and walks 5 km. How far is he from the start?',
    options: ['3 km', '5 km', '8 km', '2 km'],
    correctOption: 'A',
    explanation:
      'North 5 km and then South 5 km cancel out, leaving only the 3 km displacement towards the east. He is 3 km from the start.',
    pattern: 'SSC CHSL 2023 direction sense',
  },
  {
    id: 'ssc-16',
    topic: 'Direction Sense',
    difficulty: 'moderate',
    questionText: 'Sunita walks 8 m east, then turns left and walks 6 m. How far and in which direction is she from the starting point?',
    options: ['10 m, north-east', '14 m, north-east', '10 m, south-east', '8 m, north'],
    correctOption: 'A',
    explanation:
      'Turning left from east means walking north, so the displacements are 8 m east and 6 m north. Distance = √(8² + 6²) = 10 m, direction north-east.',
    pattern: 'SSC CHSL 2024 direction sense',
  },

  // ── Ranking ────────────────────────────────────────────────────────────────
  {
    id: 'ssc-17',
    topic: 'Ranking',
    difficulty: 'easy',
    questionText: 'In a class of 40 students, Ravi is 12th from the top. What is his rank from the bottom?',
    options: ['28', '29', '27', '30'],
    correctOption: 'B',
    explanation: 'Rank from bottom = total − rank from top + 1 = 40 − 12 + 1 = 29.',
    pattern: 'SSC CHSL 2023 ranking',
  },
  {
    id: 'ssc-18',
    topic: 'Ranking',
    difficulty: 'moderate',
    questionText: 'In a row of 45 persons, A is 18th from the left and B is 12th from the right. How many persons are between A and B?',
    options: ['14', '15', '16', '17'],
    correctOption: 'B',
    explanation: "B's position from the left = 45 − 12 + 1 = 34. Persons between = 34 − 18 − 1 = 15.",
    pattern: 'SSC CHSL 2024 ranking',
  },

  // ── Syllogism ──────────────────────────────────────────────────────────────
  {
    id: 'ssc-19',
    topic: 'Syllogism',
    difficulty: 'moderate',
    questionText:
      'Statements: All pens are books. Some books are copies.\nConclusions: I. Some pens are copies. II. Some copies are books.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'B',
    explanation:
      '"Some books are copies" converts validly to "some copies are books", so II follows. The pens–copies link is not established, so I does not follow.',
    pattern: 'SSC CHSL 2023 syllogism',
  },
  {
    id: 'ssc-20',
    topic: 'Syllogism',
    difficulty: 'moderate',
    questionText:
      'Statements: Some apples are mangoes. All mangoes are fruits.\nConclusions: I. Some apples are fruits. II. All fruits are mangoes.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'A',
    explanation:
      'The apples that are mangoes must be fruits, so I follows. II is the converse of the given statement and does not follow.',
    pattern: 'SSC CHSL 2022 syllogism',
  },
  {
    id: 'ssc-21',
    topic: 'Syllogism',
    difficulty: 'difficult',
    questionText:
      'Statements: No dog is a cat. Some cats are rats.\nConclusions: I. Some rats are not dogs. II. No rat is a dog.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'A',
    explanation:
      'The cats that are rats cannot be dogs, so at least some rats are definitely not dogs (I follows). II is a possibility, not a certainty, so it does not follow.',
    pattern: 'SSC CHSL 2024 syllogism',
  },

  // ── Inequality ─────────────────────────────────────────────────────────────
  {
    id: 'ssc-22',
    topic: 'Inequality',
    difficulty: 'easy',
    questionText: 'Statements: P > Q ≥ R = S. Conclusions: I. P > S. II. Q ≥ S.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'C',
    explanation: 'P > Q ≥ R = S gives P > S (I follows) and Q ≥ S (II follows).',
    pattern: 'SSC CHSL 2023 inequality',
  },
  {
    id: 'ssc-23',
    topic: 'Inequality',
    difficulty: 'moderate',
    questionText: 'Statements: A ≤ B < C, D > C. Conclusions: I. A < D. II. D > B.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'C',
    explanation: 'Combining, A ≤ B < C < D, so both A < D and D > B follow.',
    pattern: 'SSC CHSL 2024 inequality',
  },

  // ── Seating Arrangement ────────────────────────────────────────────────────
  {
    id: 'ssc-24',
    topic: 'Seating Arrangement',
    subtopic: 'Linear row',
    difficulty: 'moderate',
    questionText:
      'Five friends P, Q, R, S and T sit in a row facing north. Q is at one extreme end and T sits immediately right of Q. R sits in the middle. P sits immediately left of S. Who sits at the other extreme end?',
    options: ['P', 'S', 'T', 'R'],
    correctOption: 'B',
    explanation:
      'The arrangement from left to right is Q, T, R, P, S. The other extreme end (right end) is occupied by S.',
    pattern: 'SSC CHSL 2023 linear seating',
  },
  {
    id: 'ssc-25',
    topic: 'Seating Arrangement',
    subtopic: 'Linear row',
    difficulty: 'moderate',
    questionText:
      'Five persons A, B, C, D and E sit in a row facing north. B sits at the extreme right end and C sits immediately left of B. A sits second to the left of C. D sits at the extreme left end. Who sits exactly in the middle?',
    options: ['A', 'C', 'D', 'E'],
    correctOption: 'D',
    explanation: 'The row is D, A, E, C, B, so E occupies the middle position.',
    pattern: 'SSC CHSL 2024 linear seating',
  },
  {
    id: 'ssc-26',
    topic: 'Seating Arrangement',
    subtopic: 'Linear row',
    difficulty: 'difficult',
    questionText:
      'A, B, C, D, E, F and G sit in a row facing north. C sits at the extreme left end and B sits immediately right of C. D sits third to the right of B. F sits at the extreme right end and G sits fourth to the left of F. E sits immediately right of D. Who sits immediately left of F?',
    options: ['A', 'D', 'E', 'G'],
    correctOption: 'C',
    explanation:
      'Fixing positions 1–7: C = 1, B = 2, D = 5, E = 6, F = 7 and G = 3 (fourth to the left of 7), which leaves A = 4. The person immediately left of F is E.',
    pattern: 'SSC CHSL 2022 linear seating (difficult set)',
  },

  // ── Floor Puzzle ───────────────────────────────────────────────────────────
  {
    id: 'ssc-27',
    topic: 'Floor Puzzle',
    difficulty: 'moderate',
    questionText:
      'Six friends P, Q, R, S, T and U live on six different floors of a building, floors 1 (lowest) to 6 (highest). Q lives on floor 3 and R lives immediately above Q. S lives on the topmost floor and U lives on floor 1. P lives on an even-numbered floor below Q. On which floor does T live?',
    options: ['2', '4', '5', '6'],
    correctOption: 'C',
    explanation: 'U = 1, P = 2, Q = 3, R = 4, S = 6, leaving T on floor 5.',
    pattern: 'SSC CHSL 2023 floor puzzle',
  },
  {
    id: 'ssc-28',
    topic: 'Floor Puzzle',
    difficulty: 'difficult',
    questionText:
      'Seven people A, B, C, D, E, F and G live on seven floors numbered 1 (lowest) to 7 (highest). G lives on floor 3 and two people live between G and A, where A lives above G. D lives on floor 1 and E lives on floor 7. B lives immediately below C. F lives on an even-numbered floor. On which floor does C live?',
    options: ['4', '5', '6', '7'],
    correctOption: 'B',
    explanation:
      'A = 6 (two floors, 4 and 5, between 3 and 6). Floors 2, 4 and 5 remain for B, C and F. B immediately below C can only be (4, 5), so C = 5, and F takes the even floor 2.',
    pattern: 'SSC CHSL 2024 floor puzzle (difficult set)',
  },

  // ── Box Puzzle ─────────────────────────────────────────────────────────────
  {
    id: 'ssc-29',
    topic: 'Box Puzzle',
    difficulty: 'moderate',
    questionText:
      'Six boxes A, B, C, D, E and F are stacked one above another (position 1 is the bottom). B is at the bottom and D is immediately above B. F is at the top and A is immediately below F. E is immediately above C, and C is above D. How many boxes are there between C and F?',
    options: ['1', '2', '3', '4'],
    correctOption: 'B',
    explanation:
      'Positions: B = 1, D = 2, C = 3, E = 4, A = 5, F = 6. Between C (position 3) and F (position 6) lie E and A — 2 boxes.',
    pattern: 'SSC CHSL 2023 box puzzle',
  },
  {
    id: 'ssc-30',
    topic: 'Box Puzzle',
    difficulty: 'difficult',
    questionText:
      'Seven boxes P, Q, R, S, T, U and V are stacked one above another (position 1 is the bottom). T is at the top and V is immediately below T. R is at the bottom and U is immediately above R. Two boxes are between P and V. Q is immediately above S. Which box is in the middle of the stack?',
    options: ['Q', 'S', 'U', 'P'],
    correctOption: 'B',
    explanation:
      'T = 7, V = 6, R = 1, U = 2 and P = 3 (two boxes, at 4 and 5, between P and V). Q above S fixes S = 4 and Q = 5. The middle position 4 is held by S.',
    pattern: 'SSC CHSL 2024 box puzzle (difficult set)',
  },

  // ── Scheduling ─────────────────────────────────────────────────────────────
  {
    id: 'ssc-31',
    topic: 'Scheduling',
    difficulty: 'moderate',
    questionText:
      'Five lectures — Maths, Physics, Chemistry, English and Hindi — are held on five consecutive days from Monday to Friday, one per day. Hindi is on Monday and Maths is on Wednesday. Physics is held on the day immediately after Chemistry. Which lecture is held on Friday?',
    options: ['Physics', 'Chemistry', 'English', 'Hindi'],
    correctOption: 'A',
    explanation:
      'Chemistry cannot be Monday (Hindi), Wednesday (Maths) or Tuesday (Physics would then fall on Wednesday), so Chemistry is Thursday and Physics is Friday. English takes Tuesday.',
    pattern: 'SSC CHSL 2023 scheduling',
  },
  {
    id: 'ssc-32',
    topic: 'Scheduling',
    difficulty: 'difficult',
    questionText:
      'Six meetings A, B, C, D, E and F are held on six consecutive days, the 1st to the 6th, one per day. A is held on the 2nd and F on the 6th. Two meetings are held between A and D. B is held immediately after E. C is held before A. Which meeting is held on the 1st?',
    options: ['A', 'B', 'C', 'E'],
    correctOption: 'C',
    explanation:
      'D = 5 (two meetings between day 2 and day 5). B immediately after E can only be the pair (3, 4), leaving C on the 1st — which also satisfies "C before A".',
    pattern: 'SSC CHSL 2024 scheduling (difficult set)',
  },

  // ── Input-Output ───────────────────────────────────────────────────────────
  {
    id: 'ssc-33',
    topic: 'Input-Output',
    difficulty: 'moderate',
    questionText:
      'A number arrangement machine rearranges a line of numbers in ascending order, placing one more number in its final position at every step. Input: 45 12 78 33 21. Step I: 12 45 78 33 21. Step II: 12 21 78 45 33. Step III: 12 21 33 78 45. Step IV: 12 21 33 45 78. If the input is 64 27 51 18 39, what is Step II?',
    options: ['18 27 64 51 39', '18 27 51 64 39', '18 27 51 39 64', '27 18 51 39 64'],
    correctOption: 'A',
    explanation:
      'Step I places 18 first: 18 64 27 51 39. Step II places 27 second: 18 27 64 51 39.',
    pattern: 'SSC CHSL 2023 input-output',
  },
  {
    id: 'ssc-34',
    topic: 'Input-Output',
    difficulty: 'difficult',
    questionText:
      'Following the same machine (ascending arrangement, one smallest number fixed per step), the input is 71 52 36 24 60. What is Step III?',
    options: ['24 36 52 71 60', '24 36 71 52 60', '24 52 36 71 60', '36 24 52 71 60'],
    correctOption: 'A',
    explanation:
      'Step I: 24 71 52 36 60. Step II: 24 36 71 52 60. Step III fixes 52 in third place: 24 36 52 71 60.',
    pattern: 'SSC CHSL 2024 input-output (difficult set)',
  },

  // ── Data Sufficiency ───────────────────────────────────────────────────────
  {
    id: 'ssc-35',
    topic: 'Data Sufficiency',
    difficulty: 'moderate',
    questionText:
      'Question: What is the value of X?\nI. X is the smallest prime number greater than 20.\nII. X is an odd number between 20 and 26.',
    options: [
      'Statement I alone is sufficient',
      'Statement II alone is sufficient',
      'Either statement alone is sufficient',
      'Both statements together are not sufficient',
    ],
    correctOption: 'A',
    explanation: 'I alone fixes X = 23. II allows 21, 23 or 25, so it is not sufficient on its own.',
    pattern: 'SSC CHSL 2023 data sufficiency',
  },
  {
    id: 'ssc-36',
    topic: 'Data Sufficiency',
    difficulty: 'difficult',
    questionText:
      'Question: On which day of the week was Ravi born?\nI. Ravi was born on the day immediately after a Monday.\nII. Ravi was born on a day that falls between Sunday and Wednesday of the same week.',
    options: [
      'Statement I alone is sufficient',
      'Statement II alone is sufficient',
      'Either statement alone is sufficient',
      'Both statements together are not sufficient',
    ],
    correctOption: 'A',
    explanation:
      'I alone gives Tuesday. II allows Monday or Tuesday, and combining the two still gives only Tuesday, but the answer is determined by I alone.',
    pattern: 'SSC CHSL 2022 data sufficiency',
  },

  // ── Statement & Conclusion ─────────────────────────────────────────────────
  {
    id: 'ssc-37',
    topic: 'Statement & Conclusion',
    difficulty: 'moderate',
    questionText:
      'Statement: The government has made it mandatory for every vehicle to carry a valid pollution-under-control certificate.\nConclusions: I. Vehicle owners will have to get their vehicles tested periodically. II. Pollution levels will come under control immediately.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'A',
    explanation:
      'A valid certificate must be renewed periodically, so I follows. II claims an immediate outcome that the statement does not support.',
    pattern: 'SSC CHSL 2023 statement and conclusion',
  },
  {
    id: 'ssc-38',
    topic: 'Statement & Conclusion',
    difficulty: 'moderate',
    questionText:
      'Statement: All employees of a company were asked to attend a compulsory cyber-security training on Saturday, which was otherwise a holiday.\nConclusions: I. The employees may have to give up their weekly holiday. II. The company considers cyber security important.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'B',
    explanation:
      'The company\'s decision to hold training on a holiday clearly shows it values cyber security, so II follows. I is speculative — the training might also be compensated, so it is not a definite conclusion.',
    pattern: 'SSC CHSL 2024 statement and conclusion',
  },

  // ── Logical Reasoning ──────────────────────────────────────────────────────
  {
    id: 'ssc-39',
    topic: 'Logical Reasoning',
    subtopic: 'Coded language',
    difficulty: 'moderate',
    questionText:
      "In a code language, 'water is life' is written as 'ga na ta' and 'life is beautiful' as 'na ta sa'. If 'beautiful water day' is written as 'sa ga ra', what is the code for 'day'?",
    options: ['ra', 'sa', 'ga', 'na'],
    correctOption: 'A',
    explanation:
      "Comparing the first two sentences, 'sa' = beautiful and 'ga' = water, so the remaining word in the third sentence, 'day', is coded 'ra'.",
    pattern: 'SSC CHSL 2023 coded language',
  },
  {
    id: 'ssc-40',
    topic: 'Logical Reasoning',
    subtopic: 'Calendar',
    difficulty: 'moderate',
    questionText: 'If 15th August 2024 was a Thursday, what day of the week was 15th August 2025?',
    options: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
    correctOption: 'C',
    explanation: '2025 is not a leap year, so the same date advances by one day: Thursday + 1 = Friday.',
    pattern: 'SSC CHSL 2024 calendar questions',
  },

  // ── Miscellaneous ──────────────────────────────────────────────────────────
  {
    id: 'ssc-41',
    topic: 'Miscellaneous',
    subtopic: 'Clocks',
    difficulty: 'easy',
    questionText: 'What is the angle between the hour hand and the minute hand of a clock at 3 o\'clock?',
    options: ['60°', '75°', '90°', '120°'],
    correctOption: 'C',
    explanation: 'At 3 o\'clock the minute hand points at 12 and the hour hand at 3, which are 90° apart.',
    pattern: 'SSC CHSL 2022 clock questions',
  },
  {
    id: 'ssc-42',
    topic: 'Miscellaneous',
    subtopic: 'Set-based counting',
    difficulty: 'moderate',
    questionText:
      'In a group of 100 people, 60 read English newspapers and 50 read Hindi newspapers. If 20 people read both, how many read neither?',
    options: ['10', '20', '30', '40'],
    correctOption: 'A',
    explanation: 'People reading at least one paper = 60 + 50 − 20 = 90, so 100 − 90 = 10 read neither.',
    pattern: 'SSC CHSL 2023 miscellaneous reasoning',
  },
  {
    id: 'ssc-43',
    topic: 'Miscellaneous',
    subtopic: 'Letter series',
    difficulty: 'moderate',
    questionText: 'Find the next term: AZ, CX, EV, GT, ?',
    options: ['IR', 'IS', 'HR', 'JR'],
    correctOption: 'A',
    explanation:
      'The first letters move two steps forward (A, C, E, G, I) and the second move two steps backward (Z, X, V, T, R) → IR.',
    pattern: 'SSC CHSL 2024 miscellaneous reasoning',
  },
]

export const sscChslQuestions = createBank('SSC_CHSL', rows)
