import { createBank, type QuestionInput } from './types'

/**
 * SBI PO / SBI Clerk (Prelims) English Language bank.
 *
 * Both prelims share the same English pattern — reading comprehension, cloze test,
 * error spotting, phrase replacement, fillers, para jumbles, word swap and
 * vocabulary. Every question here is newly written to follow that pattern; none is
 * an actual paper question.
 *
 * The engine shuffles questions, so passage-based questions (RC, cloze) repeat
 * their passage in `questionText` instead of relying on neighbouring questions.
 */

const RC_PASSAGE = `Read the passage and answer the question that follows.

Over the past decade, India's payments landscape has changed almost beyond recognition. A street vendor who once insisted on cash now displays a QR code, and a farmer in a remote district can receive a government subsidy directly into a bank account opened only a few years earlier. Much of this transformation rests on a layered public infrastructure: a biometric identity system, low-cost bank accounts and an interoperable real-time payments network that any bank or app can plug into.

Yet access is not the same as inclusion. Surveys repeatedly find that a large share of newly opened accounts see little activity beyond the receipt of transfers, which are often withdrawn in cash on the very day they arrive. For many households, the formal system remains a pipe rather than a place to save, borrow or insure. Distrust, low financial literacy and the fear of hidden charges keep them at the edge.

The risks, too, have grown alongside the convenience. Fraudsters have learned to exploit the very speed that makes instant payments attractive, persuading users to approve requests they do not understand. Regulators have responded with transaction limits and awareness campaigns, but critics argue that the burden of vigilance still falls disproportionately on the least experienced users.

The next phase, therefore, may matter more than the first. Building the rails was a feat of engineering; persuading people to trust and use them for more than a transit stop is a question of design, education and accountability.`

const CLOZE_PASSAGE = `In the passage below, each blank is numbered. Choose the word that best fits the indicated blank.

Small businesses are often described as the backbone of the economy, yet many of them struggle to (1) ______ formal credit. Lenders, (2) ______ by the lack of audited accounts, either reject their applications or demand collateral that most owners simply do not (3) ______. Digital records of sales and tax filings are now beginning to (4) ______ this gap, allowing banks to assess repayment capacity from cash flows rather than property. If this approach is adopted widely, it could (5) ______ a new wave of entrepreneurship, provided that lenders remain (6) ______ about the risks.`

const ERROR_PROMPT =
  "Read the sentence to find out whether there is a grammatical error in it. The error, if any, will be in one part of the sentence. If there is no error, choose 'No error'."

const PHRASE_PROMPT =
  "Which of the following should replace the phrase in capitals to make the sentence grammatically and contextually correct? If no replacement is needed, choose 'No replacement required'."

const SWAP_PROMPT =
  "In the sentence below, four words are given in capitals. Which pair should be interchanged to make the sentence meaningful and grammatically correct? If no interchange is needed, choose 'No interchange required'."

const rows: QuestionInput[] = [
  // ── Reading Comprehension ──────────────────────────────────────────────────
  {
    id: 'sbi-eng-01',
    topic: 'Reading Comprehension',
    subtopic: 'Main idea',
    difficulty: 'moderate',
    questionText: `${RC_PASSAGE}\n\nWhich of the following best expresses the central idea of the passage?`,
    options: [
      "India's payments infrastructure has widened access, but genuine financial inclusion still depends on trust, literacy and safeguards.",
      'Digital payments have completely replaced cash transactions in rural and urban India alike.',
      'Instant payments are too risky and should be restricted until fraud is eliminated.',
      'The biometric identity system is the only reason farmers now receive government subsidies.',
    ],
    correctOption: 'A',
    explanation:
      'The passage praises the new rails (para 1), then argues access ≠ inclusion (para 2), notes new risks (para 3) and says the next phase needs trust, education and accountability (para 4). Only option A captures all of this; the others are exaggerations or single details.',
    pattern: 'SBI PO Prelims reading comprehension',
  },
  {
    id: 'sbi-eng-02',
    topic: 'Reading Comprehension',
    subtopic: 'Factual detail',
    difficulty: 'easy',
    questionText: `${RC_PASSAGE}\n\nAccording to the passage, which of the following forms part of the "layered public infrastructure"?\nI. A biometric identity system\nII. Low-cost bank accounts\nIII. Private credit bureaus`,
    options: ['Only I', 'Only I and II', 'Only II and III', 'All I, II and III'],
    correctOption: 'B',
    explanation:
      'Paragraph 1 lists a biometric identity system, low-cost bank accounts and an interoperable real-time payments network. Credit bureaus are never mentioned, so only I and II are correct.',
    pattern: 'SBI Clerk Prelims reading comprehension',
  },
  {
    id: 'sbi-eng-03',
    topic: 'Reading Comprehension',
    subtopic: 'Meaning of a phrase',
    difficulty: 'moderate',
    questionText: `${RC_PASSAGE}\n\nWhat does the author mean by saying that for many households "the formal system remains a pipe rather than a place to save, borrow or insure"?`,
    options: [
      'Households prefer to keep their savings in water-related investments.',
      'Banks have physically shut branches in rural areas.',
      'Households use their accounts mainly to receive and withdraw money rather than for wider financial services.',
      'The formal financial system charges hidden fees on every transfer.',
    ],
    correctOption: 'C',
    explanation:
      'The preceding sentence says transfers are received and withdrawn in cash on the same day. A "pipe" is something money merely flows through, so the account is used only as a channel, not for saving, borrowing or insurance.',
    pattern: 'SBI PO Prelims reading comprehension',
  },
  {
    id: 'sbi-eng-04',
    topic: 'Reading Comprehension',
    subtopic: 'Inference',
    difficulty: 'difficult',
    questionText: `${RC_PASSAGE}\n\nWhich of the following can be inferred from the passage?`,
    options: [
      'Regulators have taken no steps to protect users of instant payments.',
      'Street vendors continue to refuse digital payments.',
      'Fraud has declined as payment speeds have increased.',
      'Judging financial inclusion only by the number of accounts opened may overstate real progress.',
    ],
    correctOption: 'D',
    explanation:
      'Paragraph 2 says many new accounts are barely used, so counting accounts alone would overstate inclusion. A is contradicted (limits and campaigns exist), B is contradicted (vendors display QR codes) and C is contradicted (risks have grown).',
    pattern: 'SBI PO Prelims reading comprehension',
  },
  {
    id: 'sbi-eng-05',
    topic: 'Reading Comprehension',
    subtopic: 'Factual detail',
    difficulty: 'moderate',
    questionText: `${RC_PASSAGE}\n\nWhy do critics consider the regulatory response insufficient?`,
    options: [
      'Transaction limits have made instant payments too slow to be useful.',
      'Awareness campaigns were run only in urban areas.',
      'The responsibility for staying alert still rests heavily on the least experienced users.',
      'Regulators have allowed banks to levy hidden charges.',
    ],
    correctOption: 'C',
    explanation:
      'Paragraph 3: "critics argue that the burden of vigilance still falls disproportionately on the least experienced users." The other options are not stated.',
    pattern: 'SBI Clerk Prelims reading comprehension',
  },
  {
    id: 'sbi-eng-06',
    topic: 'Reading Comprehension',
    subtopic: 'Synonym from passage',
    difficulty: 'easy',
    questionText: `${RC_PASSAGE}\n\nChoose the word most similar in meaning to "DISPROPORTIONATELY" as used in the passage.`,
    options: ['Rarely', 'Evenly', 'Occasionally', 'Unevenly'],
    correctOption: 'D',
    explanation:
      '"Disproportionately" means out of proportion, i.e. unequally or unevenly shared. "Evenly" is its opposite.',
    pattern: 'SBI Clerk Prelims RC vocabulary',
  },
  {
    id: 'sbi-eng-07',
    topic: 'Reading Comprehension',
    subtopic: 'Antonym from passage',
    difficulty: 'moderate',
    questionText: `${RC_PASSAGE}\n\nChoose the word most opposite in meaning to "VIGILANCE" as used in the passage.`,
    options: ['Watchfulness', 'Negligence', 'Caution', 'Alertness'],
    correctOption: 'B',
    explanation:
      'Vigilance is careful watchfulness. Watchfulness, caution and alertness are synonyms; negligence (lack of proper care) is the opposite.',
    pattern: 'SBI PO Prelims RC vocabulary',
  },
  {
    id: 'sbi-eng-08',
    topic: 'Reading Comprehension',
    subtopic: 'Tone',
    difficulty: 'difficult',
    questionText: `${RC_PASSAGE}\n\nWhich of the following best describes the tone of the author?`,
    options: ['Cautiously optimistic', 'Bitterly critical', 'Indifferent', 'Unreservedly celebratory'],
    correctOption: 'A',
    explanation:
      'The author acknowledges a real achievement ("a feat of engineering") but stresses gaps and risks that still need work. That balance is cautious optimism — neither pure praise nor bitter criticism.',
    pattern: 'SBI PO Prelims reading comprehension',
  },

  // ── Cloze Test ─────────────────────────────────────────────────────────────
  {
    id: 'sbi-eng-09',
    topic: 'Cloze Test',
    subtopic: 'Blank (1)',
    difficulty: 'easy',
    questionText: `${CLOZE_PASSAGE}\n\nWhich word fits blank (1)?`,
    options: ['avail', 'access', 'approach to', 'reach at'],
    correctOption: 'B',
    explanation:
      '"Struggle to access formal credit" is correct. "Avail" needs "avail of", while "approach to" and "reach at" are ungrammatical after "to".',
    pattern: 'SBI Clerk Prelims cloze test',
  },
  {
    id: 'sbi-eng-10',
    topic: 'Cloze Test',
    subtopic: 'Blank (2)',
    difficulty: 'moderate',
    questionText: `${CLOZE_PASSAGE}\n\nWhich word fits blank (2)?`,
    options: ['encouraged', 'attracted', 'deterred', 'satisfied'],
    correctOption: 'C',
    explanation:
      'Lenders reject applications because of the missing accounts, so they are put off — "deterred". The other words suggest a positive reaction that contradicts the rejection.',
    pattern: 'SBI PO Prelims cloze test',
  },
  {
    id: 'sbi-eng-11',
    topic: 'Cloze Test',
    subtopic: 'Blank (3)',
    difficulty: 'easy',
    questionText: `${CLOZE_PASSAGE}\n\nWhich word fits blank (3)?`,
    options: ['possess', 'afford to', 'deserve', 'lend'],
    correctOption: 'A',
    explanation:
      'Owners do not "possess" (own) the collateral demanded. "Afford to" needs a verb after it, "deserve" changes the meaning and owners do not "lend" collateral.',
    pattern: 'SBI Clerk Prelims cloze test',
  },
  {
    id: 'sbi-eng-12',
    topic: 'Cloze Test',
    subtopic: 'Blank (4)',
    difficulty: 'moderate',
    questionText: `${CLOZE_PASSAGE}\n\nWhich word fits blank (4)?`,
    options: ['widen', 'ignore', 'deepen', 'bridge'],
    correctOption: 'D',
    explanation:
      'Digital records help banks assess borrowers, i.e. they close the gap — "bridge this gap". Widen, deepen and ignore imply the opposite.',
    pattern: 'SBI PO Prelims cloze test',
  },
  {
    id: 'sbi-eng-13',
    topic: 'Cloze Test',
    subtopic: 'Blank (5)',
    difficulty: 'moderate',
    questionText: `${CLOZE_PASSAGE}\n\nWhich word fits blank (5)?`,
    options: ['suppress', 'unleash', 'postpone', 'restrict'],
    correctOption: 'B',
    explanation:
      'Wider access to credit would release a wave of new businesses — "unleash". The other options mean holding it back.',
    pattern: 'SBI PO Prelims cloze test',
  },
  {
    id: 'sbi-eng-14',
    topic: 'Cloze Test',
    subtopic: 'Blank (6)',
    difficulty: 'difficult',
    questionText: `${CLOZE_PASSAGE}\n\nWhich word fits blank (6)?`,
    options: ['careless', 'indifferent', 'reckless', 'prudent'],
    correctOption: 'D',
    explanation:
      '"Provided that" sets a condition for success, so lenders must stay careful — "prudent about the risks". The other three all mean the opposite.',
    pattern: 'SBI PO Prelims cloze test',
  },

  // ── Error Spotting ─────────────────────────────────────────────────────────
  {
    id: 'sbi-eng-15',
    topic: 'Error Spotting',
    subtopic: 'Subject–verb agreement',
    difficulty: 'easy',
    questionText: `${ERROR_PROMPT}\n\n(A) Each of the trainees have / (B) submitted the project report / (C) before the deadline.`,
    options: ['(A) Each of the trainees have', '(B) submitted the project report', '(C) before the deadline', 'No error'],
    correctOption: 'A',
    explanation: '"Each of" takes a singular verb: "Each of the trainees has submitted…".',
    pattern: 'SBI Clerk Prelims error spotting',
  },
  {
    id: 'sbi-eng-16',
    topic: 'Error Spotting',
    subtopic: 'Conditionals',
    difficulty: 'moderate',
    questionText: `${ERROR_PROMPT}\n\n(A) If I would have known about the delay, / (B) I would have booked / (C) another flight to Mumbai.`,
    options: [
      '(A) If I would have known about the delay,',
      '(B) I would have booked',
      '(C) another flight to Mumbai',
      'No error',
    ],
    correctOption: 'A',
    explanation:
      'A third conditional uses the past perfect in the if-clause: "If I had known about the delay, I would have booked…". "Would have" never appears in the if-clause.',
    pattern: 'SBI PO Prelims error spotting',
  },
  {
    id: 'sbi-eng-17',
    topic: 'Error Spotting',
    subtopic: 'Superfluous preposition',
    difficulty: 'moderate',
    questionText: `${ERROR_PROMPT}\n\n(A) The committee has decided / (B) to discuss about the proposal / (C) in its next meeting.`,
    options: ['(A) The committee has decided', '(B) to discuss about the proposal', '(C) in its next meeting', 'No error'],
    correctOption: 'B',
    explanation: '"Discuss" is transitive and takes a direct object — "to discuss the proposal". "About" is superfluous.',
    pattern: 'SBI Clerk Prelims error spotting',
  },
  {
    id: 'sbi-eng-18',
    topic: 'Error Spotting',
    subtopic: 'Correlative conjunctions',
    difficulty: 'difficult',
    questionText: `${ERROR_PROMPT}\n\n(A) No sooner had the bank announced / (B) the new savings scheme / (C) when thousands of customers rushed in.`,
    options: [
      '(A) No sooner had the bank announced',
      '(B) the new savings scheme',
      '(C) when thousands of customers rushed in',
      'No error',
    ],
    correctOption: 'C',
    explanation: '"No sooner" is always followed by "than", not "when": "…than thousands of customers rushed in."',
    pattern: 'SBI PO Prelims error spotting',
  },
  {
    id: 'sbi-eng-19',
    topic: 'Error Spotting',
    subtopic: 'Articles & uncountable nouns',
    difficulty: 'moderate',
    questionText: `${ERROR_PROMPT}\n\n(A) She gave me / (B) an useful advice / (C) about investing my savings.`,
    options: ['(A) She gave me', '(B) an useful advice', '(C) about investing my savings', 'No error'],
    correctOption: 'B',
    explanation:
      '"Useful" begins with a "yoo" sound, so it takes "a", and "advice" is uncountable, so it cannot take an article at all: "some useful advice" or "a useful piece of advice".',
    pattern: 'SBI Clerk Prelims error spotting',
  },
  {
    id: 'sbi-eng-20',
    topic: 'Error Spotting',
    subtopic: 'No error',
    difficulty: 'easy',
    questionText: `${ERROR_PROMPT}\n\n(A) Despite the heavy rain, / (B) the auditors completed / (C) their inspection before noon.`,
    options: ['(A) Despite the heavy rain,', '(B) the auditors completed', '(C) their inspection before noon', 'No error'],
    correctOption: 'D',
    explanation:
      '"Despite" correctly takes a noun phrase without "of", the plural subject "auditors" matches "their", and the tense is consistent. The sentence is correct.',
    pattern: 'SBI Clerk Prelims error spotting',
  },
  {
    id: 'sbi-eng-21',
    topic: 'Error Spotting',
    subtopic: '"One of the … who" agreement',
    difficulty: 'difficult',
    questionText: `${ERROR_PROMPT}\n\n(A) He is one of the few officers / (B) who puts / (C) customers before targets.`,
    options: ['(A) He is one of the few officers', '(B) who puts', '(C) customers before targets', 'No error'],
    correctOption: 'B',
    explanation:
      'In "one of the officers who…", the relative pronoun "who" refers to the plural "officers", so the verb must be plural: "who put customers before targets".',
    pattern: 'SBI PO Prelims error spotting',
  },

  // ── Phrase Replacement ─────────────────────────────────────────────────────
  {
    id: 'sbi-eng-22',
    topic: 'Phrase Replacement',
    difficulty: 'easy',
    questionText: `${PHRASE_PROMPT}\n\nThe revised KYC norms will COME IN EFFECT from the first of next month.`,
    options: ['come into effect', 'came into effect', 'comes to effect', 'No replacement required'],
    correctOption: 'A',
    explanation: 'The idiom is "come into effect". The future "will" keeps the base form "come".',
    pattern: 'SBI Clerk Prelims phrase replacement',
  },
  {
    id: 'sbi-eng-23',
    topic: 'Phrase Replacement',
    difficulty: 'moderate',
    questionText: `${PHRASE_PROMPT}\n\nAfter the meeting, the client INSISTED TO PAY the bill himself.`,
    options: ['insisted for paying', 'insisted on paying', 'insisted in paying', 'No replacement required'],
    correctOption: 'B',
    explanation: '"Insist" is followed by "on" + gerund: "insisted on paying".',
    pattern: 'SBI PO Prelims phrase replacement',
  },
  {
    id: 'sbi-eng-24',
    topic: 'Phrase Replacement',
    difficulty: 'moderate',
    questionText: `${PHRASE_PROMPT}\n\nIt is high time the government TAKES firm steps to curb food inflation.`,
    options: ['take', 'has taken', 'took', 'No replacement required'],
    correctOption: 'C',
    explanation: '"It is high time" is followed by the past subjunctive (simple past form): "It is high time the government took…".',
    pattern: 'SBI PO Prelims phrase replacement',
  },
  {
    id: 'sbi-eng-25',
    topic: 'Phrase Replacement',
    difficulty: 'difficult',
    questionText: `${PHRASE_PROMPT}\n\nHAD HE INVESTED his bonus wisely, he would not have faced a cash crunch this year.`,
    options: ['If he invested', 'Had he been investing', 'Did he invest', 'No replacement required'],
    correctOption: 'D',
    explanation:
      '"Had he invested…, he would not have faced…" is a correct inverted third conditional (= "If he had invested"). No change is needed.',
    pattern: 'SBI PO Prelims phrase replacement',
  },
  {
    id: 'sbi-eng-26',
    topic: 'Phrase Replacement',
    difficulty: 'difficult',
    questionText: `${PHRASE_PROMPT}\n\nThe audit report, ALONG WITH THE ANNEXURES, WERE submitted to the board on Monday.`,
    options: [
      'along with the annexures, was',
      'along with the annexures were',
      'and along with the annexures, were',
      'No replacement required',
    ],
    correctOption: 'A',
    explanation:
      'A phrase introduced by "along with" does not change the number of the subject. The subject is "The audit report" (singular), so the verb must be "was".',
    pattern: 'SBI PO Prelims phrase replacement',
  },

  // ── Fillers ────────────────────────────────────────────────────────────────
  {
    id: 'sbi-eng-27',
    topic: 'Fillers',
    subtopic: 'Double filler',
    difficulty: 'easy',
    questionText: 'Choose the pair of words that best fills both blanks.\n\nThe bank has ______ its deposit rates to ______ more depositors.',
    options: ['raised, attract', 'lowered, attract', 'raised, repel', 'reduced, invite'],
    correctOption: 'A',
    explanation:
      'Higher deposit rates draw savers in, so "raised … attract" is the only logical pair. Lowering or reducing rates would not invite more depositors, and "raised … repel" is contradictory.',
    pattern: 'SBI Clerk Prelims double fillers',
  },
  {
    id: 'sbi-eng-28',
    topic: 'Fillers',
    subtopic: 'Double filler',
    difficulty: 'moderate',
    questionText: 'Choose the pair of words that best fills both blanks.\n\nDespite repeated ______, the firm failed to ______ its tax dues on time.',
    options: ['praises, clear', 'warnings, collect', 'reminders, clear', 'reminders, avoid'],
    correctOption: 'C',
    explanation:
      '"Despite repeated reminders, the firm failed to clear its tax dues" is logical. Firms do not "collect" their own dues, "avoid" reverses the meaning and "praises" does not fit "despite".',
    pattern: 'SBI PO Prelims double fillers',
  },
  {
    id: 'sbi-eng-29',
    topic: 'Fillers',
    subtopic: 'Double filler',
    difficulty: 'moderate',
    questionText:
      "Choose the pair of words that best fills both blanks.\n\nThe minister's speech was so ______ that even his critics found it hard to ______ his arguments.",
    options: ['vague, accept', 'persuasive, refute', 'boring, follow', 'lengthy, support'],
    correctOption: 'B',
    explanation:
      '"Even his critics" signals a surprise in his favour: the speech was so persuasive that critics could not refute (disprove) it.',
    pattern: 'SBI PO Prelims double fillers',
  },
  {
    id: 'sbi-eng-30',
    topic: 'Fillers',
    subtopic: 'Double filler',
    difficulty: 'difficult',
    questionText:
      "Choose the pair of words that best fills both blanks.\n\nThe committee's findings were ______; they neither confirmed the allegations nor ______ them entirely.",
    options: ['conclusive, dismissed', 'damning, supported', 'unequivocal, rejected', 'inconclusive, dismissed'],
    correctOption: 'D',
    explanation:
      'Findings that neither confirm nor fully dismiss allegations are "inconclusive". "Conclusive" and "unequivocal" contradict the second clause, and "damning" means they did confirm them.',
    pattern: 'SBI PO Prelims double fillers',
  },
  {
    id: 'sbi-eng-31',
    topic: 'Fillers',
    subtopic: 'Double filler',
    difficulty: 'difficult',
    questionText:
      'Choose the pair of words that best fills both blanks.\n\nRather than ______ the setback, the start-up used it as an opportunity to ______ its business model.',
    options: ['dwell on, rethink', 'dwell in, rethink', 'celebrate, abandon', 'ignore, retain'],
    correctOption: 'A',
    explanation:
      '"Dwell on" (keep thinking about) a setback is the correct phrasal verb; "dwell in" means to live in a place. Using a setback to "rethink" the model completes the contrast set up by "rather than".',
    pattern: 'SBI PO Prelims double fillers',
  },

  // ── Para Jumbles ───────────────────────────────────────────────────────────
  {
    id: 'sbi-eng-32',
    topic: 'Para Jumbles',
    difficulty: 'easy',
    questionText:
      'Rearrange the sentences P, Q, R and S to form a coherent paragraph.\n\nP. As a result, many customers now complete transactions without visiting a branch.\nQ. Over the last decade, banks have invested heavily in mobile applications.\nR. These apps allow users to transfer money, pay bills and open deposits instantly.\nS. Branches, in turn, are being redesigned as advisory centres rather than cash counters.',
    options: ['RQPS', 'QRPS', 'QPRS', 'SQRP'],
    correctOption: 'B',
    explanation:
      'Q introduces the investment in apps, R explains what "these apps" do, P gives the result ("As a result") and S the follow-on effect on branches ("in turn"). Order: QRPS.',
    pattern: 'SBI Clerk Prelims para jumbles',
  },
  {
    id: 'sbi-eng-33',
    topic: 'Para Jumbles',
    difficulty: 'moderate',
    questionText:
      "Rearrange the sentences P, Q, R and S to form a coherent paragraph.\n\nP. However, this rarely happens because most people underestimate how long they will live.\nQ. Ideally, retirement savings should be planned with one's life expectancy in mind.\nR. Consequently, many retirees exhaust their savings well before their needs end.\nS. Financial planners therefore advise starting early and reviewing plans every few years.",
    options: ['PQRS', 'QRPS', 'QPRS', 'SPQR'],
    correctOption: 'C',
    explanation:
      'Q states the ideal, P contrasts it ("However, this rarely happens"), R gives the consequence and S offers the advice that follows ("therefore"). Order: QPRS.',
    pattern: 'SBI PO Prelims para jumbles',
  },
  {
    id: 'sbi-eng-34',
    topic: 'Para Jumbles',
    difficulty: 'moderate',
    questionText:
      'Rearrange the sentences P, Q, R and S to form a coherent paragraph.\n\nP. The central bank, worried about rising prices, raised the repo rate by 25 basis points.\nQ. Borrowing costs for home and car loans rose within weeks.\nR. Commercial banks quickly passed this increase on to their customers.\nS. Demand for such loans, predictably, began to slow.',
    options: ['PQRS', 'RPQS', 'PRSQ', 'PRQS'],
    correctOption: 'D',
    explanation:
      'P is the trigger (repo rate hike), R shows banks passing "this increase" on, Q the resulting higher loan costs and S the effect on demand for "such loans". Order: PRQS.',
    pattern: 'SBI PO Prelims para jumbles',
  },
  {
    id: 'sbi-eng-35',
    topic: 'Para Jumbles',
    difficulty: 'difficult',
    questionText:
      'Rearrange the sentences P, Q, R and S to form a coherent paragraph.\n\nP. It was this fear, rather than any lack of opportunity, that kept her from applying.\nQ. Meera had always believed that she was not qualified for leadership roles.\nR. When a mentor finally pointed out her record of successful projects, she reconsidered.\nS. Within a year of applying, she was heading a team of twenty.',
    options: ['QPRS', 'QRPS', 'PQRS', 'RQPS'],
    correctOption: 'A',
    explanation:
      'Q introduces Meera and her belief, P refers back to it as "this fear", R describes the turning point and S the outcome. Order: QPRS.',
    pattern: 'SBI PO Prelims para jumbles',
  },
  {
    id: 'sbi-eng-36',
    topic: 'Para Jumbles',
    subtopic: 'Position of a sentence',
    difficulty: 'difficult',
    questionText:
      'Rearrange the sentences P, Q, R and S to form a coherent paragraph and choose the sentence that comes THIRD.\n\nP. Unlike physical cash, such a currency would be issued and tracked digitally by the central bank.\nQ. Several countries are now experimenting with central bank digital currencies.\nR. Supporters argue it could make payments cheaper and reduce the cost of printing notes.\nS. Critics, on the other hand, worry about privacy and the possible weakening of commercial banks.',
    options: ['P', 'Q', 'R', 'S'],
    correctOption: 'C',
    explanation:
      'Q introduces the topic, P explains "such a currency", R gives the supporters’ view and S the critics’ view ("on the other hand"). Order QPRS, so the third sentence is R.',
    pattern: 'SBI PO Prelims para jumbles',
  },

  // ── Word Swap ──────────────────────────────────────────────────────────────
  {
    id: 'sbi-eng-37',
    topic: 'Word Swap',
    difficulty: 'moderate',
    questionText: `${SWAP_PROMPT}\n\nThe COLLATERAL (A) was REJECTED (B) because the applicant could not PROVIDE (C) an adequate LOAN (D).`,
    options: ['A-B', 'B-C', 'A-D', 'No interchange required'],
    correctOption: 'C',
    explanation:
      'Swapping A and D gives "The loan was rejected because the applicant could not provide an adequate collateral", which makes sense.',
    pattern: 'SBI PO Prelims word swap',
  },
  {
    id: 'sbi-eng-38',
    topic: 'Word Swap',
    difficulty: 'easy',
    questionText: `${SWAP_PROMPT}\n\nThe INVESTORS (A) were ALARMED (B) by the sudden FALL (C) in the company's SHARE (D) price.`,
    options: ['A-C', 'B-D', 'A-B', 'No interchange required'],
    correctOption: 'D',
    explanation: 'The sentence is already meaningful and grammatically correct, so no interchange is needed.',
    pattern: 'SBI Clerk Prelims word swap',
  },
  {
    id: 'sbi-eng-39',
    topic: 'Word Swap',
    difficulty: 'difficult',
    questionText: `${SWAP_PROMPT}\n\nAlthough the PROFITS (A) of the firm rose sharply, its REVENUE (B) remained FLAT (C) because of RISING (D) costs.`,
    options: ['A-B', 'A-C', 'B-D', 'No interchange required'],
    correctOption: 'A',
    explanation:
      'Rising costs eat into profit, not revenue. Swapping A and B gives "Although the revenue of the firm rose sharply, its profits remained flat because of rising costs", which is logical.',
    pattern: 'SBI PO Prelims word swap',
  },
  {
    id: 'sbi-eng-40',
    topic: 'Word Swap',
    difficulty: 'moderate',
    questionText: `${SWAP_PROMPT}\n\nThe customer DEBITED (A) a COMPLAINT (B) after the bank FILED (C) his account TWICE (D).`,
    options: ['B-C', 'A-C', 'C-D', 'No interchange required'],
    correctOption: 'B',
    explanation:
      'Swapping A and C gives "The customer filed a complaint after the bank debited his account twice".',
    pattern: 'SBI Clerk Prelims word swap',
  },

  // ── Vocabulary ─────────────────────────────────────────────────────────────
  {
    id: 'sbi-eng-41',
    topic: 'Vocabulary',
    subtopic: 'Synonym',
    difficulty: 'easy',
    questionText: 'Choose the word most similar in meaning to AUGMENT.',
    options: ['Reduce', 'Increase', 'Examine', 'Delay'],
    correctOption: 'B',
    explanation: '"Augment" means to make something greater — increase. "Reduce" is its antonym.',
    pattern: 'SBI Clerk Prelims vocabulary',
  },
  {
    id: 'sbi-eng-42',
    topic: 'Vocabulary',
    subtopic: 'Antonym',
    difficulty: 'moderate',
    questionText: 'Choose the word most opposite in meaning to FRUGAL.',
    options: ['Thrifty', 'Economical', 'Extravagant', 'Careful'],
    correctOption: 'C',
    explanation: '"Frugal" means sparing with money. Thrifty and economical are synonyms; "extravagant" (spending lavishly) is the antonym.',
    pattern: 'SBI PO Prelims vocabulary',
  },
  {
    id: 'sbi-eng-43',
    topic: 'Vocabulary',
    subtopic: 'Synonym',
    difficulty: 'moderate',
    questionText: 'Choose the word most similar in meaning to CANDID.',
    options: ['Frank', 'Secretive', 'Rude', 'Cautious'],
    correctOption: 'A',
    explanation: '"Candid" means open and honest — frank. Being candid is not the same as being rude.',
    pattern: 'SBI Clerk Prelims vocabulary',
  },
  {
    id: 'sbi-eng-44',
    topic: 'Vocabulary',
    subtopic: 'Antonym',
    difficulty: 'difficult',
    questionText: 'Choose the word most opposite in meaning to OBSEQUIOUS.',
    options: ['Servile', 'Fawning', 'Submissive', 'Assertive'],
    correctOption: 'D',
    explanation:
      '"Obsequious" means excessively eager to please or obey. Servile, fawning and submissive are synonyms; "assertive" is the opposite.',
    pattern: 'SBI PO Prelims vocabulary',
  },

  // ── Word Usage ─────────────────────────────────────────────────────────────
  {
    id: 'sbi-eng-45',
    topic: 'Word Usage',
    difficulty: 'moderate',
    questionText:
      'In which of the following sentences is the word BEAR used appropriately?\n\nI. The bank will bear the cost of the system upgrade.\nII. I cannot bear to watch the markets fall again.\nIII. The mango tree did not bear any fruit this year.',
    options: ['Only I', 'Only I and II', 'Only II and III', 'All I, II and III'],
    correctOption: 'D',
    explanation:
      'All three are correct uses: "bear the cost" (carry), "cannot bear to" (tolerate) and "bear fruit" (produce).',
    pattern: 'SBI PO Prelims word usage',
  },
  {
    id: 'sbi-eng-46',
    topic: 'Word Usage',
    difficulty: 'moderate',
    questionText:
      'In which of the following sentences is the word BALANCE used appropriately?\n\nI. Please check the balance in your savings account before withdrawing.\nII. The waiter balanced three plates on one arm.\nIII. He balanced the meeting early to catch his train.',
    options: ['Only I', 'Only I and II', 'Only II and III', 'All I, II and III'],
    correctOption: 'B',
    explanation:
      'I (amount remaining) and II (keep steady) are correct. In III "balanced" makes no sense — the intended word is "left" or "ended".',
    pattern: 'SBI Clerk Prelims word usage',
  },
  {
    id: 'sbi-eng-47',
    topic: 'Word Usage',
    subtopic: 'Affect vs Effect',
    difficulty: 'difficult',
    questionText: 'Which of the following sentences uses AFFECT or EFFECT correctly?',
    options: [
      'The new rule will effect all savings account holders.',
      'The rate cut had little affect on inflation.',
      'The strike affected branch operations for two days.',
      'The medicine took affect within an hour.',
    ],
    correctOption: 'C',
    explanation:
      '"Affect" is normally the verb (to influence) and "effect" the noun (a result). C uses the verb correctly; A needs "affect", while B and D need the noun "effect".',
    pattern: 'SBI PO Prelims word usage',
  },
]

export const sbiEnglishQuestions = createBank('SBI_ENGLISH', rows)
