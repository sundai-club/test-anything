'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export default function PostHogProvider() {
  useEffect(() => {
    posthog.init('phc_J8Nkc1eYAAyRPIoxd2qXmx6aHGn3CUx0zTwxXUod5nm', {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only'
    });
  }, []);

  return null;
} 