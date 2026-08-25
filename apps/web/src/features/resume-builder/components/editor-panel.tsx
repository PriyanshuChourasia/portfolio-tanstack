import { Plus, Trash2 } from 'lucide-react'
import type { ChangeEvent } from 'react'
import type { ResumeData } from './resume-template'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface EditorPanelProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function EditorPanel({ data, onChange }: EditorPanelProps) {
  const updatePersonal = (field: string, value: string) => {
    onChange({ ...data, personal: { ...data.personal, [field]: value } })
  }

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      updatePersonal('photo', reader.result as string)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const removePhoto = () => {
    updatePersonal('photo', '')
  }

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...data.experience]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, experience: updated })
  }

  const addExperience = () => {
    onChange({
      ...data,
      experience: [
        ...data.experience,
        { period: '', title: '', company: '', desc: '' },
      ],
    })
  }

  const removeExperience = (index: number) => {
    onChange({
      ...data,
      experience: data.experience.filter((_, i) => i !== index),
    })
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...data.education]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, education: updated })
  }

  const addEducation = () => {
    onChange({
      ...data,
      education: [
        ...data.education,
        { period: '', title: '', company: '', desc: '' },
      ],
    })
  }

  const removeEducation = (index: number) => {
    onChange({
      ...data,
      education: data.education.filter((_, i) => i !== index),
    })
  }

  const updateSkill = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updated = [...data.skills]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, skills: updated })
  }

  const addSkill = () => {
    onChange({
      ...data,
      skills: [...data.skills, { name: '', value: 50 }],
    })
  }

  const removeSkill = (index: number) => {
    onChange({
      ...data,
      skills: data.skills.filter((_, i) => i !== index),
    })
  }

  const updateLanguage = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updated = [...data.languages]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, languages: updated })
  }

  const addLanguage = () => {
    onChange({
      ...data,
      languages: [...data.languages, { name: '', level: 5 }],
    })
  }

  const removeLanguage = (index: number) => {
    onChange({
      ...data,
      languages: data.languages.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-6 max-h-[70vh] md:max-h-none">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Personal Info</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-slate-400">Photo</Label>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                {data.personal.photo ? (
                  <img
                    src={data.personal.photo}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-slate-500 text-center px-1">
                    No photo
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="cursor-pointer text-xs px-3 py-1.5 rounded-md border border-primary-accent/50 text-primary-accent hover:bg-primary-accent/10 transition-colors text-center">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {data.personal.photo && (
                  <button
                    onClick={removePhoto}
                    className="text-xs px-3 py-1.5 rounded-md border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
          <div>
            <Label className="text-slate-400">Full Name</Label>
            <Input
              value={data.personal.name}
              onChange={(e) => updatePersonal('name', e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-400">Email</Label>
            <Input
              value={data.personal.email}
              onChange={(e) => updatePersonal('email', e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-400">Phone</Label>
            <Input
              value={data.personal.phone}
              onChange={(e) => updatePersonal('phone', e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-400">Location</Label>
            <Input
              value={data.personal.location}
              onChange={(e) => updatePersonal('location', e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-400">Title</Label>
            <Input
              value={data.personal.title}
              onChange={(e) => updatePersonal('title', e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-400">Summary</Label>
            <Textarea
              value={data.personal.summary}
              onChange={(e) => updatePersonal('summary', e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white min-h-[100px]"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-slate-700" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Experience</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addExperience}
            className="border-primary-accent/50 text-primary-accent hover:bg-primary-accent/10"
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        {data.experience.map((exp, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">#{i + 1}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeExperience(i)}
                className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <Label className="text-slate-400">Period</Label>
              <Input
                value={exp.period}
                onChange={(e) => updateExperience(i, 'period', e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400">Title</Label>
              <Input
                value={exp.title}
                onChange={(e) => updateExperience(i, 'title', e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400">Company</Label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(i, 'company', e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400">Description</Label>
              <Textarea
                value={exp.desc}
                onChange={(e) => updateExperience(i, 'desc', e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
          </div>
        ))}
      </div>

      <Separator className="bg-slate-700" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Education</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addEducation}
            className="border-primary-accent/50 text-primary-accent hover:bg-primary-accent/10"
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        {data.education.map((edu, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">#{i + 1}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeEducation(i)}
                className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <Label className="text-slate-400">Period</Label>
              <Input
                value={edu.period}
                onChange={(e) => updateEducation(i, 'period', e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400">Degree</Label>
              <Input
                value={edu.title}
                onChange={(e) => updateEducation(i, 'title', e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400">Institution</Label>
              <Input
                value={edu.company}
                onChange={(e) => updateEducation(i, 'company', e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400">Description</Label>
              <Textarea
                value={edu.desc}
                onChange={(e) => updateEducation(i, 'desc', e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
          </div>
        ))}
      </div>

      <Separator className="bg-slate-700" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Skills</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addSkill}
            className="border-primary-accent/50 text-primary-accent hover:bg-primary-accent/10"
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        {data.skills.map((skill, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={skill.name}
              onChange={(e) => updateSkill(i, 'name', e.target.value)}
              placeholder="Skill name"
              className="bg-slate-800/50 border-slate-700 text-white flex-1"
            />
            <Input
              type="number"
              min={0}
              max={100}
              value={skill.value}
              onChange={(e) =>
                updateSkill(i, 'value', parseInt(e.target.value) || 0)
              }
              className="bg-slate-800/50 border-slate-700 text-white w-20"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSkill(i)}
              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator className="bg-slate-700" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Languages</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addLanguage}
            className="border-primary-accent/50 text-primary-accent hover:bg-primary-accent/10"
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        {data.languages.map((lang, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={lang.name}
              onChange={(e) => updateLanguage(i, 'name', e.target.value)}
              placeholder="Language"
              className="bg-slate-800/50 border-slate-700 text-white flex-1"
            />
            <Input
              type="number"
              min={1}
              max={10}
              value={lang.level}
              onChange={(e) =>
                updateLanguage(i, 'level', parseInt(e.target.value) || 5)
              }
              className="bg-slate-800/50 border-slate-700 text-white w-20"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeLanguage(i)}
              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
