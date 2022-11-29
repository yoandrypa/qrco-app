import React, { useEffect, useState } from 'react'
import { handleFetchResponse } from '../../handlers/helpers'
import Loading from '../Loading'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

type Props = {
    plan: string,
    email: string,
    id: string
}

function BuyPlan({ plan, email, id }: Props) {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    //@ts-ignore

    useEffect(() => {
        async function buyPlan(plan: string) {
            setIsLoading(true)
            let planSlug;
            switch (plan) {
                case 'basic-annual':
                    planSlug = 'basicAnnual'
                    break;
                case 'business-annual':
                    planSlug = 'businessAnnual'
                    break;
                case 'premium-annual':
                    planSlug = 'premiumAnnual'
                    break;
                default:
                    planSlug = plan
                    break;
            }
            try {
                const payload = {
                    id: id,
                    email: email,
                    plan_type: planSlug
                }
                const options = {
                    method: 'post',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload)
                };
                const response = await fetch(`/api/create-customer`, options);
                const data = await handleFetchResponse(response)
                if (data instanceof Error) throw data;
                setIsLoading(false)
                //@ts-ignore
                window.location.href = data.result?.url;
            } catch (error) {
                setIsLoading(false)
                const errorMessage = error instanceof Error ? error.message : 'Something went wrong. We are working on it.'
                setError(errorMessage)
            }

        }
        buyPlan(plan)
    }, [email, id, plan])

    return (
        <>
            {isLoading && <Loading text='Loading checkout details...' />}
            {error && <Snackbar open={!!error} autoHideDuration={6000}>
                <Alert onClose={() => setError(null)} variant="filled" severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>}
        </>
    )
}

export default BuyPlan