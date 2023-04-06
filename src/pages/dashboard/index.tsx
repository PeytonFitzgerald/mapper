import { type NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { getServerAuthSession } from '@/server/auth'
import dynamic from 'next/dynamic'
import { PageLayout } from '@/components/layout/Layout'
const DashboardScreen = dynamic(
  () => import('@/components/screens/dashboard/Dashboard'),
  {
    ssr: false,
  }
)

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Mapper Dashboard</title>
      </Head>
      <PageLayout useContainer={false}>
        <DashboardScreen />
      </PageLayout>
    </>
  )
}

export default Dashboard
export async function getServerSideProps(context: any) {
  const session = await getServerAuthSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  } else {
    return { props: {} }
  }
}
