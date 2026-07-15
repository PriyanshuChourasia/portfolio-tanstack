import { useState } from 'react'
import { usePortfolioStore } from '../store'
import { DEFAULT_THEME } from '../constants'
import { portfolioTemplates } from '../templates/registry'

interface EditorPanelProps {
  onClose: () => void
}

export function EditorPanel({ onClose }: EditorPanelProps) {
  const store = usePortfolioStore()
  const [activeTab, setActiveTab] = useState<string>('hero')
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillPercent, setNewSkillPercent] = useState(50)

  const tabs = [
    { id: 'template', label: 'Template' },
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'skills', label: 'Skills' },
    { id: 'stats', label: 'Stats' },
    { id: 'projects', label: 'Projects' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact & Footer' },
    { id: 'theme', label: 'Theme' },
    { id: 'sections', label: 'Sections' },
  ]

  const activeColor = store.data.theme.accent

  const colorInput = (label: string, value: string, onChange: (v: string) => void) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 cursor-pointer rounded border"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md border bg-background px-2 py-1 text-xs font-mono"
        />
      </div>
    </div>
  )

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Portfolio Editor</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={store.undo}
            disabled={!store.canUndo}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
            title="Undo"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
          <button
            onClick={store.redo}
            disabled={!store.canRedo}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
            title="Redo"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
          <button
            onClick={store.resetData}
            className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
            title="Reset"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="ml-2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b px-3 py-2 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="shrink-0 rounded-md px-3 py-1 text-xs font-medium transition-all"
            style={{
              backgroundColor: activeTab === tab.id ? activeColor : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--muted-foreground)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* ── TEMPLATE ── */}
        {activeTab === 'template' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Choose Template</p>
            {portfolioTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => store.setTemplate(t.id)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  store.activeTemplate === t.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'hover:border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{t.name}</span>
                  {store.activeTemplate === t.id && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">Active</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* ── HERO ── */}
        {activeTab === 'hero' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Name</label>
              <input
                type="text"
                value={store.data.hero.name}
                onChange={(e) => store.updateHero({ name: e.target.value })}
                placeholder="Your Name"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Title</label>
              <input
                type="text"
                value={store.data.hero.title}
                onChange={(e) => store.updateHero({ title: e.target.value })}
                placeholder="UI/UX Designer"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Tagline</label>
              <input
                type="text"
                value={store.data.hero.tagline}
                onChange={(e) => store.updateHero({ tagline: e.target.value })}
                placeholder="Specializing in modern web & mobile design"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Profile Image URL</label>
              <input
                type="text"
                value={store.data.hero.profileImage}
                onChange={(e) => store.updateHero({ profileImage: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Resume URL</label>
                <input
                  type="text"
                  value={store.data.hero.resumeUrl}
                  onChange={(e) => store.updateHero({ resumeUrl: e.target.value })}
                  placeholder="#"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Video URL</label>
                <input
                  type="text"
                  value={store.data.hero.videoUrl}
                  onChange={(e) => store.updateHero({ videoUrl: e.target.value })}
                  placeholder="#"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-2 border-t pt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Social Links</p>
              {store.data.hero.socialLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border p-2">
                  <select
                    value={link.icon}
                    onChange={(e) => store.updateSocialLink(i, { icon: e.target.value })}
                    className="rounded-md border bg-background px-2 py-1.5 text-xs"
                  >
                    <option value="facebook">FB</option>
                    <option value="twitter">TW</option>
                    <option value="linkedin">IN</option>
                    <option value="github">GH</option>
                    <option value="instagram">IG</option>
                    <option value="dribbble">DR</option>
                    <option value="behance">BE</option>
                    <option value="youtube">YT</option>
                  </select>
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => store.updateSocialLink(i, { platform: e.target.value })}
                    placeholder="Platform"
                    className="w-20 rounded-md border bg-background px-2 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => store.updateSocialLink(i, { url: e.target.value })}
                    placeholder="URL"
                    className="flex-1 rounded-md border bg-background px-2 py-1.5 text-xs"
                  />
                  <button onClick={() => store.removeSocialLink(i)} className="text-xs text-destructive">✕</button>
                </div>
              ))}
              <button
                onClick={() => store.addSocialLink({ platform: '', url: '', icon: 'globe' })}
                className="w-full rounded-lg border-2 border-dashed py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
              >
                + Add Social Link
              </button>
            </div>
          </div>
        )}

        {/* ── ABOUT ── */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Title</label>
              <input
                type="text"
                value={store.data.about.title}
                onChange={(e) => store.updateAbout({ title: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <textarea
                value={store.data.about.description}
                onChange={(e) => store.updateAbout({ description: e.target.value })}
                rows={5}
                className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Image URL</label>
              <input
                type="text"
                value={store.data.about.image}
                onChange={(e) => store.updateAbout({ image: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {/* ── SERVICES ── */}
        {activeTab === 'services' && (
          <div className="space-y-3">
            {store.data.services.map((service, i) => (
              <div key={service.id} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Service {i + 1}</span>
                  <button
                    onClick={() => store.removeService(i)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => store.updateService(i, { title: e.target.value })}
                    placeholder="Service Title"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <textarea
                    value={service.description}
                    onChange={(e) => store.updateService(i, { description: e.target.value })}
                    placeholder="Service Description"
                    rows={2}
                    className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={service.icon}
                      onChange={(e) => store.updateService(i, { icon: e.target.value })}
                      placeholder="Icon name (palette, code, etc.)"
                      className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                    />
                    <select
                      value={service.icon}
                      onChange={(e) => store.updateService(i, { icon: e.target.value })}
                      className="rounded-md border bg-background px-2 py-2 text-xs"
                    >
                      <option value="palette">Palette</option>
                      <option value="code">Code</option>
                      <option value="pen-tool">Pen Tool</option>
                      <option value="award">Award</option>
                      <option value="smartphone">Phone</option>
                      <option value="users">Users</option>
                      <option value="lightbulb">Lightbulb</option>
                      <option value="shield">Shield</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                store.addService({
                  id: crypto.randomUUID(),
                  title: '',
                  description: '',
                  icon: 'lightbulb',
                })
              }
              className="w-full rounded-lg border-2 border-dashed py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              + Add Service
            </button>
          </div>
        )}

        {/* ── SKILLS ── */}
        {activeTab === 'skills' && (
          <div className="space-y-3">
            {store.data.skills.map((skill, i) => (
              <div key={skill.id} className="flex items-center gap-2 rounded-lg border p-3">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => store.updateSkill(i, { name: e.target.value })}
                  placeholder="Skill name"
                  className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={skill.percentage}
                    onChange={(e) => store.updateSkill(i, { percentage: parseInt(e.target.value) })}
                    className="h-1.5 w-20"
                  />
                  <span className="w-8 text-right text-xs font-medium">{skill.percentage}%</span>
                </div>
                <button
                  onClick={() => store.removeSkill(i)}
                  className="text-xs text-destructive"
                >
                  ✕
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="New skill"
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
              />
              <input
                type="range"
                min={0}
                max={100}
                value={newSkillPercent}
                onChange={(e) => setNewSkillPercent(parseInt(e.target.value))}
                className="h-1.5 w-16"
              />
              <span className="w-8 text-right text-xs">{newSkillPercent}%</span>
              <button
                onClick={() => {
                  if (newSkillName.trim()) {
                    store.addSkill({
                      id: crypto.randomUUID(),
                      name: newSkillName,
                      percentage: newSkillPercent,
                    })
                    setNewSkillName('')
                    setNewSkillPercent(50)
                  }
                }}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* ── STATS ── */}
        {activeTab === 'stats' && (
          <div className="space-y-3">
            {store.data.stats.map((stat, i) => (
              <div key={stat.id} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Stat {i + 1}</span>
                  <button onClick={() => store.removeStat(i)} className="text-xs text-destructive">Remove</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => store.updateStat(i, { label: e.target.value })}
                    placeholder="Label"
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => store.updateStat(i, { value: e.target.value })}
                    placeholder="Value"
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={stat.suffix}
                    onChange={(e) => store.updateStat(i, { suffix: e.target.value })}
                    placeholder="Suffix"
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => store.addStat({ id: crypto.randomUUID(), label: '', value: '', suffix: '' })}
              className="w-full rounded-lg border-2 border-dashed py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
            >
              + Add Stat
            </button>
          </div>
        )}

        {/* ── PROJECTS ── */}
        {activeTab === 'projects' && (
          <div className="space-y-3">
            {store.data.projects.map((project, i) => (
              <div key={project.id} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Project {i + 1}</span>
                  <button onClick={() => store.removeProject(i)} className="text-xs text-destructive">Remove</button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => store.updateProject(i, { title: e.target.value })}
                    placeholder="Project Title"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={project.category}
                      onChange={(e) => store.updateProject(i, { category: e.target.value })}
                      placeholder="Category"
                      className="rounded-md border bg-background px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      value={project.link}
                      onChange={(e) => store.updateProject(i, { link: e.target.value })}
                      placeholder="Link URL"
                      className="rounded-md border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <textarea
                    value={project.description}
                    onChange={(e) => store.updateProject(i, { description: e.target.value })}
                    placeholder="Description"
                    rows={2}
                    className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={project.image}
                    onChange={(e) => store.updateProject(i, { image: e.target.value })}
                    placeholder="Image URL"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={project.tags.join(', ')}
                    onChange={(e) => store.updateProject(i, { tags: e.target.value.split(',').map((t) => t.trim()) })}
                    placeholder="Tags (comma separated)"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => store.addProject({ id: crypto.randomUUID(), title: '', category: '', description: '', image: '', tags: [], link: '' })}
              className="w-full rounded-lg border-2 border-dashed py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
            >
              + Add Project
            </button>
          </div>
        )}

        {/* ── TESTIMONIALS ── */}
        {activeTab === 'testimonials' && (
          <div className="space-y-3">
            {store.data.testimonials.map((t, i) => (
              <div key={t.id} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Testimonial {i + 1}</span>
                  <button onClick={() => store.removeTestimonial(i)} className="text-xs text-destructive">Remove</button>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => store.updateTestimonial(i, { name: e.target.value })}
                      placeholder="Name"
                      className="rounded-md border bg-background px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      value={t.role}
                      onChange={(e) => store.updateTestimonial(i, { role: e.target.value })}
                      placeholder="Role"
                      className="rounded-md border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    value={t.company}
                    onChange={(e) => store.updateTestimonial(i, { company: e.target.value })}
                    placeholder="Company"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <textarea
                    value={t.quote}
                    onChange={(e) => store.updateTestimonial(i, { quote: e.target.value })}
                    placeholder="Quote"
                    rows={3}
                    className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={t.avatar}
                    onChange={(e) => store.updateTestimonial(i, { avatar: e.target.value })}
                    placeholder="Avatar URL"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => store.updateTestimonial(i, { rating: star })}
                        className={`text-lg ${star <= t.rating ? '' : 'opacity-30'}`}
                        style={{ color: star <= t.rating ? '#f59e0b' : 'currentColor' }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => store.addTestimonial({ id: crypto.randomUUID(), name: '', role: '', company: '', quote: '', avatar: '', rating: 5 })}
              className="w-full rounded-lg border-2 border-dashed py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
            >
              + Add Testimonial
            </button>
          </div>
        )}

        {/* ── BLOG ── */}
        {activeTab === 'blog' && (
          <div className="space-y-3">
            {store.data.blog.map((post, i) => (
              <div key={post.id} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Post {i + 1}</span>
                  <button onClick={() => store.removeBlogPost(i)} className="text-xs text-destructive">Remove</button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={post.title}
                    onChange={(e) => store.updateBlogPost(i, { title: e.target.value })}
                    placeholder="Post Title"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <textarea
                    value={post.excerpt}
                    onChange={(e) => store.updateBlogPost(i, { excerpt: e.target.value })}
                    placeholder="Excerpt"
                    rows={2}
                    className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={post.date}
                      onChange={(e) => store.updateBlogPost(i, { date: e.target.value })}
                      placeholder="Date"
                      className="rounded-md border bg-background px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      value={post.category}
                      onChange={(e) => store.updateBlogPost(i, { category: e.target.value })}
                      placeholder="Category"
                      className="rounded-md border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    value={post.image}
                    onChange={(e) => store.updateBlogPost(i, { image: e.target.value })}
                    placeholder="Image URL"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={post.link}
                    onChange={(e) => store.updateBlogPost(i, { link: e.target.value })}
                    placeholder="Link URL"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => store.addBlogPost({ id: crypto.randomUUID(), title: '', excerpt: '', date: '', image: '', category: '', link: '', author: store.data.hero.name || '' })}
              className="w-full rounded-lg border-2 border-dashed py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
            >
              + Add Blog Post
            </button>
          </div>
        )}          {/* ── CONTACT ── */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="text"
                value={store.data.contact.email}
                onChange={(e) => store.updateContact({ email: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Phone</label>
              <input
                type="text"
                value={store.data.contact.phone}
                onChange={(e) => store.updateContact({ phone: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Address</label>
              <input
                type="text"
                value={store.data.contact.address}
                onChange={(e) => store.updateContact({ address: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Newsletter Title</label>
              <input
                type="text"
                value={store.data.contact.newsletterTitle}
                onChange={(e) => store.updateContact({ newsletterTitle: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Newsletter Description</label>
              <textarea
                value={store.data.contact.newsletterDescription}
                onChange={(e) => store.updateContact({ newsletterDescription: e.target.value })}
                rows={2}
                className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            {/* Footer Settings */}
            <div className="space-y-2 border-t pt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Footer</p>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Copyright Text</label>
                <input
                  type="text"
                  value={store.data.footer.copyright}
                  onChange={(e) => store.updateFooter({ copyright: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Credit / Signature Text</label>
                <input
                  type="text"
                  value={store.data.footer.madeWith}
                  onChange={(e) => store.updateFooter({ madeWith: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
              {/* Footer Social Links */}
              <p className="text-xs font-medium text-muted-foreground pt-2">Social Links</p>
              {store.data.footer.socialLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border p-2">
                  <select
                    value={link.icon}
                    onChange={(e) => store.updateFooterSocial(i, { icon: e.target.value })}
                    className="rounded-md border bg-background px-2 py-1.5 text-xs"
                  >
                    <option value="facebook">FB</option>
                    <option value="twitter">TW</option>
                    <option value="linkedin">IN</option>
                    <option value="github">GH</option>
                    <option value="instagram">IG</option>
                    <option value="dribbble">DR</option>
                    <option value="behance">BE</option>
                    <option value="youtube">YT</option>
                  </select>
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => store.updateFooterSocial(i, { platform: e.target.value })}
                    placeholder="Platform"
                    className="w-20 rounded-md border bg-background px-2 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => store.updateFooterSocial(i, { url: e.target.value })}
                    placeholder="URL"
                    className="flex-1 rounded-md border bg-background px-2 py-1.5 text-xs"
                  />
                  <button onClick={() => store.removeFooterSocial(i)} className="text-xs text-destructive">✕</button>
                </div>
              ))}
              <button
                onClick={() => store.addFooterSocial({ platform: '', url: '', icon: 'globe' })}
                className="w-full rounded-lg border-2 border-dashed py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
              >
                + Add Social Link
              </button>
            </div>
          </div>
        )}

        {/* ── THEME ── */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            {colorInput('Primary', store.data.theme.primary, (v) => store.updateTheme({ primary: v }))}
            {colorInput('Secondary', store.data.theme.secondary, (v) => store.updateTheme({ secondary: v }))}
            {colorInput('Accent', store.data.theme.accent, (v) => store.updateTheme({ accent: v }))}
            {colorInput('Background', store.data.theme.background, (v) => store.updateTheme({ background: v }))}
            {colorInput('Surface', store.data.theme.surface, (v) => store.updateTheme({ surface: v }))}
            {colorInput('Text', store.data.theme.text, (v) => store.updateTheme({ text: v }))}
            {colorInput('Muted Text', store.data.theme.textMuted, (v) => store.updateTheme({ textMuted: v }))}

            <button
              onClick={() => store.updateTheme(DEFAULT_THEME)}
              className="w-full rounded-md border py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              Reset to Default Theme
            </button>
          </div>
        )}

        {/* ── SECTIONS TOGGLE ── */}
        {activeTab === 'sections' && (
          <div className="space-y-2">
            {Object.entries(store.data.sections).map(([key, value]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
              >
                <span className="text-sm font-medium capitalize">{key}</span>
                <div
                  className={`relative h-5 w-9 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  onClick={() => store.toggleSection(key as keyof typeof store.data.sections)}
                >
                  <div
                    className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-4' : 'translate-x-0'}`}
                  />
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
