import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Dashboard from '@/components/Dashboard'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile with credits
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return <Dashboard user={user} profile={profile} />
}