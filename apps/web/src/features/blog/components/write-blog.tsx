import { useRef, useState } from 'react'
import { ImageUp, X } from 'lucide-react'
import type {BlogPostDraft} from '@/data/blog-posts';
import {  addBlogPost } from '@/data/blog-posts'

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

  function renderBlocksAsHtml(blocks: Array<ContentBlock>) {
    return blocks
      .map((block) => {
        if (block.type === 'image') {
          const captionHtml = block.caption.trim()
            ? `<figcaption class="mt-3 text-sm text-slate-400">${escapeHtml(block.caption.trim())}</figcaption>`
            : ''

          return `
          <figure class="my-6 overflow-hidden rounded-3xl border border-border bg-card/70">
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
  const [blocks, setBlocks] = useState<Array<ContentBlock>>([
    { id: createBlockId(), type: 'text', value: '' },
  ])
  const [coverImagePreview, setCoverImagePreview] = useState<string>('')
  const coverInputRef = useRef<HTMLInputElement>(null)

  const updateField = (field: keyof BlogPostDraft, value: string) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleCoverImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setCoverImagePreview(dataUrl)
      updateField('image', dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const clearCoverImage = () => {
    setCoverImagePreview('')
    updateField('image', '')
    if (coverInputRef.current) {
      coverInputRef.current.value = ''
    }
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
      .filter(Boolean) as Array<ContentBlock>

    const post = addBlogPost({
      ...draft,
      content: [draft.content.trim(), renderBlocksAsHtml(contentBlocks)]
        .filter(Boolean)
        .join('\n'),
    })
    setSavedPostId(post.id)
    setDraft(initialDraft)
    setBlocks([{ id: createBlockId(), type: 'text', value: '' }])
    setCoverImagePreview('')
  }

  /* ─── Helper: image upload button rendered inside content blocks ─── */
  function ImageBlockUploader({
    blockId,
    updateBlock: onUpdateBlock,
  }: {
    blockId: string
    updateBlock: typeof updateBlock
  }) {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        onUpdateBlock(blockId, { src: dataUrl })
      }
      reader.readAsDataURL(file)
    }

    return (
      <>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 border-border bg-slate-50 dark:bg-background/40 px-4 py-6 text-slate-500 text-muted-foreground hover:border-primary-accent/50 hover:text-primary hover:text-primary-accent transition-colors"
        >
          <ImageUp size={22} />
          <div className="text-left">
            <p className="text-sm font-semibold">Upload image</p>
            <p className="text-xs mt-0.5">PNG, JPG, WebP, or GIF</p>
          </div>
        </button>
      </>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50 dark:bg-background px-4 py-6 text-slate-900 text-foreground sm:px-6 sm:py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="overflow-hidden rounded-3xl border border-slate-200 border-border bg-white bg-linear-to-br from-card/95 via-card/80 to-primary/35 shadow-lg shadow-2xl shadow-primary/20 backdrop-blur-xl">
            <div className="border-b border-slate-200 border-border px-5 py-6 sm:px-8 sm:py-8">
              <p className="text-xs uppercase tracking-[0.35em] text-primary dark:text-primary-accent">
                Private write route
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl text-slate-900 text-foreground">
                Write a new blog post
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 text-foreground sm:text-base">
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
                  <label className="space-y-2 text-sm text-slate-600 text-foreground">
                    <span>Title</span>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(event) =>
                        updateField('title', event.target.value)
                      }
                      placeholder="A fresh blog title"
                      className="w-full rounded-2xl border border-slate-300 border-border bg-white dark:bg-background/80 px-4 py-3 text-slate-900 text-foreground placeholder:text-slate-400 placeholder:text-muted-foreground focus:border-primary-accent/40 focus:outline-none"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-600 text-foreground">
                    <span>Author</span>
                    <input
                      type="text"
                      value={draft.author}
                      onChange={(event) =>
                        updateField('author', event.target.value)
                      }
                      placeholder="Admin"
                      className="w-full rounded-2xl border border-slate-300 border-border bg-white dark:bg-background/80 px-4 py-3 text-slate-900 text-foreground placeholder:text-slate-400 placeholder:text-muted-foreground focus:border-primary-accent/40 focus:outline-none"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-600 text-foreground">
                    <span>Category</span>
                    <input
                      type="text"
                      value={draft.category}
                      onChange={(event) =>
                        updateField('category', event.target.value)
                      }
                      placeholder="Development"
                      className="w-full rounded-2xl border border-slate-300 border-border bg-white dark:bg-background/80 px-4 py-3 text-slate-900 text-foreground placeholder:text-slate-400 placeholder:text-muted-foreground focus:border-primary-accent/40 focus:outline-none"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-600 text-foreground">
                    <span>
                      Cover image{' '}
                      <span className="text-slate-500">(optional)</span>
                    </span>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={handleCoverImageUpload}
                      className="hidden"
                    />
                    {coverImagePreview ? (
                      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-300 border-border bg-slate-100 dark:bg-background/80">
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="w-full h-40 object-cover"
                        />
                        <button
                          type="button"
                          onClick={clearCoverImage}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                          aria-label="Remove cover image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 border-border bg-slate-50 dark:bg-background/40 px-4 py-8 text-slate-500 text-muted-foreground hover:border-primary-accent/50 hover:text-primary hover:text-primary-accent transition-colors"
                      >
                        <ImageUp size={24} />
                        <div className="text-left">
                          <p className="text-sm font-semibold">
                            Upload cover image
                          </p>
                          <p className="text-xs mt-0.5">
                            PNG, JPG, WebP, or GIF
                          </p>
                        </div>
                      </button>
                    )}
                  </label>
                </div>

                <label className="space-y-2 text-sm text-slate-600 text-foreground">
                  <span>Description</span>
                  <textarea
                    value={draft.desc}
                    onChange={(event) =>
                      updateField('desc', event.target.value)
                    }
                    rows={3}
                    placeholder="Short summary for the blog cards"
                    className="w-full rounded-2xl border border-slate-300 border-border bg-white dark:bg-background/80 px-4 py-3 text-slate-900 text-foreground placeholder:text-slate-400 placeholder:text-muted-foreground focus:border-primary-accent/40 focus:outline-none"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-600 text-foreground">
                  <span>Intro</span>
                  <textarea
                    value={draft.intro}
                    onChange={(event) =>
                      updateField('intro', event.target.value)
                    }
                    rows={3}
                    placeholder="Short intro shown at the top of the detail page"
                    className="w-full rounded-2xl border border-slate-300 border-border bg-white dark:bg-background/80 px-4 py-3 text-slate-900 text-foreground placeholder:text-slate-400 placeholder:text-muted-foreground focus:border-primary-accent/40 focus:outline-none"
                  />
                </label>

                <div className="space-y-3 rounded-3xl border border-slate-200 border-border bg-slate-50 bg-card/5 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 text-foreground">
                        Content blocks
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 text-muted-foreground">
                        Add text and image blocks in the order you want them to
                        appear.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={addTextBlock}
                        className="rounded-full border border-slate-300 border-border bg-white dark:bg-background/80 px-3 py-2 text-xs font-semibold text-slate-600 text-foreground transition-colors hover:border-primary-accent/40 hover:text-primary hover:border-primary-accent/30/40 dark:hover:text-primary-accent/80"
                      >
                        + Text
                      </button>
                      <button
                        type="button"
                        onClick={addImageBlock}
                        className="rounded-full border border-slate-300 border-border bg-white dark:bg-background/80 px-3 py-2 text-xs font-semibold text-slate-600 text-foreground transition-colors hover:border-primary-accent/40 hover:text-primary hover:border-primary-accent/30/40 dark:hover:text-primary-accent/80"
                      >
                        + Image
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {blocks.map((block, index) => (
                      <div
                        key={block.id}
                        className="space-y-3 rounded-2xl border border-slate-200 border-border bg-slate-50 dark:bg-background/70 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs uppercase tracking-[0.3em] text-primary dark:text-primary-accent">
                            Block {index + 1}{' '}
                            {block.type === 'image' ? 'image' : 'text'}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeBlock(block.id)}
                            className="text-xs font-semibold text-slate-500 text-muted-foreground transition-colors hover:text-rose-600 dark:hover:text-rose-300"
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
                            className="w-full rounded-2xl border border-slate-300 border-border bg-white dark:bg-background/80 px-4 py-3 text-sm text-slate-900 text-foreground placeholder:text-slate-400 placeholder:text-muted-foreground focus:border-primary-accent/40 focus:outline-none"
                          />
                        ) : (
                          <div className="space-y-3">
                            {block.src ? (
                              <div className="relative w-full rounded-2xl overflow-hidden border border-slate-300 border-border bg-slate-100 dark:bg-background/80">
                                <img
                                  src={block.src}
                                  alt={block.alt || 'Uploaded image'}
                                  className="w-full h-36 object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateBlock(block.id, {
                                      src: '',
                                    })
                                  }
                                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                  aria-label="Remove image"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <ImageBlockUploader
                                blockId={block.id}
                                updateBlock={updateBlock}
                              />
                            )}
                            <div className="grid gap-3 sm:grid-cols-2">
                              <input
                                type="text"
                                value={block.alt}
                                onChange={(event) =>
                                  updateBlock(block.id, {
                                    alt: event.target.value,
                                  })
                                }
                                placeholder="Alt text"
                                className="w-full rounded-2xl border border-slate-300 border-border bg-white dark:bg-background/80 px-4 py-3 text-sm text-slate-900 text-foreground placeholder:text-slate-400 placeholder:text-muted-foreground focus:border-primary-accent/40 focus:outline-none"
                              />
                            </div>
                            <textarea
                              value={block.caption}
                              onChange={(event) =>
                                updateBlock(block.id, {
                                  caption: event.target.value,
                                })
                              }
                              rows={2}
                              placeholder="Optional caption"
                              className="w-full rounded-2xl border border-slate-300 border-border bg-white dark:bg-background/80 px-4 py-3 text-sm text-slate-900 text-foreground placeholder:text-slate-400 placeholder:text-muted-foreground focus:border-primary-accent/40 focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <label className="space-y-2 text-sm text-slate-600 text-foreground">
                  <span>Raw content intro</span>
                  <textarea
                    value={draft.content}
                    onChange={(event) =>
                      updateField('content', event.target.value)
                    }
                    rows={4}
                    placeholder="This text appears before the ordered blocks"
                    className="w-full rounded-2xl border border-slate-300 border-border bg-white dark:bg-background/80 px-4 py-3 text-slate-900 text-foreground placeholder:text-slate-400 placeholder:text-muted-foreground focus:border-primary-accent/40 focus:outline-none"
                  />
                </label>
              </div>

              <div className="space-y-6 pt-1 lg:pt-0">
                <label className="space-y-2 text-sm text-slate-600 text-foreground">
                  <span>Code snippet</span>
                  <textarea
                    value={draft.codeSnippet}
                    onChange={(event) =>
                      updateField('codeSnippet', event.target.value)
                    }
                    rows={7}
                    placeholder="Optional code block"
                    className="w-full rounded-2xl border border-slate-300 border-border bg-white dark:bg-background/80 px-4 py-3 font-mono text-sm text-slate-900 text-foreground placeholder:text-slate-400 placeholder:text-muted-foreground focus:border-primary-accent/40 focus:outline-none"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-600 text-foreground">
                  <span>Footer</span>
                  <textarea
                    value={draft.footer}
                    onChange={(event) =>
                      updateField('footer', event.target.value)
                    }
                    rows={5}
                    placeholder="Optional footer HTML"
                    className="w-full rounded-2xl border border-slate-300 border-border bg-white dark:bg-background/80 px-4 py-3 text-slate-900 text-foreground placeholder:text-slate-400 placeholder:text-muted-foreground focus:border-primary-accent/40 focus:outline-none"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-600 text-foreground">
                  <span>Tags</span>
                  <input
                    type="text"
                    value={draft.tags}
                    onChange={(event) =>
                      updateField('tags', event.target.value)
                    }
                    placeholder="React, Design, Writing"
                    className="w-full rounded-2xl border border-slate-300 border-border bg-white dark:bg-background/80 px-4 py-3 text-slate-900 text-foreground placeholder:text-slate-400 placeholder:text-muted-foreground focus:border-primary-accent/40 focus:outline-none"
                  />
                </label>

                <div className="rounded-2xl border border-slate-200 border-border bg-slate-50 bg-card/5 px-4 py-3 text-sm leading-6 text-slate-600 text-foreground">
                  Upload a cover image or leave empty for a placeholder. Add
                  images to content blocks for inline placement throughout the
                  blog body.
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
                  className="w-full rounded-2xl border border-primary-accent/30 bg-primary-accent/10 dark:bg-primary-accent/15 px-5 py-3 text-sm font-semibold text-primary text-primary-accent/60 transition-colors hover:border-primary-accent/60 hover:bg-primary-accent/20 hover:border-primary-accent/30/50 hover:bg-primary-accent/25"
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
