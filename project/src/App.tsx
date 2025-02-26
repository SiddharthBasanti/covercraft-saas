import React, { useState, useCallback, useEffect } from 'react';
import { Briefcase, Code2, Download, Palette, Plus, Trash2, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Link, User, Building2, Pencil, History, RotateCcw, Eye } from 'lucide-react';
import { templates } from './templates';
import { UserDetails, TemplateStyle, LetterVersion } from './types';

const icons = {
  Briefcase,
  Code2,
  Palette
};

function App() {
  const [details, setDetails] = useState<UserDetails>({
    fullName: '',
    email: '',
    phone: '',
    jobTitle: '',
    companyName: '',
    skills: [''],
    achievements: [''],
    experience: '',
    education: '',
    linkedIn: '',
    portfolio: '',
    customSignature: '',
    salutation: '',
    recipientName: '',
    recipientTitle: '',
    companyAddress: ''
  });
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('formal');
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState({
    recipient: false,
    professional: false,
    advanced: false
  });
  const [letterVersions, setLetterVersions] = useState<LetterVersion[]>([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateStyle | null>(null);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (generatedLetter) {
      setCharCount(generatedLetter.length);
    }
  }, [generatedLetter]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!details.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!details.email.trim()) newErrors.email = 'Email is required';
    if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!details.phone.trim()) newErrors.phone = 'Phone is required';
    if (!details.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!details.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!details.skills[0].trim()) newErrors.skills = 'At least one skill is required';
    if (details.linkedIn && !details.linkedIn.includes('linkedin.com')) {
      newErrors.linkedIn = 'Please enter a valid LinkedIn URL';
    }
    if (details.portfolio && !details.portfolio.startsWith('http')) {
      newErrors.portfolio = 'Please enter a valid portfolio URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...details.skills];
    newSkills[index] = value;
    setDetails({ ...details, skills: newSkills });
    if (errors.skills) setErrors({ ...errors, skills: '' });
  };

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...(details.achievements || [])];
    newAchievements[index] = value;
    setDetails({ ...details, achievements: newAchievements });
  };

  const addSkill = () => {
    setDetails({ ...details, skills: [...details.skills, ''] });
  };

  const addAchievement = () => {
    setDetails({ 
      ...details, 
      achievements: [...(details.achievements || []), ''] 
    });
  };

  const removeSkill = (index: number) => {
    const newSkills = details.skills.filter((_, i) => i !== index);
    setDetails({ ...details, skills: newSkills.length ? newSkills : [''] });
  };

  const removeAchievement = (index: number) => {
    const newAchievements = details.achievements?.filter((_, i) => i !== index);
    setDetails({ ...details, achievements: newAchievements?.length ? newAchievements : [''] });
  };

  const generateLetter = useCallback(() => {
    if (!validateForm()) {
      return;
    }
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      const newLetter = template.generate(details);
      setGeneratedLetter(newLetter);
      setShowPreview(false);
      
      // Add to version history
      const newVersion: LetterVersion = {
        timestamp: Date.now(),
        letter: newLetter,
        template: selectedTemplate,
        details: { ...details }
      };
      
      setLetterVersions(prev => [...prev, newVersion]);
      setCurrentVersionIndex(prev => prev + 1);
    }
  }, [details, selectedTemplate]);

  const restoreVersion = (index: number) => {
    const version = letterVersions[index];
    setDetails(version.details);
    setSelectedTemplate(version.template);
    setGeneratedLetter(version.letter);
    setCurrentVersionIndex(index);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const previewTemplateStyle = (templateId: TemplateStyle) => {
    setPreviewTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setGeneratedLetter(template.generate(details));
    }
  };

  const confirmTemplateStyle = () => {
    if (previewTemplate) {
      setSelectedTemplate(previewTemplate);
      setPreviewTemplate(null);
      generateLetter();
    }
  };

  const renderInput = (
    name: keyof UserDetails,
    placeholder: string,
    type: string = 'text',
    textarea: boolean = false,
    icon?: React.ReactNode
  ) => {
    const Component = textarea ? 'textarea' : 'input';
    return (
      <div>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <Component
            type={type}
            placeholder={placeholder}
            className={`w-full p-2 ${icon ? 'pl-10' : ''} border rounded ${
              errors[name] ? 'border-red-500' : 'border-gray-300'
            } ${textarea ? 'h-24' : ''}`}
            value={details[name] as string}
            onChange={(e) => {
              setDetails({ ...details, [name]: e.target.value });
              if (errors[name]) {
                setErrors({ ...errors, [name]: '' });
              }
            }}
          />
        </div>
        {errors[name] && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  const renderExpandableSection = (
    title: string,
    section: keyof typeof expandedSections,
    children: React.ReactNode
  ) => (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        {expandedSections[section] ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="mt-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">CoverCraft</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowVersionHistory(!showVersionHistory)}
              className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
            >
              <History className="h-5 w-5" />
              <span>History</span>
            </button>
            <p className="text-sm text-gray-500">Craft the perfect cover letter in minutes</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Template Style</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => {
                  const Icon = icons[template.icon as keyof typeof icons];
                  return (
                    <div
                      key={template.id}
                      className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedTemplate === template.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="h-5 w-5 text-indigo-600" />
                        <button
                          onClick={() => previewTemplateStyle(template.id)}
                          className="text-gray-400 hover:text-indigo-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
              <div className="space-y-4">
                {renderInput('fullName', 'Full Name', 'text', false, <User className="h-5 w-5 text-gray-400" />)}
                {renderInput('email', 'Email', 'email')}
                {renderInput('phone', 'Phone', 'tel')}
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Job Details</h2>
              <div className="space-y-4">
                {renderInput('jobTitle', 'Job Title', 'text', false, <Briefcase className="h-5 w-5 text-gray-400" />)}
                {renderInput('companyName', 'Company Name', 'text', false, <Building2 className="h-5 w-5 text-gray-400" />)}
              </div>
            </div>

            {renderExpandableSection('Recipient Details', 'recipient', (
              <>
                {renderInput('recipientName', 'Recipient Name (e.g., John Smith)', 'text', false, <User className="h-5 w-5 text-gray-400" />)}
                {renderInput('recipientTitle', 'Recipient Title (e.g., HR Manager)')}
                {renderInput('companyAddress', 'Company Address', 'text', true)}
                {renderInput('salutation', 'Custom Salutation (e.g., Dear, Hello)', 'text', false, <Pencil className="h-5 w-5 text-gray-400" />)}
              </>
            ))}

            {renderExpandableSection('Professional Links', 'professional', (
              <>
                {renderInput('linkedIn', 'LinkedIn Profile URL', 'url', false, <Link className="h-5 w-5 text-gray-400" />)}
                {renderInput('portfolio', 'Portfolio Website', 'url', false, <Link className="h-5 w-5 text-gray-400" />)}
              </>
            ))}

            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Professional Background</h2>
              <div className="space-y-4">
                {renderInput('experience', 'Relevant Experience (optional)', 'text', true)}
                {renderInput('education', 'Education Background (optional)')}
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Key Skills</h2>
              <div className="space-y-2">
                {details.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter a skill"
                      className={`flex-1 p-2 border rounded ${
                        errors.skills ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                    />
                    <button
                      onClick={() => removeSkill(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                {errors.skills && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.skills}
                  </p>
                )}
                <button
                  onClick={addSkill}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <Plus className="h-4 w-4" />
                  Add Skill
                </button>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Key Achievements (Optional)</h2>
              <div className="space-y-2">
                {details.achievements?.map((achievement, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter an achievement"
                      className="flex-1 p-2 border rounded border-gray-300"
                      value={achievement}
                      onChange={(e) => handleAchievementChange(index, e.target.value)}
                    />
                    <button
                      onClick={() => removeAchievement(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addAchievement}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <Plus className="h-4 w-4" />
                  Add Achievement
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={generateLetter}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Generate Cover Letter
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {showVersionHistory && (
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Version History</h2>
                <div className="space-y-4">
                  {letterVersions.map((version, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded ${
                        index === currentVersionIndex ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Version {index + 1}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(version.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => restoreVersion(index)}
                          className="text-indigo-600 hover:text-indigo-700"
                        >
                          <RotateCcw className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previewTemplate && (
              <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Template Preview</h2>
                  <div className="space-x-2">
                    <button
                      onClick={() => setPreviewTemplate(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmTemplateStyle}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Use This Template
                    </button>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm">{generatedLetter}</pre>
                </div>
              </div>
            )}

            {generatedLetter && !previewTemplate && (
              <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Your Cover Letter</h2>
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-500">
                      {charCount} characters
                    </p>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                    >
                      {copied ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Download className="h-5 w-5" />
                      )}
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm">{generatedLetter}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;