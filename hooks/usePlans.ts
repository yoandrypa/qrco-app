// // TODO: Deprecate ...
// import React, { useContext } from 'react'
// import { useEffect, useState } from "react";
// import { get as getUser } from "../handlers/users";
// import { list } from "../handlers/qrs"
// import { QRCODE_PLANS } from '../components/qr/constants';
// import Context from "../components/context/Context";
// import session from "@ebanux/ebanux-utils/sessionStorage";
//
// type usePlansParams = {
//   mode: string
//   userInfo: any
// }
//
// function usePlans(mode: string, userInfo: any) {
//   const [limitReached, setLimitReached] = useState<boolean>(false)
//   const [isFreeMode, setIsFreeMode] = useState<boolean>(false)
//   const [planType, setPlanType] = useState<'free' | PlanType>('free')
//   const { subscription } = useContext(Context);
//
//   useEffect(() => {
//     if (session.isAuthenticated && mode !== 'edit') {
//       if (!subscription) {
//         setIsFreeMode(true);
//         if ((qrs.items as Array<any>).some((el: any) => el.isDynamic)) setLimitReached(true);
//       } else {
//         setIsFreeMode(false);
//         if (subscription?.status != 'active') setLimitReached(true)
//         //TODO handle plan limits
//       }
//     }
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps
//
//   return {
//     limitReached,
//     isFreeMode,
//     getUsage: () => {
//       //TODO
//     }
//
//   }
// }
//
// export default usePlans
export {}