import { useState } from 'react'
import { addBlogPost, type BlogPostDraft } from '@/data/blog-posts'

export function BlogWritePage() {
  const initialDraft: BlogPostDraft = {
    author: 'Admin',
    title: '',
    category: '',
    image: '',
    desc: '',
    intro: '',
    content: '',
    codeSnippet: '',
    footer: '',
    tags: '',
  }

  type ContentBlock =
    | { id: string; type: 'text'; value: string }
    | { id: string; type: 'image'; src: string; alt: string; caption: string }

  function createBlockId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  }

  function escapeHtml(value: string) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')
  }

  function toParagraphHtml(value: string) {
    return value
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map(
        (paragraph) =>
          `<p>${escapeHtml(paragraph).replaceAll('\n', '<br />')}</p>`,
      )
      .join('\n')
  }

  function renderBlocksAsHtml(blocks: ContentBlock[]) {
    return blocks
      .map((block) => {
        if (block.type === 'image') {
          const captionHtml = block.caption.trim()
            ? `<figcaption class="mt-3 text-sm text-slate-400">${escapeHtml(block.caption.trim())}</figcaption>`
            : ''

          return `
          <figure class="my-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
            <img src="${escapeHtml(block.src.trim())}" alt="${escapeHtml(block.alt.trim() || 'Blog image')}" class="h-full w-full object-cover" />
            ${captionHtml}
          </figure>
        `
        }

        return toParagraphHtml(block.value)
      })
      .join('\n')
  }
  const [draft, setDraft] = useState(initialDraft)
  const [savedPostId, setSavedPostId] = useState<number | null>(null)
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { id: createBlockId(), type: 'text', value: '' },
  ])

  const updateField = (field: keyof BlogPostDraft, value: string) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const updateBlock = (blockId: string, nextValue: Partial<ContentBlock>) => {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? ({ ...block, ...nextValue } as ContentBlock)
          : block,
      ),
    )
  }

  const addTextBlock = () => {
    setBlocks((current) => [
      ...current,
      { id: createBlockId(), type: 'text', value: '' },
    ])
  }

  const addImageBlock = () => {
    setBlocks((current) => [
      ...current,
      { id: createBlockId(), type: 'image', src: '', alt: '', caption: '' },
    ])
  }

  const removeBlock = (blockId: string) => {
    setBlocks((current) =>
      current.length === 1
        ? current
        : current.filter((block) => block.id !== blockId),
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!draft.title.trim() || !draft.desc.trim() || !draft.content.trim()) {
      return
    }

    const contentBlocks = blocks
      .map((block) => {
        if (block.type === 'image') {
          return block.src.trim() ? block : null
        }

        return block.value.trim() ? block : null
      })
      .filter(Boolean) as ContentBlock[]

    const post = addBlogPost({
      ...draft,
      content: [draft.content.trim(), renderBlocksAsHtml(contentBlocks)]
        .filter(Boolean)
        .join('\n'),
    })
    setSavedPostId(post.id)
    setDraft(initialDraft)
    setBlocks([{ id: createBlockId(), type: 'text', value: '' }])
  }
  return (
    <>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-6 text-slate-900 dark:text-white sm:px-6 sm:py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-linear-to-br dark:from-slate-900/95 dark:via-slate-900/80 dark:to-cyan-950/35 shadow-lg dark:shadow-2xl dark:shadow-cyan-950/20 backdrop-blur-xl">
            <div className="border-b border-slate-200 dark:border-white/10 px-5 py-6 sm:px-8 sm:py-8">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-300">
                Private write route
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl text-slate-900 dark:text-white">
                Write a new blog post
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                This route is for your own posts. Publish here and the entry
                will appear in the public blog section on the same browser.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8"
            >
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <span>Title</span>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(event) =>
                        updateField('title', event.target.value)
                      }
                      placeholder="A fresh blog title"
                      className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <span>Author</span>
                    <input
                      type="text"
                      value={draft.author}
                      onChange={(event) =>
                        updateField('author', event.target.value)
                      }
                      placeholder="Admin"
                      className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <span>Category</span>
                    <input
                      type="text"
                      value={draft.category}
                      onChange={(event) =>
                        updateField('category', event.target.value)
                      }
                      placeholder="Development"
                      className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <span>
                      Cover image URL{' '}
                      <span className="text-slate-500">(optional)</span>
                    </span>
                    <input
                      type="text"
                      value={draft.image}
                      onChange={(event) =>
                        updateField('image', event.target.value)
                      }
                      placeholder="Leave empty to show a placeholder"
                      className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <span>Description</span>
                  <textarea
                    value={draft.desc}
                    onChange={(event) =>
                      updateField('desc', event.target.value)
                    }
                    rows={3}
                    placeholder="Short summary for the blog cards"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <span>Intro</span>
                  <textarea
                    value={draft.intro}
                    onChange={(event) =>
                      updateField('intro', event.target.value)
                    }
                    rows={3}
                    placeholder="Short intro shown at the top of the detail page"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                  />
                </label>

                <div className="space-y-3 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Content blocks
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Add text and image blocks in the order you want them to
                        appear.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={addTextBlock}
                        className="rounded-full border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-200 transition-colors hover:border-cyan-400/40 hover:text-cyan-600 dark:hover:border-cyan-300/40 dark:hover:text-cyan-200"
                      >
                        + Text
                      </button>
                      <button
                        type="button"
                        onClick={addImageBlock}
                        className="rounded-full border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-200 transition-colors hover:border-cyan-400/40 hover:text-cyan-600 dark:hover:border-cyan-300/40 dark:hover:text-cyan-200"
                      >
                        + Image
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {blocks.map((block, index) => (
                      <div
                        key={block.id}
                        className="space-y-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/70 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300">
                            Block {index + 1}{' '}
                            {block.type === 'image' ? 'image' : 'text'}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeBlock(block.id)}
                            className="text-xs font-semibold text-slate-500 dark:text-slate-400 transition-colors hover:text-rose-600 dark:hover:text-rose-300"
                          >
                            Remove
                          </button>
                        </div>

                        {block.type === 'text' ? (
                          <textarea
                            value={block.value}
                            onChange={(event) =>
                              updateBlock(block.id, {
                                value: event.target.value,
                              })
                            }
                            rows={7}
                            placeholder="Write a text section here"
                            className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                          />
                        ) : (
                          <div className="space-y-3">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <input
                                type="text"
                                value={block.src}
                                onChange={(event) =>
                                  updateBlock(block.id, {
                                    src: event.target.value,
                                  })
                                }
                                placeholder="Image URL"
                                className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                              />
                              <input
                                type="text"
                                value={block.alt}
                                onChange={(event) =>
                                  updateBlock(block.id, {
                                    alt: event.target.value,
                                  })
                                }
                                placeholder="Alt text"
                                className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                              />
                            </div>
                            <textarea
                              value={block.caption}
                              onChange={(event) =>
                                updateBlock(block.id, {
                                  caption: event.target.value,
                                })
                              }
                              rows={3}
                              placeholder="Optional caption"
                              className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <span>Raw content intro</span>
                  <textarea
                    value={draft.content}
                    onChange={(event) =>
                      updateField('content', event.target.value)
                    }
                    rows={4}
                    placeholder="This text appears before the ordered blocks"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                  />
                </label>
              </div>

              <div className="space-y-6 pt-1 lg:pt-0">
                <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <span>Code snippet</span>
                  <textarea
                    value={draft.codeSnippet}
                    onChange={(event) =>
                      updateField('codeSnippet', event.target.value)
                    }
                    rows={7}
                    placeholder="Optional code block"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-4 py-3 font-mono text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <span>Footer</span>
                  <textarea
                    value={draft.footer}
                    onChange={(event) =>
                      updateField('footer', event.target.value)
                    }
                    rows={5}
                    placeholder="Optional footer HTML"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <span>Tags</span>
                  <input
                    type="text"
                    value={draft.tags}
                    onChange={(event) =>
                      updateField('tags', event.target.value)
                    }
                    placeholder="React, Design, Writing"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/80 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                  />
                </label>

                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Leave the cover image empty if you want the blog card and
                  detail page to use a placeholder instead. Add image blocks on
                  the left side to place multiple images throughout the blog
                  body.
                </div>

                {savedPostId ? (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-50 dark:bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-700 dark:text-emerald-100">
                    Post saved. Open{' '}
                    <span className="font-semibold">/blog/{savedPostId}</span>{' '}
                    or go back to the blog section to see it.
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="w-full rounded-2xl border border-cyan-400/30 bg-cyan-500/10 dark:bg-cyan-500/15 px-5 py-3 text-sm font-semibold text-cyan-700 dark:text-cyan-100 transition-colors hover:border-cyan-400/60 hover:bg-cyan-500/20 dark:hover:border-cyan-300/50 dark:hover:bg-cyan-500/25"
                >
                  Post blog
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </>
  )
}
