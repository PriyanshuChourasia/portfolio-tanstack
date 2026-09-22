import type { QuizConfig } from './quiz-types'
import { bankPoQuiz } from './bank-po-quiz-data'

export interface InterviewQuestion {
  id: string
  question: string
  answer: string
}

export interface InterviewSubtopic {
  id: string
  topic: string
  questions: InterviewQuestion[]
  /** When set, this subtopic renders an interactive scored quiz instead of the Q&A accordion. */
  quiz?: QuizConfig
}

export interface InterviewGroup {
  id: string
  topic: string
  questions: InterviewQuestion[]
  subtopics?: InterviewSubtopic[]
}

export const interviewGroups: InterviewGroup[] = [
  {
    id: 'load-balancers',
    topic: 'Load Balancers',
    questions: [
      {
        id: 'what-is-load-balancing',
        question: 'What is load balancing?',
        answer:
          "Load balancing is the practice of distributing network traffic or computational workloads across multiple servers to improve an application's performance and reliability.",
      },
      {
        id: 'what-is-a-load-balancer',
        question: 'What is a load balancer?',
        answer:
          'A load balancer is a tool or application — either hardware-based or software-based — that distributes workloads and traffic among multiple servers.',
      },
      {
        id: 'static-vs-dynamic-load-balancing',
        question:
          'What is the difference between static and dynamic load balancing algorithms?',
        answer:
          'Static load balancing algorithms assign traffic based on a predetermined plan, without considering server status, while dynamic algorithms adjust traffic distribution in real time based on server health and performance.',
      },
      {
        id: 'server-monitoring',
        question: 'What is server monitoring in load balancing?',
        answer:
          'Server monitoring involves regularly checking the health and performance of servers so the load balancer can distribute traffic efficiently and avoid overloading unhealthy servers.',
      },
      {
        id: 'failover',
        question: 'What is failover in load balancing?',
        answer:
          'Failover is the automatic rerouting of traffic to backup servers when a primary server fails, ensuring near-continuous service availability.',
      },
      {
        id: 'how-load-balancing-improves-performance',
        question: 'How does load balancing improve performance?',
        answer:
          'Load balancing reduces the strain on each server, making servers more efficient, and helping to make sure all users do not get stuck waiting for responses from the same server (or server pool). This speeds up response times and lowers latency, resulting in faster and more efficient service for users.',
      },
      {
        id: 'common-load-balancing-methods',
        question: 'What are common load balancing methods?',
        answer:
          'Common methods include round-robin DNS, weighted round-robin DNS, least connection, weighted least connection, and resource-based load balancing.',
      },
      {
        id: 'where-load-balancing-is-used',
        question: 'Where is load balancing commonly used?',
        answer:
          'Load balancing is commonly used in web applications, data centers, and large networks to manage and distribute computational workloads effectively.',
      },
      {
        id: 'global-server-load-balancing',
        question: 'What is global server load balancing (GSLB)?',
        answer:
          'Global server load balancing (GSLB) distributes Internet traffic across servers located around the world, helping to optimize performance for users regardless of their location.',
      },
      {
        id: 'load-balancing-user-experience',
        question: 'How does load balancing affect the user experience?',
        answer:
          'Load balancing minimizes wait times and ensures a smoother, more responsive service, which leads to a better experience for end users.',
      },
      {
        id: 'types-of-load-balancer',
        question: 'What are the types of load balancers?',
        answer: 'Hardware load balancer and Software load balancer.',
      },
    ],
    subtopics: [
      {
        id: 'load-balancing-algorithm-types',
        topic: 'Types of Load Balancing Algorithms',
        questions: [
          {
            id: 'types-of-load-balancing-algorithms',
            question: 'What are the types of load balancing algorithms?',
            answer: 'Static load balancer and Dynamic load balancer.',
          },
        ],
      },
    ],
  },
  {
    id: 'government-jobs-exam',
    topic: 'Government Jobs Exam',
    questions: [
      {
        id: 'why-prepare-for-govt-exams',
        question: 'Why do candidates prepare specifically for government exams?',
        answer:
          'Government job exams (SSC, UPSC, Banking, Railways, State PSCs, etc.) are highly competitive, standardized, and test a mix of general awareness, reasoning, quantitative aptitude, and subject knowledge under strict time limits — so focused, exam-specific preparation on pattern, syllabus, and previous-year papers matters as much as general knowledge.',
      },
      {
        id: 'common-sections-across-govt-exams',
        question: 'What sections are common across most government exams?',
        answer:
          'Most government exams share a core set of sections: General Intelligence & Reasoning, Quantitative Aptitude, General Awareness/General Knowledge, and English Language/Comprehension. Exam-specific papers (e.g. a Finance & Accounts paper for SSC CGL Tier 2, or an optional subject for UPSC Mains) are layered on top of this common core.',
      },
      {
        id: 'negative-marking',
        question: 'Is there negative marking in government exams?',
        answer:
          'Most objective, computer-based government exams (SSC, Banking, Railways) apply negative marking for wrong answers, typically a fraction of the marks allotted to that question (commonly around 0.25 to 0.5 marks deducted). Exact negative-marking rules vary by exam and are published in each exam\'s official notification, so always confirm against the current year\'s notification rather than assuming a fixed value.',
      },
    ],
    subtopics: [
      {
        id: 'ssc-cgl',
        topic: 'SSC CGL',
        questions: [
          {
            id: 'what-is-ssc-cgl',
            question: 'What is SSC CGL?',
            answer:
              'SSC CGL (Staff Selection Commission Combined Graduate Level) is a national-level exam conducted by the Staff Selection Commission to recruit graduates into Group B and Group C posts in various ministries, departments, and organizations of the Government of India.',
          },
          {
            id: 'ssc-cgl-exam-stages',
            question: 'What are the stages of the SSC CGL exam?',
            answer:
              'SSC CGL is typically conducted in multiple tiers: Tier 1 (a computer-based objective exam covering Reasoning, General Awareness, Quantitative Aptitude, and English), followed by Tier 2 (a more detailed computer-based exam with subject-specific papers depending on the post applied for), and a Document Verification / Skill Test stage for certain posts.',
          },
          {
            id: 'ssc-cgl-eligibility',
            question: 'What is the basic eligibility for SSC CGL?',
            answer:
              "Candidates generally need a Bachelor's degree from a recognized university, along with age-limit criteria that vary by post (commonly in the 18–32 range, with relaxations for reserved categories). Exact eligibility and age limits differ by post and are specified in each year's official notification.",
          },
          {
            id: 'ssc-cgl-posts',
            question: 'What kind of posts does SSC CGL recruit for?',
            answer:
              'SSC CGL recruits for posts such as Assistant Audit Officer, Assistant Section Officer, Income Tax Inspector, Excise Inspector, Sub Inspector (CBI/NIA), Statistical Investigator, and various Assistant-level posts across central government ministries and departments.',
          },
          {
            id: 'ssc-cgl-preparation-tip',
            question: 'How should a candidate structure SSC CGL preparation?',
            answer:
              'A common approach is: build core concepts in Quant and Reasoning first, maintain a daily current-affairs habit for General Awareness, practice English comprehension and grammar consistently, and solve previous years\' papers and full-length mock tests under timed conditions to build speed and accuracy.',
          },
        ],
      },
      {
        id: 'upsc-civil-services',
        topic: 'UPSC Civil Services',
        questions: [
          {
            id: 'what-is-upsc-cse',
            question: 'What is the UPSC Civil Services Examination?',
            answer:
              'The Civil Services Examination (CSE), conducted by the Union Public Service Commission (UPSC), is used to recruit officers into India\'s premier civil services — including IAS, IPS, and IFS — as well as various central government Group A and Group B services.',
          },
          {
            id: 'upsc-cse-stages',
            question: 'What are the three stages of the UPSC CSE?',
            answer:
              'The exam has three stages: Prelims (two objective papers — General Studies and CSAT, where CSAT is qualifying), Mains (a written exam with essay, general studies, and optional-subject papers), and a Personality Test/Interview for candidates who clear Mains.',
          },
          {
            id: 'upsc-optional-subject',
            question: 'What is the "optional subject" in UPSC Mains?',
            answer:
              'Candidates choose one optional subject (from a list including subjects like History, Geography, Public Administration, Sociology, and various engineering/science disciplines) for two papers in the Mains exam, in addition to the compulsory General Studies and essay papers.',
          },
          {
            id: 'upsc-attempts-age-limit',
            question: 'Are there limits on attempts or age for UPSC CSE?',
            answer:
              'Yes — both the number of attempts and the upper age limit are restricted and vary by category (General, OBC, SC/ST, and other reserved/exempted categories each have different limits). These limits are set out in the official notification each year, so candidates should always check the current year\'s figures rather than relying on general assumptions.',
          },
          {
            id: 'upsc-preparation-tip',
            question: 'What is a common preparation strategy for UPSC CSE?',
            answer:
              'A widely used approach is building a strong NCERT-level foundation across subjects first, reading a daily newspaper or current-affairs digest, taking structured notes for answer writing, practicing Mains-style answer writing regularly, and doing timed Prelims mock tests as the exam approaches.',
          },
        ],
      },
      {
        id: 'banking-ibps-sbi',
        topic: 'Banking (IBPS / SBI)',
        questions: [
          {
            id: 'what-is-ibps',
            question: 'What is IBPS and what does it recruit for?',
            answer:
              'IBPS (Institute of Banking Personnel Selection) conducts common recruitment exams — such as IBPS PO, IBPS Clerk, and IBPS RRB — used by most public sector banks in India to hire Probationary Officers, Clerks, and Regional Rural Bank staff. SBI conducts its own separate PO and Clerk exams outside the IBPS system.',
          },
          {
            id: 'banking-exam-stages',
            question: 'What are the typical stages of a banking recruitment exam?',
            answer:
              'Most banking exams (IBPS PO/Clerk, SBI PO/Clerk) follow a two- or three-stage pattern: a Preliminary exam (objective, screening-level), a Mains exam (objective, more in-depth, often including a descriptive/essay component for PO-level posts), and for PO-level posts, a Group Discussion/Interview stage.',
          },
          {
            id: 'banking-exam-sections',
            question: 'What sections appear in banking exams?',
            answer:
              'Common sections include Reasoning Ability, Quantitative Aptitude, English Language, and — for Mains-level PO exams — General/Banking/Economy Awareness and Computer Aptitude, with sectional as well as overall time limits in most formats.',
          },
          {
            id: 'po-vs-clerk',
            question: 'What is the difference between a Probationary Officer (PO) and a Clerk role?',
            answer:
              'PO is an entry-level officer/managerial track with broader responsibilities and typically a more rigorous selection process (including Mains descriptive paper and interview), while Clerk is a front-line/assistant-level role with a comparatively shorter, more screening-focused selection process.',
          },
          {
            id: 'banking-preparation-tip',
            question: 'How should candidates approach banking exam preparation?',
            answer:
              'A common strategy is to build speed in Quant and Reasoning through daily timed practice (since banking exams are heavily speed-driven), stay updated on banking/financial current affairs, and take full-length sectional and mock tests regularly to manage the strict per-exam and per-section time limits.',
          },
        ],
      },
      {
        id: 'railway-rrb',
        topic: 'Railway (RRB)',
        questions: [
          {
            id: 'what-is-rrb',
            question: 'What is the RRB and what exams does it conduct?',
            answer:
              'The Railway Recruitment Boards (RRBs) conduct exams to recruit staff for Indian Railways, including RRB NTPC (Non-Technical Popular Categories, for posts like Station Master, Goods Guard, and Clerk), RRB Group D (for technician/track-maintainer/helper-level posts), and RRB ALP/Technician exams for loco-related roles.',
          },
          {
            id: 'rrb-ntpc-stages',
            question: 'What are the stages of the RRB NTPC exam?',
            answer:
              'RRB NTPC typically has a First Stage CBT (objective screening exam), a Second Stage CBT (more detailed, post-specific), followed by stage(s) such as a Typing Skill Test or Computer Based Aptitude Test depending on the post, and Document Verification/Medical Examination.',
          },
          {
            id: 'rrb-group-d-stages',
            question: 'What are the stages of the RRB Group D exam?',
            answer:
              'RRB Group D typically involves a Computer Based Test (CBT), followed by a Physical Efficiency Test (PET) for eligible candidates, and then Document Verification and a Medical Examination before final selection.',
          },
          {
            id: 'rrb-exam-sections',
            question: 'What sections appear in RRB exams?',
            answer:
              'RRB exams generally test General Awareness/General Science, Mathematics, and General Intelligence & Reasoning, with the exact weightage and any additional technical sections depending on the specific exam and post applied for.',
          },
          {
            id: 'rrb-preparation-tip',
            question: 'How should candidates prepare for RRB exams?',
            answer:
              'A practical approach is to prioritize General Science and General Awareness (since these carry significant weight and reward consistent daily revision), build solid fundamentals in Math and Reasoning through regular practice, and solve previous years\' RRB papers to get used to the exam\'s question style and difficulty.',
          },
        ],
      },
      {
        id: 'ssc-chsl-mock-test',
        topic: 'SSC CHSL Mock Test (100 Q)',
        questions: [
          {
            id: 'sschsl-q1',
            question: `Q1. Book : Author :: Painting : ?\n\nA. Canvas\nB. Brush\nC. Painter\nD. Gallery`,
            answer: `Correct Answer: C. Painter\n\nExplanation: A book is created by an author; a painting is created by a painter (creator relationship).`,
          },
          {
            id: 'sschsl-q2',
            question: `Q2. Which one does not belong to the group?\n\nA. Mango\nB. Banana\nC. Potato\nD. Apple`,
            answer: `Correct Answer: C. Potato\n\nExplanation: Potato is a vegetable/tuber; the others are fruits.`,
          },
          {
            id: 'sschsl-q3',
            question: `Q3. 2, 5, 10, 17, 26, ?\n\nA. 35\nB. 36\nC. 37\nD. 38`,
            answer: `Correct Answer: C. 37\n\nExplanation: Differences: 3, 5, 7, 9, 11 → 26 + 11 = 37.`,
          },
          {
            id: 'sschsl-q4',
            question: `Q4. 3, 8, 15, 24, 35, ?\n\nA. 46\nB. 47\nC. 48\nD. 49`,
            answer: `Correct Answer: C. 48\n\nExplanation: Differences: 5, 7, 9, 11, 13 → 35 + 13 = 48.`,
          },
          {
            id: 'sschsl-q5',
            question: `Q5. B, D, F, H, ?\n\nA. I\nB. J\nC. K\nD. L`,
            answer: `Correct Answer: B. J\n\nExplanation: Alternate letters skipped: B, D, F, H, J.`,
          },
          {
            id: 'sschsl-q6',
            question: `Q6. If RAIN is coded as SBJO, how is SUN written in the same code?\n\nA. TVO\nB. TUO\nC. UVO\nD. TVP`,
            answer: `Correct Answer: A. TVO\n\nExplanation: Each letter is shifted +1: S→T, U→V, N→O = TVO.`,
          },
          {
            id: 'sschsl-q7',
            question: `Q7. If PAPER is coded as QCSIW, how is PENCIL written in the same code?\n\nA. QGQGNR\nB. QGQGMR\nC. QFQGNR\nD. QGRGNR`,
            answer: `Correct Answer: A. QGQGNR\n\nExplanation: Each letter shifts by an increasing amount (+1,+2,+3,+4,+5,+6): P→Q, E→G, N→Q, C→G, I→N, L→R = QGQGNR.`,
          },
          {
            id: 'sschsl-q8',
            question: `Q8. Pointing to a photograph, a man said, "She is the daughter of my grandfather's only son." How is the woman related to the man?\n\nA. Mother\nB. Sister\nC. Aunt\nD. Wife`,
            answer: `Correct Answer: B. Sister\n\nExplanation: The man's grandfather's only son is the man's father; his daughter is the man's sister.`,
          },
          {
            id: 'sschsl-q9',
            question: `Q9. A is B's sister. C is B's mother. D is C's father. How is A related to D?\n\nA. Granddaughter\nB. Daughter\nC. Grandmother\nD. Niece`,
            answer: `Correct Answer: A. Granddaughter\n\nExplanation: C is B's (and A's) mother; D is C's father, i.e. A's grandfather, so A is D's granddaughter.`,
          },
          {
            id: 'sschsl-q10',
            question: `Q10. Ravi walks 5 km north, turns right and walks 3 km, then turns right again and walks 5 km. How far is he from his starting point?\n\nA. 3 km\nB. 5 km\nC. 8 km\nD. 13 km`,
            answer: `Correct Answer: A. 3 km\n\nExplanation: The two 5 km legs (north, then south after two right turns) cancel out; only the 3 km east leg remains.`,
          },
          {
            id: 'sschsl-q11',
            question: `Q11. Statements: All pens are pencils. All pencils are erasers.\nConclusions: I. All pens are erasers. II. Some erasers are pens.\n\nA. Only I follows\nB. Only II follows\nC. Both I and II follow\nD. Neither follows`,
            answer: `Correct Answer: C. Both I and II follow\n\nExplanation: Chain syllogism: pens ⊆ pencils ⊆ erasers, so all pens are erasers (I); since all pens are erasers, some erasers are necessarily pens (II).`,
          },
          {
            id: 'sschsl-q12',
            question: `Q12. Statements: Some books are pens. No pen is a table.\nConclusions: I. No book is a table. II. Some books are not tables.\n\nA. Only I follows\nB. Only II follows\nC. Both follow\nD. Neither follows`,
            answer: `Correct Answer: B. Only II follows\n\nExplanation: Since some books are pens and no pen is a table, those particular books are not tables — "some books are not tables" follows. "No book is a table" is too strong a claim.`,
          },
          {
            id: 'sschsl-q13',
            question: `Q13. Statements: A > B ≥ C = D < E\nConclusions: I. A > D  II. B > E\n\nA. Only I follows\nB. Only II follows\nC. Both follow\nD. Neither follows`,
            answer: `Correct Answer: A. Only I follows\n\nExplanation: A > B ≥ C = D implies A > D (I follows). The relationship between B and E is indeterminate, so II does not follow.`,
          },
          {
            id: 'sschsl-q14',
            question: `Q14. Which diagram best represents: Doctors, Men, Indians?\n\nA. Three intersecting circles\nB. Three separate circles\nC. Two circles inside one\nD. One circle inside another`,
            answer: `Correct Answer: A. Three intersecting circles\n\nExplanation: Doctors, Men, and Indians are independent, overlapping categories, so three intersecting circles best represents the relationship.`,
          },
          {
            id: 'sschsl-q15',
            question: `Directions (Q15-Q16): Five friends T, R, P, S, Q sit in a row facing North, numbered 1 to 5 left to right. T sits at position 1. R sits immediate right of T. Q sits at position 5. S sits immediate left of Q. P sits at the remaining position.\n\nQ15. Who sits exactly in the middle of the row?\n\nA. T\nB. R\nC. P\nD. S`,
            answer: `Correct Answer: C. P\n\nExplanation: Order is T(1)-R(2)-P(3)-S(4)-Q(5); the middle seat (position 3) is P.`,
          },
          {
            id: 'sschsl-q16',
            question: `Q16. (Same seating as Q15.) Who sits immediate right of P?\n\nA. T\nB. R\nC. S\nD. Q`,
            answer: `Correct Answer: C. S\n\nExplanation: P is at position 3; the immediate right seat (position 4) is S.`,
          },
          {
            id: 'sschsl-q17',
            question: `Q17. In a class of 40 students, Meena ranks 12th from the top. What is her rank from the bottom?\n\nA. 28\nB. 29\nC. 30\nD. 27`,
            answer: `Correct Answer: B. 29\n\nExplanation: Rank from bottom = 40 - 12 + 1 = 29.`,
          },
          {
            id: 'sschsl-q18',
            question: `Q18. If 1st January 2024 was a Monday, what day of the week was 1st January 2025?\n\nA. Tuesday\nB. Wednesday\nC. Thursday\nD. Sunday`,
            answer: `Correct Answer: B. Wednesday\n\nExplanation: 2024 is a leap year (366 days = 52 weeks + 2 days), so the day advances by 2: Monday + 2 = Wednesday.`,
          },
          {
            id: 'sschsl-q19',
            question: `Q19. What is the angle between the hour and minute hand at 4:30?\n\nA. 30°\nB. 45°\nC. 15°\nD. 60°`,
            answer: `Correct Answer: B. 45°\n\nExplanation: |30H - 5.5M| = |30(4) - 5.5(30)| = |120 - 165| = 45°.`,
          },
          {
            id: 'sschsl-q20',
            question: `Q20. Find the missing number: 3, 4, 12 | 5, 6, 30 | 7, 8, ?\n\nA. 54\nB. 56\nC. 58\nD. 49`,
            answer: `Correct Answer: B. 56\n\nExplanation: Pattern: third number = product of first two. 7 × 8 = 56.`,
          },
          {
            id: 'sschsl-q21',
            question: `Q21. Statement: "The government has announced free healthcare for all citizens below the poverty line."\nConclusions: I. The government is concerned about the welfare of poor citizens. II. All citizens will now get free healthcare.\n\nA. Only I follows\nB. Only II follows\nC. Both follow\nD. Neither follows`,
            answer: `Correct Answer: A. Only I follows\n\nExplanation: The statement implies concern for the poor (I); "all citizens" (II) overreaches, since only BPL citizens are covered.`,
          },
          {
            id: 'sschsl-q22',
            question: `Q22. A clock shows 3:40. What time will its mirror image show?\n\nA. 8:20\nB. 8:40\nC. 9:20\nD. 7:20`,
            answer: `Correct Answer: A. 8:20\n\nExplanation: Mirror-image time = 12:00 - actual time = 12:00 - 3:40 = 8:20.`,
          },
          {
            id: 'sschsl-q23',
            question: `Q23. Which digit looks the same in its water image as the original?\n\nA. 2\nB. 5\nC. 8\nD. 6`,
            answer: `Correct Answer: C. 8\n\nExplanation: "8" is symmetric top-to-bottom, so its water (vertical-flip) image is identical.`,
          },
          {
            id: 'sschsl-q24',
            question: `Q24. A triangle rotates 90° clockwise at each step, starting pointing up in figure 1. Which direction does it point in figure 4?\n\nA. Up\nB. Right\nC. Down\nD. Left`,
            answer: `Correct Answer: D. Left\n\nExplanation: Each 90° clockwise turn: Up → Right → Down → Left. Figure 4 points left.`,
          },
          {
            id: 'sschsl-q25',
            question: `Q25. "Schools should introduce coding classes from Class 6 onwards, as it will help students develop logical thinking early." Which is an implicit assumption?\n\nA. Logical thinking cannot be developed through any other subject.\nB. Coding is only useful for future computer scientists.\nC. Students of Class 6 are capable of learning basic coding concepts.\nD. All schools currently teach coding from Class 10.`,
            answer: `Correct Answer: C\n\nExplanation: The recommendation only makes sense if Class 6 students can actually grasp basic coding — that is the implicit assumption behind it.`,
          },
          {
            id: 'sschsl-q26',
            question: `Q26. What is the smallest 4-digit number exactly divisible by 12?\n\nA. 1002\nB. 1004\nC. 1008\nD. 1006`,
            answer: `Correct Answer: C. 1008\n\nExplanation: First 4-digit number ≥ 1000 divisible by 12: 84 × 12 = 1008.`,
          },
          {
            id: 'sschsl-q27',
            question: `Q27. Simplify: 45 ÷ 9 × 3 + 12 - 4\n\nA. 21\nB. 22\nC. 23\nD. 24`,
            answer: `Correct Answer: C. 23\n\nExplanation: 45 ÷ 9 = 5; 5 × 3 = 15; 15 + 12 - 4 = 23.`,
          },
          {
            id: 'sschsl-q28',
            question: `Q28. What is 35% of 480?\n\nA. 160\nB. 164\nC. 168\nD. 172`,
            answer: `Correct Answer: C. 168\n\nExplanation: 0.35 × 480 = 168.`,
          },
          {
            id: 'sschsl-q29',
            question: `Q29. Divide 720 in the ratio 5:4. What is the smaller part?\n\nA. 300\nB. 310\nC. 320\nD. 330`,
            answer: `Correct Answer: C. 320\n\nExplanation: 720 ÷ 9 = 80; smaller part (4 units) = 320.`,
          },
          {
            id: 'sschsl-q30',
            question: `Q30. The average of 5 consecutive even numbers is 24. What is the largest number?\n\nA. 26\nB. 28\nC. 30\nD. 32`,
            answer: `Correct Answer: B. 28\n\nExplanation: 5 consecutive evens centred on 24: 20, 22, 24, 26, 28; largest = 28.`,
          },
          {
            id: 'sschsl-q31',
            question: `Q31. A shopkeeper buys an item for ₹800 and sells it at a profit of 15%. What is the selling price?\n\nA. 900\nB. 910\nC. 920\nD. 930`,
            answer: `Correct Answer: C. 920\n\nExplanation: 800 × 1.15 = 920.`,
          },
          {
            id: 'sschsl-q32',
            question: `Q32. Find the simple interest on ₹6000 at 8% per annum for 3 years.\n\nA. 1200\nB. 1320\nC. 1440\nD. 1560`,
            answer: `Correct Answer: C. 1440\n\nExplanation: SI = (6000 × 8 × 3) / 100 = 1440.`,
          },
          {
            id: 'sschsl-q33',
            question: `Q33. Find the compound interest on ₹10,000 at 10% per annum for 2 years, compounded annually.\n\nA. 2000\nB. 2050\nC. 2100\nD. 2200`,
            answer: `Correct Answer: C. 2100\n\nExplanation: CI = 10000 × (1.1² - 1) = 10000 × 0.21 = 2100.`,
          },
          {
            id: 'sschsl-q34',
            question: `Q34. A can complete a work in 12 days, B in 18 days. In how many days will they finish it together?\n\nA. 7.2 days\nB. 7.5 days\nC. 8 days\nD. 6.8 days`,
            answer: `Correct Answer: A. 7.2 days\n\nExplanation: Combined rate = 1/12 + 1/18 = 5/36; time = 36/5 = 7.2 days.`,
          },
          {
            id: 'sschsl-q35',
            question: `Q35. Pipe A fills a tank in 10 hours, Pipe B empties it in 15 hours. If both are opened together, how long to fill the tank?\n\nA. 25 hours\nB. 28 hours\nC. 30 hours\nD. 32 hours`,
            answer: `Correct Answer: C. 30 hours\n\nExplanation: Net rate = 1/10 - 1/15 = 1/30, so it takes 30 hours.`,
          },
          {
            id: 'sschsl-q36',
            question: `Q36. A car travels 180 km in 3 hours. What is its speed?\n\nA. 50 km/h\nB. 55 km/h\nC. 60 km/h\nD. 65 km/h`,
            answer: `Correct Answer: C. 60 km/h\n\nExplanation: 180 ÷ 3 = 60 km/h.`,
          },
          {
            id: 'sschsl-q37',
            question: `Q37. A train 150 m long runs at 90 km/h. How long will it take to cross a platform 300 m long?\n\nA. 16 sec\nB. 18 sec\nC. 20 sec\nD. 22 sec`,
            answer: `Correct Answer: B. 18 sec\n\nExplanation: Speed = 90 km/h = 25 m/s; total distance = 150 + 300 = 450 m; time = 450 / 25 = 18 s.`,
          },
          {
            id: 'sschsl-q38',
            question: `Q38. A boat's speed in still water is 12 km/h, stream speed is 3 km/h. Find the time to travel 45 km downstream.\n\nA. 2.5 hrs\nB. 3 hrs\nC. 3.5 hrs\nD. 4 hrs`,
            answer: `Correct Answer: B. 3 hrs\n\nExplanation: Downstream speed = 12 + 3 = 15 km/h; time = 45 / 15 = 3 hours.`,
          },
          {
            id: 'sschsl-q39',
            question: `Q39. If x + 1/x = 5, find x² + 1/x².\n\nA. 21\nB. 23\nC. 25\nD. 27`,
            answer: `Correct Answer: B. 23\n\nExplanation: x² + 1/x² = (x + 1/x)² - 2 = 25 - 2 = 23.`,
          },
          {
            id: 'sschsl-q40',
            question: `Q40. The angles of a triangle are in the ratio 2:3:4. What is the largest angle?\n\nA. 70°\nB. 75°\nC. 80°\nD. 90°`,
            answer: `Correct Answer: C. 80°\n\nExplanation: Ratio parts sum to 9; each part = 180/9 = 20; largest angle = 4 × 20 = 80°.`,
          },
          {
            id: 'sschsl-q41',
            question: `Q41. Find the area of a circle of radius 14 cm. (π = 22/7)\n\nA. 588 cm²\nB. 600 cm²\nC. 616 cm²\nD. 628 cm²`,
            answer: `Correct Answer: C. 616 cm²\n\nExplanation: Area = (22/7) × 14² = 22 × 28 = 616 cm².`,
          },
          {
            id: 'sschsl-q42',
            question: `Q42. Find the value of sin30° + cos60°.\n\nA. 0.5\nB. 1\nC. 1.5\nD. 2`,
            answer: `Correct Answer: B. 1\n\nExplanation: sin30° = 0.5, cos60° = 0.5; sum = 1.`,
          },
          {
            id: 'sschsl-q43',
            question: `Q43. A bag has 4 red and 6 blue balls. What is the probability of drawing a red ball?\n\nA. 1/3\nB. 2/5\nC. 1/2\nD. 3/5`,
            answer: `Correct Answer: B. 2/5\n\nExplanation: P(red) = 4/10 = 2/5.`,
          },
          {
            id: 'sschsl-q44',
            question: `Q44. In how many ways can 3 letters be chosen from the word "TABLE"?\n\nA. 8\nB. 10\nC. 12\nD. 15`,
            answer: `Correct Answer: B. 10\n\nExplanation: ⁵C₃ = 10.`,
          },
          {
            id: 'sschsl-q45',
            question: `Directions (Q45 & Q50): A store's book sales over 5 days: Mon-120, Tue-150, Wed-90, Thu-200, Fri-140.\n\nQ45. What is the total number of books sold from Monday to Friday?\n\nA. 680\nB. 690\nC. 700\nD. 710`,
            answer: `Correct Answer: C. 700\n\nExplanation: 120 + 150 + 90 + 200 + 140 = 700.`,
          },
          {
            id: 'sschsl-q46',
            question: `Q46. 5, 10, 20, 40, 80, ?\n\nA. 120\nB. 140\nC. 160\nD. 180`,
            answer: `Correct Answer: C. 160\n\nExplanation: Each term doubles: 80 × 2 = 160.`,
          },
          {
            id: 'sschsl-q47',
            question: `Q47. Solve for x: x² - 7x + 12 = 0.\n\nA. 2, 6\nB. 3, 4\nC. 4, 5\nD. 3, 5`,
            answer: `Correct Answer: B. 3, 4\n\nExplanation: x² - 7x + 12 = (x-3)(x-4) = 0 ⇒ x = 3, 4.`,
          },
          {
            id: 'sschsl-q48',
            question: `Q48. Simplify: (15 × 4) - (6 × 3) + 10\n\nA. 48\nB. 50\nC. 52\nD. 54`,
            answer: `Correct Answer: C. 52\n\nExplanation: (15×4)=60; (6×3)=18; 60 - 18 + 10 = 52.`,
          },
          {
            id: 'sschsl-q49',
            question: `Q49. A, B and C can complete a work in 10, 15 and 30 days respectively. In how many days will they finish it together?\n\nA. 4 days\nB. 5 days\nC. 6 days\nD. 7 days`,
            answer: `Correct Answer: B. 5 days\n\nExplanation: Combined rate = 1/10 + 1/15 + 1/30 = 1/5, so 5 days.`,
          },
          {
            id: 'sschsl-q50',
            question: `Q50. (Same table as Q45.) On which day were the maximum books sold, and how many more than the lowest-selling day (Wednesday)?\n\nA. Thursday, 100 more\nB. Thursday, 110 more\nC. Friday, 110 more\nD. Thursday, 120 more`,
            answer: `Correct Answer: B. Thursday, 110 more\n\nExplanation: Max = Thursday (200); min = Wednesday (90); difference = 110.`,
          },
          {
            id: 'sschsl-q51',
            question: `Q51. Find the part of the sentence that has an error: "Neither of the two boys (A)/ have completed (B)/ their homework (C)/ on time. (D)"\n\nA. A\nB. B\nC. C\nD. D`,
            answer: `Correct Answer: B\n\nExplanation: "Neither...have" is wrong; "neither" is singular, so it should be "has".`,
          },
          {
            id: 'sschsl-q52',
            question: `Q52. Improve: "He is one of the best players who has ever played for the team."\n\nA. No improvement\nB. who have ever played\nC. who was ever played\nD. who having played`,
            answer: `Correct Answer: B\n\nExplanation: "One of the [plural noun] who..." takes a plural verb, so "who have ever played" is correct.`,
          },
          {
            id: 'sschsl-q53',
            question: `Q53. She has been living in Delhi ___ 2015.\n\nA. for\nB. since\nC. from\nD. at`,
            answer: `Correct Answer: B. since\n\nExplanation: "Since" is used with a specific starting point in time (2015).`,
          },
          {
            id: 'sschsl-q54',
            question: `Directions (Q54-Q58): Cloze test - fill in the blanks.\n\n"India has made significant progress in the field of renewable energy over the past decade. The government has (54)___ several policies to encourage the use of solar and wind power. As a (55)___, the country's dependence on fossil fuels has gradually (56)___. Experts believe that if this trend (57)___, India could become one of the world's leading producers of clean energy (58)___ the next few years."\n\nQ54. A. introduced\nB. introducing\nC. introduce\nD. introduces`,
            answer: `Correct Answer: A. introduced\n\nExplanation: Past-tense narrative context requires "introduced".`,
          },
          {
            id: 'sschsl-q55',
            question: `Q55. (Cloze test, same passage as Q54.)\n\nA. reason\nB. result\nC. cause\nD. matter`,
            answer: `Correct Answer: B. result\n\nExplanation: "As a result" is the correct cause-effect connector.`,
          },
          {
            id: 'sschsl-q56',
            question: `Q56. (Cloze test, same passage as Q54.)\n\nA. increased\nB. decreased\nC. remained\nD. stopped`,
            answer: `Correct Answer: B. decreased\n\nExplanation: Renewable adoption reduces fossil-fuel dependence, so "decreased" fits.`,
          },
          {
            id: 'sschsl-q57',
            question: `Q57. (Cloze test, same passage as Q54.)\n\nA. continue\nB. continues\nC. continued\nD. continuing`,
            answer: `Correct Answer: B. continues\n\nExplanation: Present-tense conditional clause requires "continues".`,
          },
          {
            id: 'sschsl-q58',
            question: `Q58. (Cloze test, same passage as Q54.)\n\nA. in\nB. at\nC. on\nD. since`,
            answer: `Correct Answer: A. in\n\nExplanation: "In the next few years" is the standard collocation.`,
          },
          {
            id: 'sschsl-q59',
            question: `Q59. Choose the synonym of "ABUNDANT":\n\nA. Scarce\nB. Plentiful\nC. Limited\nD. Rare`,
            answer: `Correct Answer: B. Plentiful\n\nExplanation: Abundant means plentiful, existing in large quantities.`,
          },
          {
            id: 'sschsl-q60',
            question: `Q60. Choose the antonym of "GENUINE":\n\nA. Real\nB. Authentic\nC. Fake\nD. Honest`,
            answer: `Correct Answer: C. Fake\n\nExplanation: Genuine and fake are opposites.`,
          },
          {
            id: 'sschsl-q61',
            question: `Q61. A person who can speak two languages is called:\n\nA. Linguist\nB. Bilingual\nC. Translator\nD. Polyglot`,
            answer: `Correct Answer: B. Bilingual\n\nExplanation: A person fluent in exactly two languages is "bilingual"; "polyglot" refers to someone fluent in several languages.`,
          },
          {
            id: 'sschsl-q62',
            question: `Q62. What does "to break the ice" mean?\n\nA. To cause a conflict\nB. To start a conversation in a social setting\nC. To end a relationship\nD. To destroy something`,
            answer: `Correct Answer: B\n\nExplanation: "Break the ice" means to initiate conversation in an awkward or new social setting.`,
          },
          {
            id: 'sschsl-q63',
            question: `Q63. Choose the correctly spelt word:\n\nA. Recieve\nB. Receive\nC. Recceive\nD. Receve`,
            answer: `Correct Answer: B. Receive\n\nExplanation: "i before e except after c" — correct spelling is "Receive".`,
          },
          {
            id: 'sschsl-q64',
            question: `Q64. Change to passive voice: "The chef is cooking the meal."\n\nA. The meal is cooked by the chef.\nB. The meal is being cooked by the chef.\nC. The meal was cooked by the chef.\nD. The meal has been cooked by the chef.`,
            answer: `Correct Answer: B\n\nExplanation: Present continuous active ("is cooking") becomes present continuous passive: "is being cooked by".`,
          },
          {
            id: 'sschsl-q65',
            question: `Q65. Change to indirect speech: She said, "I am going to the market."\n\nA. She said that she is going to the market.\nB. She said that she was going to the market.\nC. She says that she was going to the market.\nD. She told that she is going to market.`,
            answer: `Correct Answer: B\n\nExplanation: Present continuous in direct speech shifts to past continuous in reported speech ("am"→"was").`,
          },
          {
            id: 'sschsl-q66',
            question: `Q66. Arrange in correct order:\nP. As a result, more companies are shifting towards eco-friendly practices.\nQ. Climate change has become a pressing global concern.\nR. Consumers are also becoming more conscious of the environmental impact of their purchases.\nS. Governments across the world are introducing stricter environmental regulations.\n\nA. QSPR\nB. QSRP\nC. QPRS\nD. QRSP`,
            answer: `Correct Answer: A. QSPR\n\nExplanation: Topic introduced (Q) → government response (S) → business response as a result (P) → consumer behaviour as an additional point (R).`,
          },
          {
            id: 'sschsl-q67',
            question: `Q67. Rearrange: "always / the / speaks / truth / he"\n\nA. He speaks always the truth\nB. He always speaks the truth\nC. Always he speaks the truth\nD. He speaks the truth always`,
            answer: `Correct Answer: B\n\nExplanation: Standard English word order: Subject-Adverb-Verb-Object = "He always speaks the truth."`,
          },
          {
            id: 'sschsl-q68',
            question: `Directions (Q68-Q72): Read the passage and answer.\n\n"Water scarcity is one of the most critical challenges facing the world today. Nearly two billion people live in countries experiencing high water stress, and this number is expected to rise as populations grow and climate patterns shift. Agriculture consumes about 70% of the world's freshwater, making it the largest user of this vital resource. Experts suggest that improving irrigation efficiency, adopting drought-resistant crops, and recycling wastewater are essential steps toward addressing this crisis. Without immediate action, many regions could face severe shortages within the next few decades, affecting food security and public health."\n\nQ68. How many people live in countries with high water stress?\n\nA. One billion\nB. Two billion\nC. Three billion\nD. Four billion`,
            answer: `Correct Answer: B\n\nExplanation: The passage states "nearly two billion people".`,
          },
          {
            id: 'sschsl-q69',
            question: `Q69. (Same passage as Q68.) What percentage of freshwater is consumed by agriculture?\n\nA. 50%\nB. 60%\nC. 70%\nD. 80%`,
            answer: `Correct Answer: C\n\nExplanation: The passage states "about 70%".`,
          },
          {
            id: 'sschsl-q70',
            question: `Q70. (Same passage as Q68.) Which is NOT mentioned as a solution?\n\nA. Improving irrigation efficiency\nB. Adopting drought-resistant crops\nC. Recycling wastewater\nD. Building more dams`,
            answer: `Correct Answer: D\n\nExplanation: "Building more dams" is not mentioned; only irrigation efficiency, drought-resistant crops, and recycling wastewater are.`,
          },
          {
            id: 'sschsl-q71',
            question: `Q71. (Same passage as Q68.) What will happen without immediate action?\n\nA. Water stress will decrease\nB. Many regions could face severe shortages\nC. Agriculture will stop using water\nD. Populations will decline`,
            answer: `Correct Answer: B\n\nExplanation: The passage states regions "could face severe shortages".`,
          },
          {
            id: 'sschsl-q72',
            question: `Q72. (Same passage as Q68.) What is the main idea of the passage?\n\nA. Agriculture is the only cause of water scarcity\nB. Water scarcity is a critical global challenge requiring urgent solutions\nC. Climate change has no effect on water supply\nD. Water stress only affects developing countries`,
            answer: `Correct Answer: B\n\nExplanation: The passage as a whole argues water scarcity is a critical, urgent global problem.`,
          },
          {
            id: 'sschsl-q73',
            question: `Q73. Replace the underlined phrase: "The manager insisted to complete the report by Friday."\n\nA. insisted on completing\nB. insisted for completing\nC. insisted to completing\nD. No improvement`,
            answer: `Correct Answer: A\n\nExplanation: "Insist on" + gerund is the correct collocation.`,
          },
          {
            id: 'sschsl-q74',
            question: `Q74. Choose the word closest in meaning to "BENEVOLENT":\n\nA. Cruel\nB. Kind\nC. Selfish\nD. Arrogant`,
            answer: `Correct Answer: B. Kind\n\nExplanation: Benevolent means kind, charitable, well-meaning.`,
          },
          {
            id: 'sschsl-q75',
            question: `Q75. Find the error: "Each of the students (A)/ were given (B)/ a copy of the book (C)/ before the exam. (D)"\n\nA. A\nB. B\nC. C\nD. D`,
            answer: `Correct Answer: B\n\nExplanation: "Each...were" is wrong; "each" is singular, so it should be "was".`,
          },
          {
            id: 'sschsl-q76',
            question: `Q76. Who built the Great Stupa at Sanchi?\n\nA. Chandragupta Maurya\nB. Ashoka\nC. Samudragupta\nD. Harsha`,
            answer: `Correct Answer: B. Ashoka\n\nExplanation: The Great Stupa at Sanchi was commissioned by Emperor Ashoka.`,
          },
          {
            id: 'sschsl-q77',
            question: `Q77. Who founded the Mughal Empire in India?\n\nA. Akbar\nB. Humayun\nC. Babur\nD. Shah Jahan`,
            answer: `Correct Answer: C. Babur\n\nExplanation: Babur founded the Mughal Empire in 1526 after the First Battle of Panipat.`,
          },
          {
            id: 'sschsl-q78',
            question: `Q78. The Quit India Movement was launched in which year?\n\nA. 1930\nB. 1942\nC. 1947\nD. 1920`,
            answer: `Correct Answer: B. 1942\n\nExplanation: The Quit India Movement was launched on 8 August 1942.`,
          },
          {
            id: 'sschsl-q79',
            question: `Q79. Which is the longest river in India?\n\nA. Yamuna\nB. Godavari\nC. Ganga\nD. Brahmaputra`,
            answer: `Correct Answer: C. Ganga\n\nExplanation: The Ganga is the longest river flowing within India.`,
          },
          {
            id: 'sschsl-q80',
            question: `Q80. Which is the largest desert in the world by area?\n\nA. Sahara\nB. Antarctic Desert\nC. Gobi\nD. Arabian Desert`,
            answer: `Correct Answer: B. Antarctic Desert\n\nExplanation: The Antarctic Desert (~14 million km²) is the largest desert by area, larger than the Sahara.`,
          },
          {
            id: 'sschsl-q81',
            question: `Q81. Mount Everest is located in which mountain range?\n\nA. Karakoram\nB. Himalayas\nC. Andes\nD. Alps`,
            answer: `Correct Answer: B. Himalayas\n\nExplanation: Mount Everest lies in the Mahalangur range of the Himalayas.`,
          },
          {
            id: 'sschsl-q82',
            question: `Q82. Who is known as the "Father of the Indian Constitution"?\n\nA. Jawaharlal Nehru\nB. Mahatma Gandhi\nC. Dr. B.R. Ambedkar\nD. Sardar Vallabhbhai Patel`,
            answer: `Correct Answer: C. Dr. B.R. Ambedkar\n\nExplanation: Dr. Ambedkar chaired the Constitution Drafting Committee.`,
          },
          {
            id: 'sschsl-q83',
            question: `Q83. Which Article of the Indian Constitution abolishes untouchability?\n\nA. Article 14\nB. Article 15\nC. Article 17\nD. Article 21`,
            answer: `Correct Answer: C. Article 17\n\nExplanation: Article 17 abolishes untouchability and forbids its practice in any form.`,
          },
          {
            id: 'sschsl-q84',
            question: `Q84. What is the current total number of elected members in the Lok Sabha?\n\nA. 543\nB. 545\nC. 552\nD. 250`,
            answer: `Correct Answer: A. 543\n\nExplanation: The Lok Sabha currently has 543 elected members.`,
          },
          {
            id: 'sschsl-q85',
            question: `Q85. Who was the first Chief Justice of India?\n\nA. M. Patanjali Sastri\nB. H.J. Kania\nC. B.K. Mukherjea\nD. S.R. Das`,
            answer: `Correct Answer: B. H.J. Kania\n\nExplanation: H.J. Kania was independent India's first Chief Justice, from 1950.`,
          },
          {
            id: 'sschsl-q86',
            question: `Q86. GDP stands for:\n\nA. Gross Domestic Product\nB. Global Development Plan\nC. General Development Product\nD. Gross Domestic Price`,
            answer: `Correct Answer: A. Gross Domestic Product\n\nExplanation: GDP measures the total value of goods and services produced within a country.`,
          },
          {
            id: 'sschsl-q87',
            question: `Q87. Which index is commonly used to measure retail inflation in India?\n\nA. WPI\nB. CPI\nC. IIP\nD. GDP Deflator`,
            answer: `Correct Answer: B. CPI\n\nExplanation: The Consumer Price Index (CPI) is used to measure retail inflation in India.`,
          },
          {
            id: 'sschsl-q88',
            question: `Q88. Which bank is known as the "banker's bank" in India?\n\nA. SBI\nB. RBI\nC. NABARD\nD. ICICI`,
            answer: `Correct Answer: B. RBI\n\nExplanation: The Reserve Bank of India regulates and lends to other banks, hence "banker's bank".`,
          },
          {
            id: 'sschsl-q89',
            question: `Q89. What is the SI unit of electric current?\n\nA. Volt\nB. Ampere\nC. Ohm\nD. Watt`,
            answer: `Correct Answer: B. Ampere\n\nExplanation: Electric current is measured in Amperes.`,
          },
          {
            id: 'sschsl-q90',
            question: `Q90. What is the chemical formula of common salt?\n\nA. NaCl\nB. KCl\nC. CaCl2\nD. Na2CO3`,
            answer: `Correct Answer: A. NaCl\n\nExplanation: Common salt is Sodium Chloride (NaCl).`,
          },
          {
            id: 'sschsl-q91',
            question: `Q91. Which organ in the human body produces insulin?\n\nA. Liver\nB. Kidney\nC. Pancreas\nD. Stomach`,
            answer: `Correct Answer: C. Pancreas\n\nExplanation: The pancreas produces insulin, which regulates blood sugar.`,
          },
          {
            id: 'sschsl-q92',
            question: `Q92. Which award is considered India's highest civilian honour?\n\nA. Padma Shri\nB. Padma Bhushan\nC. Bharat Ratna\nD. Padma Vibhushan`,
            answer: `Correct Answer: C. Bharat Ratna\n\nExplanation: Bharat Ratna is India's highest civilian award.`,
          },
          {
            id: 'sschsl-q93',
            question: `Q93. Who wrote the book "Wings of Fire"?\n\nA. Amartya Sen\nB. A.P.J. Abdul Kalam\nC. Ruskin Bond\nD. Vikram Seth`,
            answer: `Correct Answer: B. A.P.J. Abdul Kalam\n\nExplanation: "Wings of Fire" is Dr. Kalam's autobiography.`,
          },
          {
            id: 'sschsl-q94',
            question: `Q94. In which sport is the term "Grand Slam" commonly used?\n\nA. Cricket\nB. Football\nC. Tennis\nD. Hockey`,
            answer: `Correct Answer: C. Tennis\n\nExplanation: "Grand Slam" refers to the four major tennis championships (Australian Open, French Open, Wimbledon, US Open).`,
          },
          {
            id: 'sschsl-q95',
            question: `Q95. What is the capital of Australia?\n\nA. Sydney\nB. Melbourne\nC. Canberra\nD. Perth`,
            answer: `Correct Answer: C. Canberra\n\nExplanation: Canberra, not Sydney, is Australia's capital.`,
          },
          {
            id: 'sschsl-q96',
            question: `Q96. [Current Affairs, Sep 2026] The AICTE Innovation and Entrepreneurship Doctoral Fellowship Programme (AIEDFP) was launched in September 2026 by which organization?\n\nA. UGC\nB. AICTE\nC. ISRO\nD. NITI Aayog`,
            answer: `Correct Answer: B. AICTE\n\nExplanation: AICTE launched AIEDFP on 3 September 2026.`,
          },
          {
            id: 'sschsl-q97',
            question: `Q97. [Current Affairs, Sep 2026] The 72nd National Film Awards were presented in September 2026 at which location?\n\nA. New Delhi\nB. Mumbai\nC. Ekta Nagar, Kevadia, Gujarat\nD. Chennai`,
            answer: `Correct Answer: C. Ekta Nagar, Kevadia, Gujarat\n\nExplanation: The President presented the 72nd National Film Awards there on 22 September 2026.`,
          },
          {
            id: 'sschsl-q98',
            question: `Q98. [Current Affairs, Sep 2026] Dr. Dinesh Sharma, former Deputy CM of Uttar Pradesh, was appointed to which position in September 2026?\n\nA. Governor of Uttar Pradesh\nB. Lieutenant Governor of Andaman & Nicobar Islands\nC. Governor of Bihar\nD. Lieutenant Governor of Puducherry`,
            answer: `Correct Answer: B\n\nExplanation: Dr. Dinesh Sharma was appointed Lieutenant Governor of the Andaman & Nicobar Islands.`,
          },
          {
            id: 'sschsl-q99',
            question: `Q99. [Current Affairs, Sep 2026] SEMICON India 2026, inaugurated by PM Modi in September 2026 at Yashobhoomi, Dwarka, was held under which theme?\n\nA. "Make in India for Semiconductors"\nB. "Silicon to Systems: Building the Ecosystem"\nC. "Digital India, Digital Chips"\nD. "Atmanirbhar Semiconductor Mission"`,
            answer: `Correct Answer: B\n\nExplanation: SEMICON India 2026's theme was "Silicon to Systems: Building the Ecosystem."`,
          },
          {
            id: 'sschsl-q100',
            question: `Q100. [Current Affairs, Sep 2026] The DISHA 2.0 Scheme regional workshop held in Goa on 21 September 2026 was organized by which body?\n\nA. Ministry of Home Affairs\nB. Department of Justice, Ministry of Law and Justice\nC. Ministry of Skill Development\nD. NITI Aayog`,
            answer: `Correct Answer: B\n\nExplanation: The DISHA 2.0 workshop in Goa was organized by the Department of Justice, Ministry of Law and Justice.`,
          },
        ],
      },
      {
        id: 'bank-po-mock-test',
        topic: 'SBI/IBPS PO Prelims Mock Test (100 Q)',
        questions: [],
        quiz: bankPoQuiz,
      },
    ],
  },
]
