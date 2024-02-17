import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]); // Depend on `router` to ensure it's available

  // rest of your code...

  return (
    <div>
      Redirecting...
    </div>
  )
}

export default Index;
