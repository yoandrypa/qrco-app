import React from 'react'
import { useEffect, useState } from "react";
import { get as getUser } from "../handlers/users";
import { list } from "../handlers/qrs"
import { QRCODE_PLANS } from '../components/qr/constants';

type usePlansParams = {
    mode: string
    userInfo: any
}

function usePlans(mode: string, userInfo: any) {
    const [limitReached, setLimitReached] = useState<boolean>(false)
    const [isFreeMode, setIsFreeMode] = useState<boolean>(false)
    const [planType, setPlanType] = useState<'free' | PlanType>('free')

    useEffect(() => {
        if (userInfo && mode !== 'edit') {
            const fetchUser = async () => {
                return await getUser(userInfo.cognito_user_id);
            };
            fetchUser().then(profile => {
                list({ userId: userInfo.cognito_user_id }).then(qrs => { // @ts-ignore

                    if (!profile?.subscriptionData) {
                        setIsFreeMode(true);
                        if ((qrs.items as Array<any>).some((el: any) => el.isDynamic)) setLimitReached(true);
                    } else {
                        setIsFreeMode(false);
                        //TODO handle plan limits
                    }
                });

            }).catch(console.error);
        }
    }, [userInfo]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        limitReached,
        isFreeMode,
        getUsage: () => {
            //TODO
        }

    }
}

export default usePlans