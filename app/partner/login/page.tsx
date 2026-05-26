'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type AuthMode = 'signin' | 'signup';

const API = process.env.NEXT_PUBLIC_API_URL;

interface MentorSignupData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  expertise: string;
  yearsOfExperience: string;
  currentRole: string;
  company: string;
  bio: string;
  linkedinProfile: string;
  aadhaarNumber: string;
  panNumber: string;
  aadhaarFile: File | null;
  panFile: File | null;
  agreeToTerms: boolean;
}

const steps = [
  { id: 0, title: 'Personal Details', desc: 'Identity & Contact' },
  { id: 1, title: 'Professional Background', desc: 'Expertise & Experience' },
  { id: 2, title: 'Verification', desc: 'Government IDs' },
  { id: 3, title: 'Review & Submit', desc: 'Final Confirmation' },
];

export default function MentorAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signin');

  // Signin States
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [signinLoading, setSigninLoading] = useState(false);
  const [signinError, setSigninError] = useState('');

  // Signup States
  const [currentStep, setCurrentStep] = useState(0);
  const [signupData, setSignupData] = useState<MentorSignupData>({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    expertise: '', yearsOfExperience: '', currentRole: '', company: '',
    bio: '', linkedinProfile: '', aadhaarNumber: '', panNumber: '',
    aadhaarFile: null, panFile: null, agreeToTerms: false,
  });
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'signup') {
      setCurrentStep(0);
      setSignupError('');
      setStepErrors({});
    }
  }, [mode]);

  // Handle signin form submission
  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigninLoading(true);
    setSigninError('');

    try {
      const response = await fetch(`${API}/partner/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signinEmail, password: signinPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // Store auth token (assuming response contains token)
      if (data.token) {
        localStorage.setItem('mentorToken', data.token);
        localStorage.setItem('mentorEmail', signinEmail);
      }

      // Redirect to partner dashboard
      router.push('/partner/dashboard');
    } catch (err: any) {
      setSigninError(err.message || 'An error occurred during login.');
    } finally {
      setSigninLoading(false);
    }
  };

  // Update signup form fields
  const updateSignupField = (field: keyof MentorSignupData, value: any) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field if exists
    if (stepErrors[field]) {
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate current step before proceeding
  const validateStep = (step: number): boolean => {
    const errors: { [key: string]: string } = {};

    if (step === 0) {
      if (!signupData.fullName.trim()) errors.fullName = 'Full name is required';
      if (!signupData.email.trim()) errors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(signupData.email)) errors.email = 'Email is invalid';
      if (!signupData.phone.trim()) errors.phone = 'Phone number is required';
      else if (!/^[0-9]{10}$/.test(signupData.phone.replace(/\D/g, '')))
        errors.phone = 'Phone number must be 10 digits';
      if (!signupData.password) errors.password = 'Password is required';
      else if (signupData.password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (signupData.password !== signupData.confirmPassword)
        errors.confirmPassword = 'Passwords do not match';
    }

    if (step === 1) {
      if (!signupData.expertise) errors.expertise = 'Primary expertise is required';
      if (!signupData.yearsOfExperience) errors.yearsOfExperience = 'Years of experience is required';
      if (!signupData.currentRole.trim()) errors.currentRole = 'Current role is required';
      if (!signupData.company.trim()) errors.company = 'Company/Organization is required';
      if (signupData.bio.length > 500) errors.bio = 'Bio must be less than 500 characters';
    }

    if (step === 2) {
      if (signupData.aadhaarNumber && !/^[0-9]{12}$/.test(signupData.aadhaarNumber.replace(/\s/g, '')))
        errors.aadhaarNumber = 'Aadhaar must be 12 digits';
      if (signupData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(signupData.panNumber.toUpperCase()))
        errors.panNumber = 'PAN must be in format ABCDE1234F';
    }

    if (step === 3) {
      if (!signupData.agreeToTerms) errors.agreeToTerms = 'You must agree to the Terms of Service';
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Handle final registration submission
  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setSignupLoading(true);
    setSignupError('');

    try {
      // Prepare data for API (without files for JSON submission)
      const submissionData = {
        fullName: signupData.fullName,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password,
        expertise: signupData.expertise,
        yearsOfExperience: signupData.yearsOfExperience,
        currentRole: signupData.currentRole,
        company: signupData.company,
        bio: signupData.bio,
        linkedinProfile: signupData.linkedinProfile,
        aadhaarNumber: signupData.aadhaarNumber,
        panNumber: signupData.panNumber,
        agreeToTerms: signupData.agreeToTerms,
      };

      // If files exist, we would use FormData for multipart upload
      // For demo, we're sending JSON; in production, implement file upload
      const response = await fetch(`${API}/partner/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      // Store token if returned, then redirect to dashboard
      if (data.token) {
        localStorage.setItem('mentorToken', data.token);
        localStorage.setItem('mentorEmail', signupData.email);
      }

      router.push('/partner/dashboard');
    } catch (err: any) {
      setSignupError(err.message || 'An error occurred during registration.');
    } finally {
      setSignupLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (field: 'aadhaarFile' | 'panFile', file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      setStepErrors((prev) => ({ ...prev, [field]: 'File size must be less than 5MB' }));
      return;
    }
    updateSignupField(field, file);
  };

  // Render stepper progress indicator
const renderStepper = () => (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center flex-1 relative">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border-2 transition-all duration-300
              ${idx <= currentStep 
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800'}`}>
              {idx < currentStep ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-lg font-semibold">{idx + 1}</span>
              )}
            </div>

            {idx < steps.length - 1 && (
              <div className={`absolute top-5 left-[50%] w-full h-[3px] -translate-y-1/2 transition-all
                ${idx < currentStep ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}

            <div className="mt-4 text-center hidden md:block">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{step.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render step 0: Personal Details
  const renderPersonalStep = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={signupData.fullName}
          onChange={(e) => updateSignupField('fullName', e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Dr. Sarah Johnson"
        />
        {stepErrors.fullName && <p className="mt-1 text-xs text-red-500">{stepErrors.fullName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={signupData.email}
          onChange={(e) => updateSignupField('email', e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="sarah@example.com"
        />
        {stepErrors.email && <p className="mt-1 text-xs text-red-500">{stepErrors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={signupData.phone}
          onChange={(e) => updateSignupField('phone', e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="9876543210"
        />
        {stepErrors.phone && <p className="mt-1 text-xs text-red-500">{stepErrors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={signupData.password}
          onChange={(e) => updateSignupField('password', e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="••••••••"
        />
        {stepErrors.password && <p className="mt-1 text-xs text-red-500">{stepErrors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={signupData.confirmPassword}
          onChange={(e) => updateSignupField('confirmPassword', e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="••••••••"
        />
        {stepErrors.confirmPassword && <p className="mt-1 text-xs text-red-500">{stepErrors.confirmPassword}</p>}
      </div>
    </div>
  );

  // Render step 1: Professional Details
  const renderProfessionalStep = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Primary Expertise <span className="text-red-500">*</span>
        </label>
        <select
          value={signupData.expertise}
          onChange={(e) => updateSignupField('expertise', e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select your primary expertise</option>
          <option value="frontend">Frontend Development (React/Vue/Angular)</option>
          <option value="backend">Backend Development (Node.js/Python/Java)</option>
          <option value="fullstack">Full Stack Development</option>
          <option value="system-design">System Design & Architecture</option>
          <option value="cloud">Cloud Computing (AWS/Azure/GCP)</option>
          <option value="devops">DevOps & CI/CD</option>
          <option value="datascience">Data Science & AI/ML</option>
          <option value="mobile">Mobile Development (iOS/Android/Flutter)</option>
        </select>
        {stepErrors.expertise && <p className="mt-1 text-xs text-red-500">{stepErrors.expertise}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Years of Experience <span className="text-red-500">*</span>
        </label>
        <select
          value={signupData.yearsOfExperience}
          onChange={(e) => updateSignupField('yearsOfExperience', e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select experience</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((year) => (
            <option key={year} value={year}>
              {year} {year === 1 ? 'year' : 'years'}
            </option>
          ))}
          <option value="15+">15+ years</option>
        </select>
        {stepErrors.yearsOfExperience && <p className="mt-1 text-xs text-red-500">{stepErrors.yearsOfExperience}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Current Role / Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={signupData.currentRole}
          onChange={(e) => updateSignupField('currentRole', e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Senior Software Architect"
        />
        {stepErrors.currentRole && <p className="mt-1 text-xs text-red-500">{stepErrors.currentRole}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Company / Organization <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={signupData.company}
          onChange={(e) => updateSignupField('company', e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Google / Microsoft / Startup"
        />
        {stepErrors.company && <p className="mt-1 text-xs text-red-500">{stepErrors.company}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Professional Bio
        </label>
        <textarea
          rows={3}
          value={signupData.bio}
          onChange={(e) => updateSignupField('bio', e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Tell us about your teaching experience, industry achievements, and why you're passionate about mentoring..."
        />
        <p className="mt-1 text-xs text-gray-500">{signupData.bio.length}/500 characters</p>
        {stepErrors.bio && <p className="mt-1 text-xs text-red-500">{stepErrors.bio}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          LinkedIn Profile
        </label>
        <input
          type="url"
          value={signupData.linkedinProfile}
          onChange={(e) => updateSignupField('linkedinProfile', e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="https://linkedin.com/in/username"
        />
      </div>
    </div>
  );

  // Render step 2: Government IDs
  const renderGovernmentStep = () => (
    <div className="space-y-5">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <span className="font-semibold">Verification Required:</span> Your government IDs will be used for
          identity verification and compliance. We use bank-level encryption to protect your data.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Aadhaar Number
        </label>
        <input
          type="text"
          value={signupData.aadhaarNumber}
          onChange={(e) => updateSignupField('aadhaarNumber', e.target.value.replace(/\D/g, ''))}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="1234 5678 9012"
          maxLength={12}
        />
        {stepErrors.aadhaarNumber && <p className="mt-1 text-xs text-red-500">{stepErrors.aadhaarNumber}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          PAN Card Number
        </label>
        <input
          type="text"
          value={signupData.panNumber}
          onChange={(e) => updateSignupField('panNumber', e.target.value.toUpperCase())}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="ABCDE1234F"
          maxLength={10}
        />
        {stepErrors.panNumber && <p className="mt-1 text-xs text-red-500">{stepErrors.panNumber}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Upload Aadhaar Card (Optional)
        </label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => handleFileChange('aadhaarFile', e.target.files?.[0] || null)}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300"
        />
        {signupData.aadhaarFile && (
          <p className="mt-1 text-xs text-green-600">Selected: {signupData.aadhaarFile.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Upload PAN Card (Optional)
        </label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => handleFileChange('panFile', e.target.files?.[0] || null)}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300"
        />
        {signupData.panFile && (
          <p className="mt-1 text-xs text-green-600">Selected: {signupData.panFile.name}</p>
        )}
      </div>
    </div>
  );

  // Render step 3: Review & Submit
  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
        <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Personal Information</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Full Name</p>
            <p className="font-medium text-gray-900 dark:text-white">{signupData.fullName || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium text-gray-900 dark:text-white">{signupData.email || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium text-gray-900 dark:text-white">{signupData.phone || '—'}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
        <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Professional Details</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Expertise</p>
            <p className="font-medium text-gray-900 dark:text-white">{signupData.expertise || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500">Experience</p>
            <p className="font-medium text-gray-900 dark:text-white">{signupData.yearsOfExperience || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500">Current Role</p>
            <p className="font-medium text-gray-900 dark:text-white">{signupData.currentRole || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500">Company</p>
            <p className="font-medium text-gray-900 dark:text-white">{signupData.company || '—'}</p>
          </div>
        </div>
        {signupData.bio && (
          <div className="mt-3">
            <p className="text-gray-500">Bio</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{signupData.bio}</p>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
        <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Verification Documents</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-500">Aadhaar:</span>{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {signupData.aadhaarNumber || 'Not provided'}
            </span>
            {signupData.aadhaarFile && (
              <span className="ml-2 text-xs text-green-600"> (File uploaded)</span>
            )}
          </div>
          <div>
            <span className="text-gray-500">PAN:</span>{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {signupData.panNumber || 'Not provided'}
            </span>
            {signupData.panFile && <span className="ml-2 text-xs text-green-600"> (File uploaded)</span>}
          </div>
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            id="agreeToTerms"
            type="checkbox"
            checked={signupData.agreeToTerms}
            onChange={(e) => updateSignupField('agreeToTerms', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="agreeToTerms" className="text-gray-600 dark:text-gray-400">
            I agree to the{' '}
            <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
            , and I confirm that all provided information is accurate.
          </label>
        </div>
      </div>
      {stepErrors.agreeToTerms && <p className="text-xs text-red-500">{stepErrors.agreeToTerms}</p>}
    </div>
  );

  // Render registration stepper form
  const renderSignupStepper = () => (
    <form onSubmit={handleRegistration} className="mt-6">
      {renderStepper()}
      
      <div className="min-h-[400px]">
        {currentStep === 0 && renderPersonalStep()}
        {currentStep === 1 && renderProfessionalStep()}
        {currentStep === 2 && renderGovernmentStep()}
        {currentStep === 3 && renderReviewStep()}
      </div>

      {signupError && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {signupError}
        </div>
      )}

      <div className="mt-8 flex justify-between gap-3">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Previous
        </button>
        
        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next Step
          </button>
        ) : (
          <button
            type="submit"
            disabled={signupLoading}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signupLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              'Complete Registration'
            )}
          </button>
        )}
      </div>
    </form>
  );

  // Render signin form
  const renderSigninForm = () => (
    <form onSubmit={handleSignin} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={signinEmail}
          onChange={(e) => setSigninEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <Link href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-500 focus:outline-none">
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={signinPassword}
          onChange={(e) => setSigninPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {signinError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {signinError}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={signinLoading}
          className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {signinLoading ? (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Signing in...</span>
            </div>
          ) : (
            <span>Sign in to Dashboard</span>
          )}
        </button>
      </div>
    </form>
  );

return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Left Branding Panel - More Premium */}
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-indigo-950 via-slate-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_30%_20%,rgba(129,140,248,0.15),transparent)]" />
        
        <div className="relative z-10 p-12 flex flex-col h-full">
          <div className="flex items-center gap-3 text-2xl font-bold text-white">
            <div className="w-9 h-9 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl">M</div>
            MentorHub
          </div>

          <div className="mt-auto mb-12">
            <h1 className="text-5xl font-bold leading-tight text-white tracking-tighter">
              {mode === 'signin' 
                ? "Welcome back, Mentor." 
                : "Shape the next generation of tech leaders."}
            </h1>
            <p className="mt-6 text-xl text-indigo-200/80 max-w-md">
              {mode === 'signin'
                ? "Your impact continues inside."
                : "Join India's most respected platform for industry mentors."}
            </p>
          </div>

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <div className="text-4xl font-semibold text-white">10,000+</div>
                <div className="text-indigo-300">Verified Mentors</div>
              </div>
              <div>
                <div className="text-4xl font-semibold text-white">500K+</div>
                <div className="text-indigo-300">Students Impacted</div>
              </div>
            </div>
          )}

          <div className="mt-auto pt-8 border-t border-white/10 text-xs text-indigo-300/70">
            Trusted by professionals from Google, Microsoft, Atlassian, Razorpay &amp; more
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {mode === 'signin' ? 'Sign in to your dashboard' : 'Become a Mentor'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {mode === 'signin' ? "Don't have an account?" : 'Already registered?'}{' '}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline"
              >
                {mode === 'signin' ? 'Create profile' : 'Sign in'}
              </button>
            </p>
          </div>

          {mode === 'signin' ? renderSigninForm() : renderSignupStepper()}
        </div>
      </div>
    </div>
  );
}