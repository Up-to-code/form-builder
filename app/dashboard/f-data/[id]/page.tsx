import { SubmissionsTable } from '@/components/common/tabel/tabel/Tabel'
import React from 'react'
 interface PageProps {
    params: {
        id: string
    }
}
function page({
    params
} : PageProps) {
  return (
    <div>
        <SubmissionsTable formId={params.id} />
    </div>
  )
}

export default page