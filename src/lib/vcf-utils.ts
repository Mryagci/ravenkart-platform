interface ContactData {
  name: string
  company?: string
  title?: string
  phone?: string
  email?: string
  website?: string
  location?: string
}

export function generateVCF(data: ContactData): string {
  const vcfContent = `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
${data.company ? `ORG:${data.company}` : ''}
${data.title ? `TITLE:${data.title}` : ''}
${data.phone ? `TEL:${data.phone}` : ''}
${data.email ? `EMAIL:${data.email}` : ''}
${data.website ? `URL:${data.website}` : ''}
${data.location ? `ADR:;;;${data.location};;;` : ''}
NOTE:RAVENKART ile oluşturuldu - https://ravenkart.com
END:VCARD`

  return vcfContent.replace(/\n{2,}/g, '\n')
}

export function downloadVCF(data: ContactData): void {
  const vcfContent = generateVCF(data)
  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.name.replace(/[^a-zA-Z0-9]/g, '_')}.vcf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}