import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { get } from '../../../handlers/users'
import { GetServerSideProps } from 'next'
import BuyPlan from '../../../components/plans/BuyPlan'
//Generic Imports
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
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter();

    if (router.isFallback) {
        return <PleaseWait />;
    }
    return (
        <Authenticator components={components}>
            {({ user }) => (
                <BuyPlan plan={router.query.plan as string} email={user?.attributes?.email!} id={user?.attributes?.sub!} />
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
