import type { QuestionInput } from './types'

/**
 * New verbal reasoning topics from the syllabus expansion — all original items.
 * Alphabet Test, Arithmetical Reasoning, Venn Diagrams, Statement & Assumption,
 * Statement & Argument, Cause & Effect, Course of Action.
 */
export const verbalExtraQuestions: QuestionInput[] = [
  /* ── Alphabet Test ──────────────────────────────────────────────────────── */
  {
    id: 've-001',
    topic: 'Alphabet Test',
    subtopic: 'Letter gaps',
    difficulty: 'easy',
    pattern: 'Original alphabet-test pattern',
    questionText: 'Which letter is third to the right of the letter that is exactly in the middle between J and T in the English alphabet?',
    options: ['P', 'Q', 'R', 'O'],
    correctOption: 'C',
    explanation:
      'J=10, T=20; the middle position is (10+20)/2 = 15 = O. Third letter to the right of O: P (1st), Q (2nd), R (3rd). Answer: R.',
    steps: [
      'J=10, T=20 → middle position (10+20)/2 = 15 → O.',
      'Third letter to the right of O: P (1st), Q (2nd), R (3rd).',
      'Answer: R.',
    ],
  },
  {
    id: 've-002',
    topic: 'Alphabet Test',
    subtopic: 'Dictionary order',
    difficulty: 'moderate',
    pattern: 'Original dictionary-order pattern',
    questionText: 'Arrange as in a dictionary: "Signal", "Sight", "Silent", "Sieve". Which word comes THIRD?',
    options: ['Signal', 'Silent', 'Sieve', 'Sight'],
    correctOption: 'B',
    explanation:
      'Compare letter by letter: all share SI. Third letter: g < l, so the SIG- words precede the SIL-/SIV- words. Between Signal (s-i-g-n) and Sight (s-i-g-h): the 4th letter h < n, so Sight comes first. Between Silent and Sieve: l < v, so Silent precedes Sieve. Full dictionary order: Sight, Signal, Silent, Sieve — third is Silent.',
    steps: [
      'All start SI; compare 3rd letter: g (Signal, Sight) < l (Silent, Sieve).',
      'Sight vs Signal: 4th letter h < n ⇒ Sight first.',
      'Order: Sight, Signal, Silent, Sieve ⇒ third = Silent.',
    ],
  },
  {
    id: 've-003',
    topic: 'Alphabet Test',
    subtopic: 'Reverse positions',
    difficulty: 'moderate',
    pattern: 'Original reverse-alphabet pattern',
    questionText: 'If the alphabet is written in reverse order (Z first), which letter is 7th to the right of the 14th letter from the left end?',
    options: ['F', 'G', 'E', 'H'],
    correctOption: 'A',
    explanation:
      'Reversed alphabet: Z Y X W V U T S R Q P O N M L K J I H G F E D C B A. Position 14 = M. Moving right (toward A): L, K, J, I, H, G, F — 7 steps lands on F (position 21 = normal 6th letter).',
    steps: [
      'Reversed string position 14 = M.',
      'Moving right in the reversed string: positions 15…21 = L, K, J, I, H, G, F.',
      '21st position = normal 6th letter = F.',
    ],
  },
  /* ── Arithmetical Reasoning ─────────────────────────────────────────────── */
  {
    id: 've-004',
    topic: 'Arithmetical Reasoning',
    subtopic: 'Ages',
    difficulty: 'moderate',
    pattern: 'Original age-reasoning pattern',
    questionText: 'A father is 3 times as old as his son. In 12 years, he will be twice as old. What is the son\u2019s current age?',
    options: ['10', '12', '14', '16'],
    correctOption: 'B',
    explanation:
      'Son = s, father = 3s. In 12 years: 3s+12 = 2(s+12) → 3s+12 = 2s+24 → s = 12. Check: father 36, son 12; in 12 years: 48 and 24 — exactly twice.',
    steps: [
      'Let son = s; father = 3s.',
      'Future: 3s + 12 = 2(s + 12).',
      'Solve: s = 12. Verify: 48 = 2×24 ✓.',
    ],
  },
  {
    id: 've-005',
    topic: 'Arithmetical Reasoning',
    subtopic: 'Ratios',
    difficulty: 'moderate',
    pattern: 'Original ratio-reasoning pattern',
    questionText: 'A bag contains ₹1, ₹2 and ₹5 coins in the ratio 1:2:5 by count. The total value is ₹450. How many ₹5 coins are there?',
    options: ['45', '50', '60', '75'],
    correctOption: 'D',
    explanation:
      'Counts: x, 2x, 5x. Total value = 1·x + 2·2x + 5·5x = 30x = 450 ⇒ x = 15. ₹5 coins = 5x = 75.',
    steps: [
      'Counts: x, 2x, 5x.',
      'Value: x + 4x + 25x = 30x = 450.',
      'x = 15 ⇒ ₹5 coins = 75.',
    ],
  },
  {
    id: 've-006',
    topic: 'Arithmetical Reasoning',
    subtopic: 'Number logic',
    difficulty: 'easy',
    pattern: 'Original number-reasoning pattern',
    questionText: 'The sum of two numbers is 40 and their difference is 12. What is their product?',
    options: ['364', '316', '322', '296'],
    correctOption: 'A',
    explanation:
      'a = (40+12)/2 = 26, b = (40−12)/2 = 14. Product = 26×14 = 364 — or via the identity ((a+b)² − (a−b)²)/4 = (1600−144)/4 = 364.',
    steps: [
      'a = (40+12)/2 = 26; b = (40−12)/2 = 14.',
      'Product via identity: (40² − 12²)/4 = 1456/4 = 364.',
    ],
  },
  /* ── Venn Diagrams ──────────────────────────────────────────────────────── */
  {
    id: 've-007',
    topic: 'Venn Diagrams',
    subtopic: 'Two sets',
    difficulty: 'easy',
    pattern: 'Original venn pattern',
    questionText:
      'In a class of 60, 35 play cricket, 28 play football, and 10 play neither. How many play both?',
    options: ['13', '10', '15', '18'],
    correctOption: 'A',
    explanation:
      'Players = 60 − 10 = 50. By inclusion–exclusion: 35 + 28 − both = 50 ⇒ both = 13.',
    steps: [
      'At least one game: 60 − 10 = 50.',
      'Inclusion–exclusion: 35 + 28 − both = 50.',
      'Both = 13.',
    ],
  },
  {
    id: 've-008',
    topic: 'Venn Diagrams',
    subtopic: 'Three sets',
    difficulty: 'difficult',
    pattern: 'Original three-set venn pattern',
    questionText:
      'Of 100 students: 45 read News (N), 40 read Sport (S), 38 read Tech (T); 12 read N∩S, 10 read S∩T, 8 read T∩N; 4 read all three. How many read exactly one section?',
    options: ['75', '71', '65', '79'],
    correctOption: 'A',
    explanation:
      'Strip the overlaps from each single set: only-N = 45 − (12−4) − (8−4) − 4 = 29; only-S = 40 − (12−4) − (10−4) − 4 = 22; only-T = 38 − (10−4) − (8−4) − 4 = 24. Exactly one = 29 + 22 + 24 = 75.',
    steps: [
      'only-N = N − (N∩S only) − (N∩T only) − all = 45−8−4−4 = 29.',
      'only-S = 40−8−6−4 = 22; only-T = 38−6−4−4 = 24.',
      'Total exactly-one = 29+22+24 = 75.',
    ],
  },
  /* ── Statement & Assumption ─────────────────────────────────────────────── */
  {
    id: 've-009',
    topic: 'Statement & Assumption',
    subtopic: 'Implicit assumption',
    difficulty: 'moderate',
    pattern: 'Original assumption pattern',
    questionText:
      'Statement (advertisement): "Join Zenith Institute — the only institute whose toppers clear every major aptitude exam."\nAssumption I: Students choose institutes based on toppers\u2019 success.\nAssumption II: No other institute\u2019s toppers clear every major aptitude exam.',
    options: ['Only I is implicit', 'Only II is implicit', 'Both I and II are implicit', 'Neither is implicit'],
    correctOption: 'C',
    explanation:
      'The ad appeals to toppers\u2019 success because it assumes that influences student choice (I). The word "only" explicitly asserts exclusivity, so II is also assumed.',
    steps: [
      'I: persuasive content must assume the persuasive lever works.',
      'II: "the only" is a definite exclusivity claim — an implicit assertion, hence an assumption.',
    ],
  },
  /* ── Statement & Argument ───────────────────────────────────────────────── */
  {
    id: 've-010',
    topic: 'Statement & Argument',
    subtopic: 'Strong vs weak',
    difficulty: 'moderate',
    pattern: 'Original argument-strength pattern',
    questionText:
      'Statement: Should urban speed limits be lowered to 40 km/h?\nArgument I: Yes, pedestrian fatalities drop sharply at impact speeds below 40 km/h.\nArgument II: No, I enjoy driving fast.',
    options: ['Only I is strong', 'Only II is strong', 'Both are strong', 'Neither is strong'],
    correctOption: 'A',
    explanation:
      'I cites a substantive, verifiable consequence tied to the policy goal (safety) — strong. II is a personal preference with no public-relevance argument — weak.',
    steps: [
      'Strong = directly relevant + substantive evidence or consequence.',
      'I: empirical safety link → strong.',
      'II: taste, not argument → weak.',
    ],
  },
  /* ── Cause & Effect ─────────────────────────────────────────────────────── */
  {
    id: 've-011',
    topic: 'Cause & Effect',
    subtopic: 'Causal direction',
    difficulty: 'moderate',
    pattern: 'Original cause-effect pattern',
    questionText:
      'I. The city\u2019s traffic police deployed additional signals at major intersections last month.\nII. Road-accident counts at those intersections fell sharply this month.',
    options: [
      'I is the cause and II is its effect',
      'II is the cause and I is its effect',
      'Both are independent causes',
      'Both are effects of some other cause',
    ],
    correctOption: 'A',
    explanation:
      'The deployment (I) is a deliberate intervention that precedes and plausibly explains the accident reduction (II). Timing + mechanism ⇒ I causes II.',
    steps: [
      'Check temporal order: signals first, decline after.',
      'Check mechanism: signals regulate conflicts → fewer collisions.',
      'Conclusion: I → II.',
    ],
  },
  {
    id: 've-012',
    topic: 'Cause & Effect',
    subtopic: 'Common cause',
    difficulty: 'difficult',
    pattern: 'Original common-cause pattern',
    questionText:
      'I. This week the city recorded its heaviest continuous rainfall in five years.\nII. This week reports of waterlogged underpasses and stranded traffic rose across the city.',
    options: [
      'I is the cause and II is its effect',
      'II is the cause and I is its effect',
      'Both are independent causes',
      'Both are effects of some other cause',
    ],
    correctOption: 'A',
    explanation:
      'Rainfall (I) is the direct physical cause of waterlogging (II). "Both effects of another cause" would need a hidden third factor driving both — implausible here since rain directly floods roads.',
    steps: [
      'Physical mechanism: rain → accumulation → waterlogging.',
      'No plausible common-cause structure fits better.',
      'I → II.',
    ],
  },
  /* ── Course of Action ───────────────────────────────────────────────────── */
  {
    id: 've-013',
    topic: 'Course of Action',
    subtopic: 'Valid action',
    difficulty: 'moderate',
    pattern: 'Original course-of-action pattern',
    questionText:
      'Statement: A sudden surge in fake currency of a particular denomination has been detected in several districts.\nCourses of action:\nI. Banks should be instructed to verify and quarantine notes of that denomination using detection machines.\nII. The government should immediately demonetise the entire denomination.',
    options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
    correctOption: 'A',
    explanation:
      'I is a proportionate, actionable step that addresses detection and containment. II is disproportionate and disruptive for a localised surge — not a logical course of action.',
    steps: [
      'A valid course is feasible, proportionate and addresses the stated problem.',
      'I: targeted detection ⇒ follows.',
      'II: extreme collateral harm without necessity ⇒ does not follow.',
    ],
  },
  /* ── Statement & Conclusion ─────────────────────────────────────────────── */
  {
    id: 've-014',
    topic: 'Statement & Conclusion',
    subtopic: 'Logical follow',
    difficulty: 'moderate',
    pattern: 'Original conclusion pattern',
    questionText:
      'Statement: "All engineers in this office are graduates. Some graduates in this office are managers."\nConclusion I: Some engineers are managers.\nConclusion II: Some managers are graduates.',
    options: [
      'Only I follows',
      'Only II follows',
      'Both I and II follow',
      'Neither follows',
    ],
    correctOption: 'B',
    explanation:
      'The managers mentioned are graduates by the second premise ⇒ II follows. The engineers\u2019 set and managers\u2019 set may not overlap at all ⇒ I does not follow (the classic invalid conversion of "some").',
    steps: [
      'II: "some graduates are managers" converts directly to "some managers are graduates".',
      'I: no premise links engineers to managers — possibility ≠ logical necessity.',
    ],
  },
]
