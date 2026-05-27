import { Redirect } from 'expo-router';

// Splash lives at the root route (app/index.tsx); redirect here as fallback
export default function Splash() {
  return <Redirect href="/" />;
}
