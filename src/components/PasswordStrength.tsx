import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: 'At least 6 characters', test: (p) => p.length >= 6 },
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains number', test: (p) => /[0-9]/.test(p) },
  { label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, showRequirements = true }) => {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-white/10' };
    
    let score = 0;
    requirements.forEach((req) => {
      if (req.test(password)) score++;
    });

    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-500' };
    if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-500' };
    if (score <= 4) return { score, label: 'Strong', color: 'bg-green-500' };
    return { score, label: 'Very Strong', color: 'bg-emerald-500' };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(strength.score / requirements.length) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${
          strength.score <= 1 ? 'text-red-600' :
          strength.score <= 2 ? 'text-orange-600' :
          strength.score <= 3 ? 'text-accent-gold' :
          'text-accent-green'
        }`}>
          {strength.label}
        </span>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="grid grid-cols-1 gap-1 text-xs">
          {requirements.map((req, index) => {
            const passed = req.test(password);
            return (
              <div
                key={index}
                className={`flex items-center gap-1.5 transition-colors ${
                  passed ? 'text-accent-green' : 'text-gray-400'
                }`}
              >
                {passed ? (
                  <Check size={12} className="flex-shrink-0" />
                ) : (
                  <X size={12} className="flex-shrink-0" />
                )}
                <span>{req.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;
