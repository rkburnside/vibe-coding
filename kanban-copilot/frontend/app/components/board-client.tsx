'use client'

import dynamic from 'next/dynamic'

const Board = dynamic(() => import('@/app/components/board'), {
  ssr: false,
  loading: () => <div className="p-4">Loading board...</div>,
})

export default Board
