import { type NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'

const DashboardScreen = dynamic(
  () => import('~/components/screens/dashboard/Dashboard'),
  {
    ssr: false,
  }
)

const Dashboard: NextPage = () => {
  return <DashboardScreen />
}

export default Dashboard
