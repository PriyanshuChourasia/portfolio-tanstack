import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import blogData from '@/data/blog-data.json'

const previewPosts = blogData.posts.slice(0, 4)

export default function ArticlePreviewSection() {
  return (
    <section id="articles" className="py-20">
      <div className="max-w-2xl mx-auto px-6">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Writing
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">Featured</span>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          {previewPosts.map((post, i) => (
            <div key={post.id}>
              <Link
                to="/blog/$id"
                params={{ id: String(post.id) }}
                className="flex items-center justify-between py-5 gap-4 group"
              >
                <p className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors">
                  {post.title}
                </p>
                <span className="text-sm text-slate-400 dark:text-slate-500 shrink-0">
                  {post.date}
                </span>
              </Link>
              {i < previewPosts.length - 1 && (
                <hr className="border-slate-100 dark:border-slate-800/50" />
              )}
            </div>
          ))}
        </motion.div>

        <hr className="border-slate-200 dark:border-slate-800 mb-5" />

        <a
          href="#articles"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          All Writing <ArrowRight size={13} />
        </a>
      </div>
    </section>
  )
}
