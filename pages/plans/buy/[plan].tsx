import React from 'react'
import { useRouter } from 'next/router'

type Props = {}

const PlanType = (props: Props) => {
    const router = useRouter();
    const { plan } = router.query

    switch (plan) {
        case 'basic':
            //TODO
            break;
        case 'basic-annual':
            //TODO
            break;
        case 'business':
            //TODO
            break;
        case 'business-annual':
            //TODO
            break;
        case 'premium':
            //TODO
            break;
        case 'premium-annual':
            break;
        default:
            //NO available Plan 
            break;
    }

    return (
        <div>{plan}</div>
    )
}

export default PlanType