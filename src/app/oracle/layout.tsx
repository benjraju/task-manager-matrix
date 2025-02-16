import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Oracle | Matrix Task Manager',
  description: 'Seek guidance from Morpheus in your productivity journey',
}

export default function OracleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 