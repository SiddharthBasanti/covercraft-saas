import { Template, UserDetails } from './types';

const formatDate = () => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatHeader = (details: UserDetails) => {
  const header = [details.fullName];
  if (details.email) header.push(details.email);
  if (details.phone) header.push(details.phone);
  if (details.linkedIn) header.push(`LinkedIn: ${details.linkedIn}`);
  if (details.portfolio) header.push(`Portfolio: ${details.portfolio}`);
  return header.join(' | ');
};

const formatRecipient = (details: UserDetails) => {
  if (!details.recipientName && !details.recipientTitle && !details.companyAddress) {
    return '';
  }

  let recipient = '';
  if (details.recipientName || details.recipientTitle) {
    recipient += `${details.recipientName || ''}${details.recipientTitle ? `\n${details.recipientTitle}` : ''}\n`;
  }
  if (details.companyAddress) {
    recipient += `${details.companyName}\n${details.companyAddress}\n`;
  }
  return recipient ? `\n${recipient}\n` : '';
};

export const templates: Template[] = [
  {
    id: 'formal',
    name: 'Formal & Professional',
    description: 'Perfect for corporate roles and traditional industries',
    icon: 'Briefcase',
    preview: `[Your Name] | [Email] | [Phone] | [LinkedIn]

[Recipient Name]
[Job Title]
[Company]
[Address]

Dear [Recipient Name],

I am writing to express my strong interest in the [Position] at [Company]...

Throughout my career, I have developed expertise in [Skills], which aligns perfectly with the requirements of this role...

Best regards,
[Your Name]`,
    generate: (details: UserDetails) => `${formatHeader(details)}

${formatDate()}${formatRecipient(details)}

${details.salutation || 'Dear'} ${details.recipientName || 'Hiring Manager'},

I am writing to express my strong interest in the ${details.jobTitle} position at ${details.companyName}. With my background in ${details.skills.join(', ')}, I am confident in my ability to contribute meaningfully to your team.

${details.experience ? `\n${details.experience}\n` : ''}

Throughout my career, I have developed expertise in ${details.skills.slice(0, 2).join(' and ')}, which aligns perfectly with the requirements of this role. I am particularly drawn to ${details.companyName}'s reputation for excellence and innovation in the industry.

${details.achievements?.length ? `\nKey achievements include:\n${details.achievements.map(a => `• ${a}`).join('\n')}\n` : ''}

${details.education ? `\n${details.education}\n` : ''}

I would welcome the opportunity to discuss how my skills and experience could benefit ${details.companyName}. Thank you for considering my application.

${details.customSignature || 'Best regards'},
${details.fullName}`
  },
  {
    id: 'casual',
    name: 'Casual & Creative',
    description: 'Great for startups and creative industries',
    icon: 'Palette',
    preview: `[Your Name] | [Contact Details] | [Portfolio]

Hi [Name]!

I'm [Your Name], and I'm excited about the [Position] role at [Company]!

What draws me to [Company] is your innovative approach...

Looking forward to connecting!`,
    generate: (details: UserDetails) => `${formatHeader(details)}

${formatDate()}${formatRecipient(details)}

${details.salutation || 'Hi'} ${details.recipientName ? details.recipientName.split(' ')[0] : 'there'}!

I'm ${details.fullName}, and I'm excited about the ${details.jobTitle} role at ${details.companyName}! 

What draws me to ${details.companyName} is your innovative approach to solving real problems. My experience with ${details.skills.join(', ')} has prepared me to jump right in and make an impact.

${details.experience ? `\n${details.experience}\n` : ''}

${details.achievements?.length ? `\nSome highlights of what I've accomplished:\n${details.achievements.map(a => `• ${a}`).join('\n')}\n` : ''}

${details.education ? `\nMy educational background in ${details.education} has given me a solid foundation in this field.\n` : ''}

${details.portfolio ? `\nYou can check out more of my work at my portfolio: ${details.portfolio}\n` : ''}

I'd love to chat about how my background in ${details.skills[0]} could help drive ${details.companyName}'s mission forward.

${details.customSignature || 'Looking forward to connecting!'}

Cheers,
${details.fullName}`
  },
  {
    id: 'technical',
    name: 'Technical & Data-Driven',
    description: 'Ideal for engineering and analytical roles',
    icon: 'Code2',
    preview: `[Professional Header with Contact Details]

Technical Profile:
- Core Competencies: [Skills]
- Position of Interest: [Position]
- Target Organization: [Company]

I am a results-driven professional...`,
    generate: (details: UserDetails) => `${formatHeader(details)}

${formatDate()}${formatRecipient(details)}

${details.salutation || 'Dear'} ${details.recipientName || 'Hiring Team'},

RE: Application for ${details.jobTitle} Position

Technical Profile:
- Core Competencies: ${details.skills.join(', ')}
- Position of Interest: ${details.jobTitle}
- Target Organization: ${details.companyName}
${details.education ? `- Education: ${details.education}` : ''}
${details.portfolio ? `- Portfolio: ${details.portfolio}` : ''}
${details.linkedIn ? `- LinkedIn: ${details.linkedIn}` : ''}

I am a results-driven professional with demonstrated expertise in ${details.skills.join(', ')}. My technical background and problem-solving approach align with ${details.companyName}'s technical requirements.

${details.experience ? `\n${details.experience}\n` : ''}

Key Technical Achievements:
${details.achievements?.length 
  ? details.achievements.map(a => `• ${a}`).join('\n')
  : `• Demonstrated proficiency in ${details.skills[0]} and ${details.skills[1]}\n• Successfully implemented solutions using ${details.skills.slice(2).join(', ')}`}

I welcome the opportunity to discuss how my technical proficiency can contribute to ${details.companyName}'s objectives.

${details.customSignature || 'Technical regards'},
${details.fullName}`
  }
];