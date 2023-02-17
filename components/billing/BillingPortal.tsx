import React from 'react'
import Button from '@mui/material/Button'

type BillingPortalProps = {
  customerId: string
}

function BillingPortal(props: BillingPortalProps) {
  return (
    <form method="POST" action={`/api/billing-portal/`}>
      <input type={'hidden'} name={'customerId'} value={props.customerId} />

      <Button type='submit' variant='contained'>
        Review plan
      </Button>
    </form>
  )
}

export default BillingPortal