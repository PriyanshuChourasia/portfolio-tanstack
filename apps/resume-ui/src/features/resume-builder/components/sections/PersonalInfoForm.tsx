import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { PersonalInfo } from '../../types'

interface PersonalInfoFormProps {
  value: PersonalInfo
  onChange: (patch: Partial<PersonalInfo>) => void
}

interface FieldGroup {
  label: string
  fields: Array<{
    key: keyof PersonalInfo
    label: string
    placeholder: string
    icon?: string
    optional?: boolean
  }>
}

const fieldGroups: FieldGroup[] = [
  {
    label: 'Identity',
    fields: [
      {
        key: 'fullName',
        label: 'Full Name',
        placeholder: 'Jane Doe',
        icon: 'user',
      },
      {
        key: 'title',
        label: 'Job Title',
        placeholder: 'Senior Frontend Engineer',
        icon: 'briefcase',
      },
    ],
  },
  {
    label: 'Contact',
    fields: [
      {
        key: 'email',
        label: 'Email',
        placeholder: 'jane@example.com',
        icon: 'mail',
      },
      {
        key: 'phone',
        label: 'Phone',
        placeholder: '+1 555 123 4567',
        icon: 'phone',
      },
      {
        key: 'location',
        label: 'Location',
        placeholder: 'Warsaw, Poland',
        icon: 'mapPin',
      },
    ],
  },
  {
    label: 'Online',
    fields: [
      {
        key: 'linkedin',
        label: 'LinkedIn',
        placeholder: 'linkedin.com/in/janedoe',
        icon: 'link',
      },
      {
        key: 'website',
        label: 'Website / Portfolio',
        placeholder: 'janedoe.dev',
        icon: 'globe',
      },
    ],
  },
  {
    label: 'Media',
    fields: [
      {
        key: 'photoUrl',
        label: 'Photo URL',
        placeholder: 'https://example.com/photo.jpg',
        icon: 'image',
        optional: true,
      },
    ],
  },
]

const fieldIcons: Record<string, string> = {
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  briefcase: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M2 7h20 M6 21h12',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2 M22 6l-10 7L2 6',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92',
  mapPin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0 M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  image: 'M15 8h.01 M3 18l3-3 4 4 3-3 5 5M21 3H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z',
}

function FieldIcon({ name }: { name: string }) {
  const path = fieldIcons[name]
  if (!path) return null
  return (
    <svg
      className="size-3.5 shrink-0 text-muted-foreground"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path.split('M').filter(Boolean).map((p, i) => (
        <path key={i} d={`M${p}`} />
      ))}
    </svg>
  )
}

export function PersonalInfoForm({ value, onChange }: PersonalInfoFormProps) {
  return (
    <div className="space-y-4">
      {fieldGroups.map((group) => (
        <div key={group.label}>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              {group.label}
            </span>
            <div className="bg-muted-foreground/15 h-px flex-1" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {group.fields.map((field) => (
              <div
                key={field.key}
                className={field.key === 'photoUrl' ? 'sm:col-span-2' : ''}
              >
                <Label
                  htmlFor={`personal-${field.key}`}
                  className="flex items-center gap-1.5 text-xs font-medium"
                >
                  <FieldIcon name={field.icon ?? ''} />
                  {field.label}
                  {field.optional && (
                    <span className="text-[10px] font-normal text-muted-foreground/50">
                      (optional)
                    </span>
                  )}
                </Label>
                <div className="relative mt-1">
                  <Input
                    id={`personal-${field.key}`}
                    value={value[field.key]}
                    placeholder={field.placeholder}
                    onChange={(e) => onChange({ [field.key]: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
