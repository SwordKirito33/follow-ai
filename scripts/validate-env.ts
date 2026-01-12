/**
 * Environment variable validation script
 * Validates required environment variables at startup
 */

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

const envVars: EnvVar[] = [
  // Supabase
  {
    name: 'VITE_SUPABASE_URL',
    required: true,
    description: 'Supabase project URL',
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anonymous key',
  },
  
  // Sentry
  {
    name: 'VITE_SENTRY_DSN',
    required: false,
    description: 'Sentry DSN for error tracking',
  },
  
  // PostHog
  {
    name: 'VITE_POSTHOG_KEY',
    required: false,
    description: 'PostHog API key for analytics',
  },
  {
    name: 'VITE_POSTHOG_HOST',
    required: false,
    description: 'PostHog host URL',
    defaultValue: 'https://app.posthog.com',
  },
  
  // App Configuration
  {
    name: 'VITE_APP_NAME',
    required: false,
    description: 'Application name',
    defaultValue: 'Follow.ai',
  },
  {
    name: 'VITE_APP_URL',
    required: false,
    description: 'Application URL',
    defaultValue: 'https://www.follow-ai.com',
  },
  
  // Feature Flags
  {
    name: 'VITE_ENABLE_ANALYTICS',
    required: false,
    description: 'Enable analytics tracking',
    defaultValue: 'true',
  },
  {
    name: 'VITE_ENABLE_ERROR_TRACKING',
    required: false,
    description: 'Enable error tracking',
    defaultValue: 'true',
  },
];

function validateEnv(): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const envVar of envVars) {
    const value = process.env[envVar.name];

    if (!value) {
      if (envVar.required) {
        errors.push(`❌ Missing required environment variable: ${envVar.name}`);
        errors.push(`   Description: ${envVar.description}`);
      } else {
        warnings.push(`⚠️  Missing optional environment variable: ${envVar.name}`);
        warnings.push(`   Description: ${envVar.description}`);
        if (envVar.defaultValue) {
          warnings.push(`   Default value will be used: ${envVar.defaultValue}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function printResults(result: { valid: boolean; errors: string[]; warnings: string[] }): void {
  console.log('\n🔍 Environment Variable Validation\n');

  if (result.errors.length > 0) {
    console.log('Errors:');
    result.errors.forEach(error => console.log(error));
    console.log('');
  }

  if (result.warnings.length > 0) {
    console.log('Warnings:');
    result.warnings.forEach(warning => console.log(warning));
    console.log('');
  }

  if (result.valid) {
    console.log('✅ All required environment variables are set\n');
  } else {
    console.log('❌ Environment validation failed\n');
    console.log('Please set the missing required environment variables in your .env file\n');
  }
}

function generateEnvTemplate(): void {
  console.log('\n📄 .env Template:\n');
  console.log('# Copy this template to .env and fill in your values\n');

  for (const envVar of envVars) {
    console.log(`# ${envVar.description}`);
    if (envVar.required) {
      console.log(`${envVar.name}=`);
    } else {
      const value = envVar.defaultValue || '';
      console.log(`# ${envVar.name}=${value}`);
    }
    console.log('');
  }
}

// Run validation
const result = validateEnv();
printResults(result);

// Generate template if validation failed
if (!result.valid) {
  generateEnvTemplate();
  process.exit(1);
}
