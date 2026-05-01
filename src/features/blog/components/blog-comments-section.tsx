import { useState } from 'react'

export default function BlogCommentsSection() {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(12)
  const [commentName, setCommentName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<
    Array<{ id: number; name: string; text: string; createdAt: string }>
  >([
    {
      id: 1,
      name: 'Ava',
      text: 'Great write-up. The practical examples are really helpful.',
      createdAt: '2h ago',
    },
    {
      id: 2,
      name: 'Noah',
      text: 'Loved the structure of this post. Looking forward to more.',
      createdAt: '45m ago',
    },
  ])

  const toggleLike = () => {
    setLiked((prev) => {
      const next = !prev
      setLikeCount((count) => count + (next ? 1 : -1))
      return next
    })
  }

  const addComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const name = commentName.trim()
    const text = commentText.trim()
    if (!name || !text) {
      return
    }

    setComments((prev) => [
      {
        id: Date.now(),
        name,
        text,
        createdAt: 'Just now',
      },
      ...prev,
    ])
    setCommentName('')
    setCommentText('')
  }

  return (
    <section className="border-t border-white/10 px-4 py-8 sm:px-6 sm:py-10 md:px-12 lg:px-14">
      <div className="space-y-5 rounded-2xl border border-white/10 bg-slate-900/40 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white sm:text-xl">Likes & Comments</h2>
          <button
            type="button"
            onClick={toggleLike}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              liked
                ? 'border-pink-400/50 bg-pink-500/20 text-pink-200'
                : 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200 hover:border-cyan-300/40'
            }`}
          >
            <span aria-hidden="true">{liked ? '♥' : '♡'}</span>
            <span>{likeCount} likes</span>
          </button>
        </div>

        <form onSubmit={addComment} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={commentName}
              onChange={(event) => setCommentName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-200 transition-colors hover:border-cyan-300/50 hover:bg-cyan-500/25"
            >
              Add Comment
            </button>
          </div>
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            rows={3}
            placeholder="Write your comment..."
            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
          />
        </form>

        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">{comment.name}</p>
                <p className="text-xs text-slate-500">{comment.createdAt}</p>
              </div>
              <p className="text-sm leading-6 text-slate-300">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
