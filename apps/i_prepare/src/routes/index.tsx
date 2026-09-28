import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => {
    return (
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto">
            <span className="text-4xl font-bold text-white">IP</span>
          </div>
          <h1 className="text-5xl font-bold">iPrepare</h1>
          <p className="text-xl text-muted-foreground">
            Senior Software Engineer Interview Platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Start Interview', desc: 'Take a mixed senior interview covering Java, Go, OOP, DSA, System Design and more', to: '/interview' },
            { title: 'iPrepare App', desc: 'The exam mock test preparation module', to: '/i-prepare' },
          ].map((item) => (
            <a
              key={item.title}
              href={item.to}
              className="block p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group"
            >
              <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </a>
          ))}
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="text-2xl font-bold mb-4">Interview Categories</h2>
          <div className="flex flex-wrap gap-2">
            {['Java Fundamentals', 'OOP / LLD', 'Java 21/25/26', 'Collections', 'JVM / Memory', 'Concurrency', 'DSA / Algorithms', 'Coding', 'SQL / Database', 'Kafka', 'Go', 'System Design', 'Debugging', 'Security', 'Design Patterns', 'Cross-Technology'].map((cat) => (
              <span key={cat} className="text-sm bg-muted px-3 py-1 rounded-full">{cat}</span>
            ))}
          </div>
        </div>
      </div>
    )
  },
})
