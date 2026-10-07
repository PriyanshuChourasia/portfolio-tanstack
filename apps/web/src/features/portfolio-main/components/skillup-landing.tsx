import { motion } from 'framer-motion';
import { ArrowRight, Award, BookOpen, Code2, Lightbulb, MessageSquare, TrendingUp, Users, Zap } from 'lucide-react';

// Skill categories with icons
const skillCategories = [
  {
    name: 'Frontend Development',
    icon: Code2,
    description: 'Master React, Vue, TypeScript, and modern CSS',
    color: 'from-violet-500 to-purple-600',
    gradient: 'from-violet-500/20 to-purple-600/10',
    border: 'border-violet-500/30',
    count: '2,847 learners',
  },
  {
    name: 'Backend Engineering',
    icon: TrendingUp,
    description: 'Node.js, Python, Databases & API design',
    color: 'from-blue-500 to-cyan-600',
    gradient: 'from-blue-500/20 to-cyan-600/10',
    border: 'border-blue-500/30',
    count: '3,156 learners',
  },
  {
    name: 'Cloud & DevOps',
    icon: Zap,
    description: 'AWS, Docker, Kubernetes, CI/CD pipelines',
    color: 'from-emerald-500 to-teal-600',
    gradient: 'from-emerald-500/20 to-teal-600/10',
    border: 'border-emerald-500/30',
    count: '1,923 learners',
  },
  {
    name: 'Data Science & AI',
    icon: Lightbulb,
    description: 'ML, Deep Learning, NLP, Computer Vision',
    color: 'from-pink-500 to-rose-600',
    gradient: 'from-pink-500/20 to-rose-600/10',
    border: 'border-pink-500/30',
    count: '2,489 learners',
  },
];

// Feature cards
const features = [
  {
    icon: BookOpen,
    title: 'Structured Learning Paths',
    description: 'Curated roadmaps from beginner to job-ready with clear milestones and progressive challenges.',
  },
  {
    icon: Users,
    title: 'Mentor Support',
    description: 'Get guidance from industry professionals who reviewed your code and provide personalized feedback.',
  },
  {
    icon: Award,
    title: 'Real Projects',
    description: 'Build portfolio-worthy projects that solve real problems and impress hiring managers.',
  },
  {
    icon: MessageSquare,
    title: 'Peer Community',
    description: 'Collaborate with motivated learners, participate in code reviews, and grow together.',
  },
  {
    icon: Zap,
    title: 'Fast Feedback',
    description: 'Instant code evaluation, automated testing, and detailed performance analytics.',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Track your progress, earn certificates, and get interview-ready with our career toolkit.',
  },
];

// Testimonials
const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Frontend Developer at Stripe',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    text: "SkillUP's project-based approach helped me land my dream job in just 4 months. The mentorship is incredibly valuable.",
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Data Scientist at Spotify',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    text: "The structured learning paths made complex topics accessible. I went from zero to building ML models confidently.",
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Full Stack Engineer at Vercel',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    text: "What sets SkillUP apart is the real-world projects. I built a SaaS product during the course that I still maintain.",
    rating: 5,
  },
];

// Stats
const stats = [
  { label: 'Active Learners', value: '12,000+', icon: Users },
  { label: 'Courses Completed', value: '48,500+', icon: BookOpen },
  { label: 'Career Transitions', value: '3,200+', icon: TrendingUp },
  { label: 'Avg. Salary Increase', value: '45%', icon: Zap },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                SkillUP
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#curriculum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Curriculum
              </a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Log in
              </a>
              <a
                href="#signup"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all hover:scale-105"
              >
                Get Started
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-600/20 border border-violet-500/30 text-violet-400 text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              Now enrolling for Spring 2026
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Skill Up,
              </span>
              <br />
              <span className="text-foreground">
                Stand Out
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Transform your career with project-based learning, expert mentorship, and a community that pushes you to excel.
              Go from beginner to job-ready in record time.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="#signup"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-lg font-semibold hover:shadow-2xl hover:shadow-violet-500/40 transition-all hover:scale-105"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#demo"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm text-foreground text-lg font-medium hover:bg-card hover:border-foreground/20 transition-all"
              >
                Watch Demo
                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                  <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
                <span className="font-medium text-foreground">4.9/5</span>
                <span className="text-muted-foreground">from 2,847 reviews</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-background"
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">Join thousands of successful learners</span>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-muted-foreground/50 rounded-full"
              />
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl bg-gradient-to-r from-violet-500/5 to-purple-600/5 border border-violet-500/20 backdrop-blur-sm">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-6 h-6 mx-auto mb-3 text-violet-400" />
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold mb-4"
              >
                Everything you need to{' '}
                <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  succeed
                </span>
              </motion.h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                A complete learning ecosystem designed to take you from where you are to where you want to be.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-card/50 to-card/30 border border-border/50 hover:border-foreground/20 hover:shadow-xl hover:shadow-violet-500/10 transition-all hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.title === 'Structured Learning Paths' ? 'from-violet-500 to-purple-600' : feature.title === 'Mentor Support' ? 'from-blue-500 to-cyan-600' : feature.title === 'Real Projects' ? 'from-emerald-500 to-teal-600' : feature.title === 'Peer Community' ? 'from-pink-500 to-rose-600' : feature.title === 'Fast Feedback' ? 'from-amber-500 to-orange-600' : 'from-indigo-500 to-purple-600'} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Curriculum / Skill Categories Section */}
        <section id="curriculum" className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold mb-4"
              >
                Choose your{' '}
                <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  path
                </span>
              </motion.h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Dive deep into any discipline with comprehensive, hands-on curricula designed by industry experts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {skillCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative p-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/50 border border-border/50 hover:border-foreground/20 overflow-hidden transition-all hover:-translate-y-1"
                  >
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                      <p className="text-muted-foreground mb-4">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{category.count}</span>
                        <a
                          href={`#${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className={`inline-flex items-center gap-1 text-sm font-medium bg-gradient-to-r ${category.color} text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all`}
                        >
                          Explore Path
                          <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold mb-4"
              >
                What our{' '}
                <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  learners say
                </span>
              </motion.h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Real stories from people who transformed their careers with SkillUP.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-card/50 to-card/30 border border-border/50 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10 transition-all hover:-translate-y-1"
                >
                  {/* Rating stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="signup" className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-8 sm:p-12 rounded-3xl overflow-hidden"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to transform your career?
                </h2>
                <p className="text-violet-200 text-lg max-w-xl mx-auto mb-8">
                  Join thousands of learners who are already building their futures. Start your journey today — no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="#signup"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-violet-600 text-lg font-semibold hover:bg-violet-50 transition-all hover:scale-105 shadow-xl"
                  >
                    Start Learning Free
                    <ArrowRight size={18} />
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white text-lg font-medium hover:bg-white/10 transition-all"
                  >
                    Talk to Us
                  </a>
                </div>
                <p className="text-violet-300 text-sm mt-6">
                  Free 14-day trial · Cancel anytime · No commitment
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  SkillUP
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Empowering the next generation of tech professionals through project-based learning and expert mentorship.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#curriculum" className="text-muted-foreground hover:text-foreground transition-colors">Curriculum</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#enterprise" className="text-muted-foreground hover:text-foreground transition-colors">Enterprise</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                <li><a href="#careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              2026 SkillUP. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#twitter" className="text-muted-foreground hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="#github" className="text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#linkedin" className="text-muted-foreground hover:text-foreground transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
