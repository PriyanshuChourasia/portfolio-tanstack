import type { ResumeData, ResumeLayout } from './resume-template'

interface ResumePreviewProps {
  data: ResumeData
  layout: ResumeLayout
}

function ClassicPreview({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-slate-900 p-8 shadow-lg rounded-sm min-h-[1056px]">
      <div className="border-b-2 border-cyan-600 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-900">{data.personal.name || 'Your Name'}</h1>
        <p className="text-lg text-cyan-700 font-medium mt-1">{data.personal.title || 'Professional Title'}</p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-2">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Summary</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{data.personal.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-slate-900">{exp.title || 'Position'}</h3>
                <span className="text-sm text-slate-500">{exp.period}</span>
              </div>
              <p className="text-sm text-cyan-700">{exp.company}</p>
              {exp.desc && <p className="text-sm text-slate-600 mt-1">{exp.desc}</p>}
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Education</h2>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-slate-900">{edu.title || 'Degree'}</h3>
                <span className="text-sm text-slate-500">{edu.period}</span>
              </div>
              <p className="text-sm text-cyan-700">{edu.company}</p>
              {edu.desc && <p className="text-sm text-slate-600 mt-1">{edu.desc}</p>}
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Skills</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {data.skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm text-slate-700 w-28">{skill.name}</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-600 rounded-full transition-all"
                    style={{ width: `${skill.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.languages.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Languages</h2>
          <div className="flex flex-wrap gap-4">
            {data.languages.map((lang, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm text-slate-700">{lang.name}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }, (_, j) => (
                    <div
                      key={j}
                      className={`w-2 h-2 rounded-full ${
                        j < lang.level ? 'bg-cyan-600' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ModernPreview({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-slate-900 p-0 shadow-lg rounded-sm min-h-[1056px] flex">
      <div className="w-[35%] bg-slate-900 text-white p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold">{data.personal.name || 'Your Name'}</h1>
          <p className="text-sm text-cyan-400 mt-1">{data.personal.title || 'Professional Title'}</p>
        </div>

        <div className="space-y-2 text-sm text-slate-300">
          {data.personal.email && <p>{data.personal.email}</p>}
          {data.personal.phone && <p>{data.personal.phone}</p>}
          {data.personal.location && <p>{data.personal.location}</p>}
        </div>

        {data.skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">Skills</h2>
            <div className="space-y-2">
              {data.skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>{skill.name}</span>
                    <span>{skill.value}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all"
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">Languages</h2>
            <div className="space-y-1">
              {data.languages.map((lang, i) => (
                <div key={i} className="flex justify-between text-xs text-slate-300">
                  <span>{lang.name}</span>
                  <span>{'●'.repeat(Math.ceil(lang.level / 2))}{'○'.repeat(5 - Math.ceil(lang.level / 2))}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-[65%] p-6 space-y-6">
        {data.personal.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">About</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{data.personal.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-4 pb-4 border-b border-slate-100 last:border-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-semibold text-slate-900">{exp.title || 'Position'}</h3>
                  <span className="text-xs text-slate-400">{exp.period}</span>
                </div>
                <p className="text-xs text-cyan-600 font-medium">{exp.company}</p>
                {exp.desc && <p className="text-xs text-slate-600 mt-1">{exp.desc}</p>}
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-3 pb-3 border-b border-slate-100 last:border-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-semibold text-slate-900">{edu.title || 'Degree'}</h3>
                  <span className="text-xs text-slate-400">{edu.period}</span>
                </div>
                <p className="text-xs text-cyan-600 font-medium">{edu.company}</p>
                {edu.desc && <p className="text-xs text-slate-600 mt-1">{edu.desc}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MinimalPreview({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-slate-900 p-10 shadow-lg rounded-sm min-h-[1056px]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-light text-slate-900">{data.personal.name || 'Your Name'}</h1>
        <p className="text-sm text-slate-400 mt-2 tracking-widest uppercase">
          {data.personal.title || 'Professional Title'}
        </p>
        <div className="flex justify-center gap-4 text-xs text-slate-400 mt-3">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div className="mb-8 text-center">
          <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">{data.personal.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 mb-6 text-center">
            Experience
          </h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-5 text-center">
              <span className="text-xs text-slate-400">{exp.period}</span>
              <h3 className="text-sm font-medium text-slate-900 mt-1">{exp.title || 'Position'}</h3>
              <p className="text-xs text-slate-500">{exp.company}</p>
              {exp.desc && <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">{exp.desc}</p>}
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 mb-6 text-center">
            Education
          </h2>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-4 text-center">
              <span className="text-xs text-slate-400">{edu.period}</span>
              <h3 className="text-sm font-medium text-slate-900 mt-1">{edu.title || 'Degree'}</h3>
              <p className="text-xs text-slate-500">{edu.company}</p>
              {edu.desc && <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">{edu.desc}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-8">
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 mb-4 text-center">
              Skills
            </h2>
            <div className="flex flex-wrap justify-center gap-2 max-w-xs">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.languages.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 mb-4 text-center">
              Languages
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {data.languages.map((lang, i) => (
                <span key={i} className="text-xs text-slate-600">
                  {lang.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfessionalPreview({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-slate-900 p-0 shadow-lg rounded-sm min-h-[1056px]">
      <div className="bg-cyan-700 text-white px-8 py-6">
        <h1 className="text-2xl font-bold">{data.personal.name || 'Your Name'}</h1>
        <p className="text-sm text-cyan-100 mt-1">{data.personal.title || 'Professional Title'}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-cyan-100 mt-3">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {data.personal.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-700 mb-2">Professional Summary</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{data.personal.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-700 mb-3">Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{exp.title || 'Position'}</h3>
                    <p className="text-xs text-cyan-600">{exp.company}</p>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {exp.period}
                  </span>
                </div>
                {exp.desc && <p className="text-xs text-slate-600 mt-2">{exp.desc}</p>}
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-700 mb-3">Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{edu.title || 'Degree'}</h3>
                    <p className="text-xs text-cyan-600">{edu.company}</p>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {edu.period}
                  </span>
                </div>
                {edu.desc && <p className="text-xs text-slate-600 mt-1">{edu.desc}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-700 mb-3">Skills</h2>
              <div className="space-y-2">
                {data.skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs text-slate-600 mb-0.5">
                      <span>{skill.name}</span>
                      <span>{skill.value}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-600 rounded-full transition-all"
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-700 mb-3">Languages</h2>
              <div className="space-y-1">
                {data.languages.map((lang, i) => (
                  <div key={i} className="flex justify-between text-xs text-slate-600">
                    <span>{lang.name}</span>
                    <span className="text-cyan-600">
                      {Array.from({ length: 5 }, (_, j) => (
                        <span key={j}>{j < Math.ceil(lang.level / 2) ? '●' : '○'}</span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CreativePreview({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-slate-900 p-0 shadow-lg rounded-sm min-h-[1056px]">
      <div className="bg-linear-to-r from-cyan-500 to-blue-600 text-white px-8 py-10">
        <h1 className="text-3xl font-black tracking-tight">{data.personal.name || 'Your Name'}</h1>
        <p className="text-sm text-white/80 mt-2 font-medium">{data.personal.title || 'Professional Title'}</p>
        <div className="flex flex-wrap gap-4 text-xs text-white/70 mt-4">
          {data.personal.email && (
            <span className="bg-white/10 px-3 py-1 rounded-full">{data.personal.email}</span>
          )}
          {data.personal.phone && (
            <span className="bg-white/10 px-3 py-1 rounded-full">{data.personal.phone}</span>
          )}
          {data.personal.location && (
            <span className="bg-white/10 px-3 py-1 rounded-full">{data.personal.location}</span>
          )}
        </div>
      </div>

      <div className="p-8 grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {data.personal.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-2">About</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{data.personal.summary}</p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-3">Experience</h2>
              {data.experience.map((exp, i) => (
                <div key={i} className="mb-4 pl-4 border-l-2 border-cyan-200">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-slate-900">{exp.title || 'Position'}</h3>
                    <span className="text-xs text-slate-400">{exp.period}</span>
                  </div>
                  <p className="text-xs text-cyan-600 font-medium">{exp.company}</p>
                  {exp.desc && <p className="text-xs text-slate-600 mt-1">{exp.desc}</p>}
                </div>
              ))}
            </div>
          )}

          {data.education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-3">Education</h2>
              {data.education.map((edu, i) => (
                <div key={i} className="mb-3 pl-4 border-l-2 border-cyan-200">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-slate-900">{edu.title || 'Degree'}</h3>
                    <span className="text-xs text-slate-400">{edu.period}</span>
                  </div>
                  <p className="text-xs text-cyan-600 font-medium">{edu.company}</p>
                  {edu.desc && <p className="text-xs text-slate-600 mt-1">{edu.desc}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-3">Skills</h2>
              <div className="space-y-2">
                {data.skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs text-slate-600 mb-0.5">
                      <span>{skill.name}</span>
                      <span>{skill.value}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all"
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-3">Languages</h2>
              <div className="space-y-1">
                {data.languages.map((lang, i) => (
                  <div key={i} className="text-xs text-slate-600">
                    <span>{lang.name}</span>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }, (_, j) => (
                        <div
                          key={j}
                          className={`w-2 h-2 rounded-full ${
                            j < Math.ceil(lang.level / 2) ? 'bg-cyan-500' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const previewComponents: Record<ResumeLayout, React.ComponentType<{ data: ResumeData }>> = {
  classic: ClassicPreview,
  modern: ModernPreview,
  minimal: MinimalPreview,
  professional: ProfessionalPreview,
  creative: CreativePreview,
}

export function ResumePreview({ data, layout }: ResumePreviewProps) {
  const PreviewComponent = previewComponents[layout]

  return (
    <div className="flex items-start justify-center p-8 min-h-full">
      <div className="w-[210mm] shadow-2xl transform scale-[0.8] origin-top">
        <PreviewComponent data={data} />
      </div>
    </div>
  )
}
