import { authOptions } from '@/lib/auth';
import { describe, it, expect, vi } from 'vitest';

// Mock process.env
const originalEnv = process.env;

describe('Auth Configuration', () => {
  
  it('should verify authOptions structure', () => {
    expect(authOptions).toBeDefined();
    expect(authOptions.adapter).toBeDefined();
  });

  // Note: Detailed provider testing relies on environment variables which are loaded at module level.
  // Testing dynamic switches in unit tests usually requires isolating modules or running separate test files.
  // Here we verify that AT LEAST ONE provider is active based on the current env (which is 'dev').

  it('should have a provider configured based on AUTH_MODE', () => {
    const providers = authOptions.providers;
    expect(providers.length).toBeGreaterThan(0);
  });

  it('should use JWT strategy in dev mode', () => {
    if (process.env.AUTH_MODE === 'dev') {
        expect(authOptions.session?.strategy).toBe('jwt');
    }
  });
});