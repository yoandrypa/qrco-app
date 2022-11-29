import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { get } from '../../../handlers/users'
import Context from '../../../components/context/Context'
import { handleFetchResponse } from '../../../handlers/helpers'
import { GetServerSideProps } from 'next'
import Loading from '../../../components/Loading'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "../../../libs/aws/aws-exports";
import PleaseWait from "../../../components/PleaseWait";
import components from "../../../libs/aws/components";

type Props = {
    logged: boolean,
    profile?: {
        planType?: string,
        customerId?: string,
        subscriptionData?: {
            //TODO
        }
    }
}

Amplify.configure(awsExports);

const PlanType = (props: Props) => {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter();
    //@ts-ignore
    const { userInfo } = useContext(Context)

    useEffect(() => {
        const { plan } = router.query
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
                    id: userInfo.attributes.sub!,
                    email: userInfo.attributes.email,
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
        buyPlan(plan as string)
    }, [router.query, userInfo.attributes.email, userInfo.attributes.sub])


    if (router.isFallback) {
        return <PleaseWait />;
    }
    return (
        <Authenticator components={components}>
            {({ user }) => (
                <>
                    {isLoading && <Loading text='Loading checkout details...' />}
                    {error && <Snackbar open={!!error} autoHideDuration={6000}>
                        <Alert onClose={() => setError(null)} variant="filled" severity="error" sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                    </Snackbar>}
                </>
            )}
        </Authenticator>
    );
};

export default PlanType;

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const getUserInfo = async (): Promise<CognitoUserData | null> => {
        try {
            let userInfo = {};
            for (const [key, value] of Object.entries(ctx.req.cookies)) {
                // @ts-ignore
                userInfo[key.split(".").pop()] = value;
            }
            // @ts-ignore
            if (!userInfo.userData) {
                return null;
            }
            //@ts-ignore
            return userInfo;
        } catch (e) {
            return null;
        }
    };
    const userInfo = await getUserInfo();
    if (!userInfo?.userData) {
        return {
            props: {
                logged: false
            }
        }
    } else {
        //@ts-ignore
        const userData = JSON.parse(userInfo.userData as string)
        const userId = userData.UserAttributes[0].Value;
        const data: object = await get(userId)
        return {
            props: {
                logged: true,
                profile: JSON.parse(JSON.stringify(data))
            }
        }
    }
}
