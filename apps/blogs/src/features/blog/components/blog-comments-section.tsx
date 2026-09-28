import { useState } from 'react'
import { Heart, MessageCircle } from 'lucide-react'

export default function BlogCommentsSection() {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(12)
  const [commentName, setCommentName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<
    Array<{ id: number; name: string; text: string; createdAt: string }>
  >([])

  const toggleLike = () => {
    setLiked((prev) => {
      const next = !prev
      setLikeCount((count) => count + (next ? 1 : -1))
      return next
    })
  }

  const addComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const name = commentName.trim()
    const text = commentText.trim()
    if (!name || !text) return
    setComments((prev) => [
      { id: Date.now(), name, text, createdAt: 'Just now' },
      ...prev,
    ])
    setCommentName('')
    setCommentText('')
  }

  return (
    <div className="rounded-2xl border border-slate-200 border-border bg-white dark:bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 border-border">
        <div className="flex items-center gap-2 text-slate-900 text-foreground font-semibold">
          <MessageCircle size={18} className="text-primary-accent" />
          <span>Discussion ({comments.length})</span>
        </div>

        <button
          type="button"
          onClick={toggleLike}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
            liked
              ? 'border-pink-300 dark:border-pink-400/50 bg-pink-50 dark:bg-pink-500/15 text-pink-600 dark:text-pink-300'
              : 'border-slate-200 border-border bg-transparent text-slate-500 text-muted-foreground hover:border-pink-300 dark:hover:border-pink-400/40 hover:text-pink-500 dark:hover:text-pink-300'
          }`}
        >
          <Heart size={15} className={liked ? 'fill-current' : ''} />
          <span>{likeCount}</span>
        </button>
      </div>

      {/* Comment form */}
      <form
        onSubmit={addComment}
        className="px-6 py-6 border-b border-slate-100 border-border"
      >
        <h3 className="text-sm font-semibold text-slate-700 text-foreground mb-4">
          Leave a comment
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            value={commentName}
            onChange={(e) => setCommentName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-slate-200 border-border bg-slate-50 bg-card/60 px-4 py-2.5 text-sm text-slate-900 text-foreground placeholder:text-slate-400 placeholder:text-muted-foreground focus:border-primary-accent focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/20 focus:ring-primary-accent/20 transition-colors"
          />
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            placeholder="Share your thoughts..."
            className="w-full rounded-xl border border-slate-200 border-border bg-slate-50 bg-card/60 px-4 py-2.5 text-sm text-slate-900 text-foreground placeholder:text-slate-400 placeholder:text-muted-foreground focus:border-primary-accent focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/20 focus:ring-primary-accent/20 transition-colors resize-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-primary-accent hover:bg-primary-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Comment list */}
      <div className="px-6 py-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            {/* Avatar */}
            <div className="shrink-0 w-9 h-9 rounded-full bg-linear-to-br from-primary-accent to-primary flex items-center justify-center text-white text-sm font-bold">
              {comment.name[0].toUpperCase()}
            </div>
            <div className="flex-1 rounded-xl border border-slate-100 border-border bg-slate-50 bg-card/40 px-4 py-3">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <p className="text-sm font-semibold text-slate-900 text-foreground">
                  {comment.name}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {comment.createdAt}
                </p>
              </div>
              <p className="text-sm leading-6 text-slate-600 text-foreground">
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
