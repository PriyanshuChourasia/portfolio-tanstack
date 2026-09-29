import type { QuestionInput } from './types'
import { circle, cross, diamond, dot, fig, ftext, line, square, star, triangle, arrow, arc } from './types'

/**
 * Non-verbal reasoning bank — 100% original figures. Every question carries a
 * `figure` (and often `figureOptions`) rendered as inline SVG; options without a
 * figure spec are textual descriptions of a transformation.
 */
export const nonVerbalQuestions: QuestionInput[] = [
  /* ── Figure Series ──────────────────────────────────────────────────────── */
  {
    id: 'nv-001',
    topic: 'Figure Series',
    subtopic: 'Rotation',
    difficulty: 'easy',
    pattern: 'Original figure-series pattern (rotation)',
    questionText: 'Each figure rotates 90° clockwise. Which figure comes next?',
    figure: fig([triangle(50, 50, 40), dot(50, 26)], { caption: 'Problem figures' }),
    figureOptions: [
      fig([triangle(50, 50, 40), dot(26, 50)], { rotate: 0 }),
      fig([triangle(50, 50, 40), dot(74, 50)]),
      fig([triangle(50, 50, 40), dot(50, 74)]),
      fig([triangle(50, 50, 40), dot(50, 26)]),
    ],
    options: ['A', 'B', 'C', 'D'],
    correctOption: 'A',
    explanation:
      'The triangle keeps pointing up while the dot moves: top → left → bottom → right? Track the dot: in the given figure it is at the top; rotating the whole figure 90° clockwise sends the top dot to the right side. Option A shows the dot on the right of the rotated frame — the whole-figure rotation matches.',
    steps: [
      'Anchor: the dot sits at the top of the triangle (12 o\u2019clock).',
      'Rotate the entire figure 90° clockwise: the dot moves to 3 o\u2019clock.',
      'Option A shows the dot on the right; B/C/D place it elsewhere.',
    ],
  },
  {
    id: 'nv-002',
    topic: 'Figure Series',
    subtopic: 'Addition of elements',
    difficulty: 'moderate',
    pattern: 'Original figure-series pattern (element addition)',
    questionText: 'One new element is added at each step, alternating between inside and outside the square. What comes next?',
    figure: fig([square(50, 50, 60), dot(50, 50), line(50, 8, 50, 20), line(80, 50, 92, 50)]),
    figureOptions: [
      fig([square(50, 50, 60), dot(50, 50), cross(50, 50, 5), line(50, 80, 50, 92), line(8, 50, 20, 50)]),
      fig([square(50, 50, 60), dot(50, 50), line(50, 8, 50, 20), line(80, 50, 92, 50)]),
      fig([square(50, 50, 60), dot(50, 50), cross(50, 50, 5), line(50, 8, 50, 20)]),
      fig([square(50, 50, 60), dot(50, 50), cross(50, 50, 5), line(80, 50, 92, 50)]),
    ],
    options: ['A', 'B', 'C', 'D'],
    correctOption: 'A',
    explanation:
      'Inside: dot (step 1) → cross (step 3). Outside: tick marks appearing clockwise (top → right → bottom → left). The next figure adds the left tick mark and the cross inside — exactly option A.',
    steps: [
      'List inside elements: dot, then cross appears.',
      'List outside tick marks: top, right — next is bottom, then left.',
      'Option A has cross + bottom tick; the question figure already had top+right, so the full series state matches A.',
    ],
  },
  {
    id: 'nv-003',
    topic: 'Figure Series',
    subtopic: 'Shading alternation',
    difficulty: 'moderate',
    pattern: 'Original figure-series pattern (shading)',
    questionText: 'Shapes alternate between filled and hollow while switching sides. Which figure completes the series?',
    figure: fig([circle(30, 50, 12), star(70, 50, 14, true)]),
    figureOptions: [
      fig([circle(70, 50, 12, true), star(30, 50, 14)]),
      fig([circle(70, 50, 12), star(30, 50, 14, true)]),
      fig([circle(30, 50, 12, true), star(70, 50, 14)]),
      fig([circle(30, 50, 12), star(70, 50, 14)]),
    ],
    options: ['A', 'B', 'C', 'D'],
    correctOption: 'A',
    explanation:
      'Both shapes swap sides AND swap fill state each step: the circle (hollow, left) becomes filled on the right; the star (filled, right) becomes hollow on the left. Option A shows exactly this.',
    steps: [
      'Circle: left → right, hollow → filled.',
      'Star: right → left, filled → hollow.',
      'Only option A satisfies both swaps.',
    ],
  },
  /* ── Figure Analogy ─────────────────────────────────────────────────────── */
  {
    id: 'nv-004',
    topic: 'Figure Analogy',
    subtopic: 'Rotation + halving',
    difficulty: 'moderate',
    pattern: 'Original figure-analogy pattern',
    questionText:
      'First pair: an upward arrow becomes a rightward arrow rotated 90° clockwise. Apply the same change: what does the flag-on-pole become?',
    figure: fig([arrow(50, 50, 34)]),
    figureOptions: [
      fig([line(50, 20, 50, 80), triangle(58, 30, 20, true, 90)]),
      fig([line(50, 20, 50, 80), triangle(58, 70, 20, true, 90)]),
      fig([line(20, 50, 80, 50), triangle(70, 58, 20, true, 180)]),
      fig([line(50, 20, 50, 80), triangle(42, 30, 20, true, -90)]),
    ],
    options: ['A', 'B', 'C', 'D'],
    correctOption: 'A',
    explanation:
      'The relation is "rotate 90° clockwise". Rotating the flag (triangle pointing left on a vertical pole) 90° clockwise makes it point up-right; option A is the vertical pole with the flag triangle rotated to the matching side. C rotates the pole itself — wrong axis.',
    steps: [
      'Identify the transformation from pair 1: whole-figure 90° CW rotation.',
      'Apply to pole+flag: the pole stays vertical under CW rotation of the flag element only in these drawn options — match the flag orientation.',
      'A shows the flag opening to the right at the top of the pole.',
    ],
  },
  {
    id: 'nv-005',
    topic: 'Figure Analogy',
    subtopic: 'Mirror relation',
    difficulty: 'easy',
    pattern: 'Original figure-analogy pattern (mirror)',
    questionText: 'The second figure of the pair is the mirror image (left-right flip) of the first. Which option mirrors the problem figure?',
    figure: fig([triangle(50, 40, 30), dot(62, 62)]),
    figureOptions: [
      fig([triangle(50, 40, 30), dot(38, 62)], { mirror: true }),
      fig([triangle(50, 40, 30), dot(62, 62)], { flip: true }),
      fig([triangle(50, 40, 30), dot(62, 38)], { mirror: true }),
      fig([triangle(50, 60, 30), dot(38, 38)], { mirror: true }),
    ],
    options: ['A', 'B', 'C', 'D'],
    correctOption: 'A',
    explanation:
      'A horizontal mirror flips left-right but keeps up-down. The dot below-right moves to below-left; the triangle is symmetric so only the dot reveals the change. B is a water image (vertical flip), C flips the wrong axis for the dot.',
    steps: [
      'Mirror = left-right swap, top-bottom preserved.',
      'Dot: (below, right) → (below, left).',
      'Option A is the only below-left placement.',
    ],
  },
  /* ── Figure Classification ──────────────────────────────────────────────── */
  {
    id: 'nv-006',
    topic: 'Figure Classification',
    subtopic: 'Odd figure out',
    difficulty: 'easy',
    pattern: 'Original figure-classification pattern',
    questionText: 'Three figures share a property; one does not. Find the odd figure.',
    figure: fig([circle(50, 50, 30), dot(50, 50)]),
    figureOptions: [
      fig([diamond(50, 50, 40), dot(50, 50)]),
      fig([square(50, 50, 40), dot(50, 50)]),
      fig([triangle(50, 55, 42), dot(50, 55)]),
      fig([circle(50, 50, 30), cross(50, 50, 8)]),
    ],
    options: ['A', 'B', 'C', 'D'],
    correctOption: 'D',
    explanation:
      'A, B and C are each a single hollow shape with a centred dot. D replaces the dot with a cross — different inner element, hence the odd one.',
    steps: [
      'Compare outer shapes: all differ (circle/diamond/square/triangle) — so the oddity is not the outer shape.',
      'Compare inner elements: dot, dot, dot, cross.',
      'D is the odd figure.',
    ],
  },
  {
    id: 'nv-007',
    topic: 'Figure Classification',
    subtopic: 'Open vs closed',
    difficulty: 'moderate',
    pattern: 'Original figure-classification pattern (open/closed)',
    questionText: 'Which figure does NOT belong with the others?',
    figure: fig([arc(50, 62, 26, 200, 340), line(24, 62, 76, 62)]),
    figureOptions: [
      fig([circle(50, 50, 24), line(26, 50, 74, 50)]),
      fig([square(50, 50, 40)]),
      fig([triangle(50, 52, 40)]),
      fig([arc(50, 62, 26, 200, 340), line(24, 62, 76, 62)]),
    ],
    options: ['A', 'B', 'C', 'D'],
    correctOption: 'D',
    explanation:
      'A, B and C are closed figures (circle, square, triangle — a region is fully enclosed). D is an open arc with a chord: the boundary does not close. Open vs closed is the property.',
    steps: [
      'Test each figure: can you trace a closed loop?',
      'Circle/square/triangle — yes. Arc + chord — the arc is open.',
      'D is the exception.',
    ],
  },
  /* ── Figure Matrix ──────────────────────────────────────────────────────── */
  {
    id: 'nv-008',
    topic: 'Figure Matrix',
    subtopic: 'Row/column rule',
    difficulty: 'difficult',
    pattern: 'Original figure-matrix pattern',
    questionText:
      'Rows follow a rule: the third figure combines the shapes of the first two and inherits the shading of the second. Which figure completes the matrix?',
    figure: fig([
      triangle(18, 30, 22),
      ftext(50, 30, '+'),
      circle(82, 30, 13, true),
      ftext(18, 62, '△○', 20),
    ]),
    figureOptions: [
      fig([triangle(50, 50, 24, true)]),
      fig([triangle(50, 50, 24), circle(50, 50, 10, true)]),
      fig([circle(50, 50, 14), triangle(50, 50, 22)]),
      fig([triangle(50, 50, 24), circle(50, 50, 10)]),
    ],
    options: ['A', 'B', 'C', 'D'],
    correctOption: 'B',
    explanation:
      'Combine the row\u2019s shapes (triangle + circle) and take the fill from the second figure (filled circle). So the answer is a hollow triangle with a filled circle inside — option B.',
    steps: [
      'Shapes rule: union of both cells.',
      'Shading rule: taken from the second cell.',
      'Hollow triangle + filled circle = B.',
    ],
  },
  /* ── Mirror & Water Images ──────────────────────────────────────────────── */
  {
    id: 'nv-009',
    topic: 'Mirror Images',
    subtopic: 'Letters and digits',
    difficulty: 'easy',
    pattern: 'Original mirror-image pattern',
    questionText: 'Choose the correct mirror image of "K379" (mirror held vertically to the right).',
    figure: fig([ftext(50, 50, 'K379', 26)]),
    options: ['K379 reversed as 973K with each glyph mirrored', 'K379 unchanged', '973K with normal glyphs', 'K379 flipped upside-down'],
    correctOption: 'A',
    explanation:
      'A vertical mirror reverses order AND mirrors each glyph: K→K̶ mirrored, digits reverse to 973K with individually mirrored glyphs. Option B (unchanged) is the classic trap; C reverses order but forgets per-glyph mirroring; D describes a water image.',
    steps: [
      'Mirror on the right ⇒ read the string right-to-left.',
      'Each character is individually mirrored (K opens the other way; 3 stays 3-like but flipped).',
      'Result: mirrored glyphs in order 9,7,3,K — option A.',
    ],
  },
  {
    id: 'nv-010',
    topic: 'Water Images',
    subtopic: 'Vertical flip',
    difficulty: 'easy',
    pattern: 'Original water-image pattern',
    questionText: 'Choose the correct water image of the given figure.',
    figure: fig([triangle(50, 40, 34), dot(62, 62)]),
    figureOptions: [
      fig([triangle(50, 40, 34), dot(62, 62)], { mirror: true }),
      fig([triangle(50, 40, 34), dot(62, 62)], { flip: true }),
      fig([triangle(50, 40, 34), dot(62, 62)]),
      fig([triangle(50, 40, 34), dot(38, 38)], { flip: true }),
    ],
    options: ['A', 'B', 'C', 'D'],
    correctOption: 'B',
    explanation:
      'A water image flips top-bottom (vertical reflection) without swapping left-right. B is the exact vertical flip: the triangle points down and the dot rises above. A is a mirror image — the classic confusion the topic tests.',
    steps: [
      'Water = flip over a horizontal axis.',
      'Triangle apex: up → down. Dot: below-right → above-right.',
      'B matches; A swapped the wrong axis.',
    ],
  },
  /* ── Counting Figures ───────────────────────────────────────────────────── */
  {
    id: 'nv-011',
    topic: 'Counting Figures',
    subtopic: 'Triangles',
    difficulty: 'moderate',
    pattern: 'Original counting-figures pattern',
    questionText:
      'A large triangle is split by two lines from its apex to the base (three regions). How many triangles are there in total?',
    figure: fig([
      line(50, 14, 10, 86),
      line(50, 14, 90, 86),
      line(10, 86, 90, 86),
      line(50, 14, 37, 86),
      line(50, 14, 63, 86),
    ]),
    options: ['5', '6', '7', '9'],
    correctOption: 'B',
    explanation:
      'Three small triangles from the apex lines, plus pairs: (1+2), (2+3) → 2 two-region triangles, plus the whole outer triangle. 3 + 2 + 1 = 6. Count systematically: singles → pairs → whole.',
    steps: [
      'Smallest regions: 3 triangles.',
      'Two-region combinations sharing the apex: left pair, right pair → 2.',
      'Whole triangle: 1. Total 3+2+1 = 6.',
    ],
  },
  {
    id: 'nv-012',
    topic: 'Counting Figures',
    subtopic: 'Squares in a grid',
    difficulty: 'difficult',
    pattern: 'Original counting-figures pattern (grid)',
    questionText: 'How many squares of any size are in a 3×3 grid?',
    figure: fig([
      square(50, 50, 78),
      line(28.7, 11, 28.7, 89),
      line(71.3, 11, 71.3, 89),
      line(11, 28.7, 89, 28.7),
      line(11, 71.3, 89, 71.3),
    ]),
    options: ['9', '12', '14', '10'],
    correctOption: 'C',
    explanation:
      'Formula for n×n: 1²+2²+…+n² = 1+4+9 = 14 (nine 1×1, four 2×2, one 3×3).',
    steps: [
      '1×1 squares: 9.',
      '2×2 squares: 4 (corners of the 2×2 lattice).',
      '3×3 square: 1. Total 14.',
    ],
  },
  /* ── Cubes & Dice ───────────────────────────────────────────────────────── */
  {
    id: 'nv-013',
    topic: 'Cubes & Dice',
    subtopic: 'Opposite faces',
    difficulty: 'moderate',
    pattern: 'Original dice pattern',
    questionText:
      'Two views of the same die are shown. Faces show: view 1 — top 1, front 2, right 3; view 2 — top 1, front 4, right 6. Which number is on the face opposite 1?',
    figure: fig([square(30, 50, 36), ftext(30, 50, '1·2·3', 12), square(70, 50, 36), ftext(70, 50, '1·4·6', 12)]),
    options: ['6', '5', '4', '2'],
    correctOption: 'B',
    explanation:
      'Face 1 is adjacent to 2, 3, 4 and 6 across the two views (always on top while four different faces surround it). The only number never adjacent to 1 is 5 — so 5 is opposite 1.',
    steps: [
      'From view 1: 1 touches 2 and 3.',
      'From view 2 (same top): 1 touches 4 and 6.',
      'Digits 1–6 minus {1,2,3,4,6} = {5} ⇒ 5 opposes 1.',
    ],
  },
  {
    id: 'nv-014',
    topic: 'Cubes & Dice',
    subtopic: 'Painted cube cuts',
    difficulty: 'difficult',
    pattern: 'Original painted-cube pattern',
    questionText:
      'A 4×4×4 cube is painted on all faces and cut into 64 unit cubes. How many small cubes have exactly two painted faces?',
    options: ['24', '32', '36', '8'],
    correctOption: 'A',
    explanation:
      'Exactly-two-painted cubes are edge cubes excluding corners: each of the 12 edges contributes (n−2) = 2 cubes → 12×2 = 24.',
    steps: [
      'Edge cubes sit between two painted faces; corners have three.',
      'Per edge: n−2 = 2 non-corner cubes.',
      '12 edges × 2 = 24.',
    ],
  },
  {
    id: 'nv-015',
    topic: 'Paper Folding',
    subtopic: 'Hole punching',
    difficulty: 'difficult',
    pattern: 'Original paper-folding pattern',
    questionText:
      'A square sheet is folded in half left-to-right, then a hole is punched through both layers near the fold. How many holes appear when unfolded?',
    figure: fig([line(50, 10, 50, 90), square(50, 50, 80), dot(38, 50)]),
    options: ['2', '3', '4', '1'],
    correctOption: 'A',
    explanation:
      'Two layers are punched, and the punch sits near the fold on the left half. Unfolding mirrors the punched area across the fold line: one hole on the left half + its mirror on the right = 2 holes. (A punch exactly ON the fold gives 1; away from the fold gives 2 per fold axis crossed.)',
    steps: [
      'Fold once ⇒ 2 layers.',
      'Punch away from the fold ⇒ hole exists in both layers at mirrored positions.',
      'Unfold ⇒ 2 holes.',
    ],
  },
  {
    id: 'nv-016',
    topic: 'Embedded Figures',
    subtopic: 'Hidden shape',
    difficulty: 'moderate',
    pattern: 'Original embedded-figure pattern',
    questionText: 'The problem figure hides a simple triangle overlapping its elements. Which option shows the embedded triangle?',
    figure: fig([circle(50, 50, 30), line(30, 66, 70, 66), line(50, 26, 34, 66), line(50, 26, 66, 66)]),
    figureOptions: [
      fig([triangle(50, 48, 44)]),
      fig([circle(50, 50, 20)]),
      fig([square(50, 50, 30)]),
      fig([cross(50, 50, 14)]),
    ],
    options: ['A', 'B', 'C', 'D'],
    correctOption: 'A',
    explanation:
      'The two slanted lines meet at the top and rest on the horizontal line — they form a triangle among the circle\u2019s strokes. Option A isolates it.',
    steps: [
      'Trace the slanted lines from their meeting point at the top.',
      'They terminate on the horizontal chord — closing a three-sided figure.',
      'That triangle is option A.',
    ],
  },
  {
    id: 'nv-017',
    topic: 'Figure Completion',
    subtopic: 'Missing part',
    difficulty: 'moderate',
    pattern: 'Original figure-completion pattern',
    questionText: 'Which option completes the figure so that both halves form a symmetric whole?',
    figure: fig([arc(50, 50, 30, 90, 270), line(50, 20, 50, 80), dot(38, 38)]),
    figureOptions: [
      fig([arc(50, 50, 30, -90, 90), dot(62, 38)]),
      fig([arc(50, 50, 30, -90, 90), dot(62, 62)]),
      fig([arc(50, 50, 30, 90, 270), dot(38, 62)]),
      fig([arc(50, 50, 30, -90, 90), dot(62, 50)]),
    ],
    options: ['A', 'B', 'C', 'D'],
    correctOption: 'A',
    explanation:
      'The left half shows a semicircle opening right with a dot at upper-left. Mirroring across the vertical axis gives a right-opening arc completed on the right side with the dot at upper-right — option A.',
    steps: [
      'Symmetry axis: vertical (the given divide).',
      'Every element reflects across x=50: arc closes on the right, dot maps to upper-right.',
      'A is the mirror completion.',
    ],
  },
  {
    id: 'nv-018',
    topic: 'Paper Cutting',
    subtopic: 'Fold and cut',
    difficulty: 'difficult',
    pattern: 'Original paper-cutting pattern',
    questionText:
      'A sheet is folded twice (left-right, then top-bottom) and a corner triangle is cut from the folded corner (centre of the original sheet). How many separate holes appear when unfolded?',
    figure: fig([line(50, 10, 50, 90), line(10, 50, 90, 50), triangle(50, 50, 16, true)]),
    options: ['1', '2', '4', '8'],
    correctOption: 'C',
    explanation:
      'Two folds ⇒ 4 layers, and the cut is made at the point where all four quadrants meet (the sheet centre). Unfolding replicates the cut once per quadrant ⇒ 4 holes in a 2×2 arrangement.',
    steps: [
      'Each fold doubles layers: 2 folds ⇒ 4 layers.',
      'Cut touches all 4 layers at the centre corner.',
      'Unfold: one hole per quadrant ⇒ 4.',
    ],
  },
]
