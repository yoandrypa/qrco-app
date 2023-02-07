import { useContext, useEffect, useState } from "react";
import QrTypeSelector from "../../components/qr/QrTypeSelector";
import QrWizard from "../../components/qr/QrWizard";
import Context from "../../components/context/Context";
import { useRouter } from "next/router";
import { DEFAULT_DYNAMIC_SELECTED, QR_DESIGN_ROUTE } from "../../components/qr/constants";
import { DataType } from "../../components/qr/types/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { findByAddress } from "../../handlers/links";
import { get as getPreGenerated } from "../../handlers/preGenerated";

import dynamic from "next/dynamic";

const Notifications = dynamic(() => import("../../components/notifications/Notifications"));

export default function QrGen({ address, preGenerated, claimable }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [notClamable, setNotClamable] = useState<boolean>(false);
  // @ts-ignore
  const { selected, setSelected, options, clearData, userInfo, setData } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    if (address !== undefined) {
      setData((prev: DataType) => ({ ...prev, claim: address as string, claimable, preGenerated }));
    } else if (!selected) {
      if (router.query.address !== undefined) {
        setNotClamable(true);
      }
      setSelected(DEFAULT_DYNAMIC_SELECTED);
    }
  }, [address]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (options?.mode !== "edit" && router.query.mode !== "edit") {
      if (router.pathname === QR_DESIGN_ROUTE) {
        clearData(true, userInfo !== undefined || undefined, true);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <QrWizard>
      <QrTypeSelector />
      {notClamable && (
        <Notifications
          severity="warning" showProgress
          message={`The code '${router.query.address}' is already taken.`}
          onClose={() => setNotClamable(false)}
        />
      )}
    </QrWizard>
  );
};

// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (query?.address) {
    // Check if the address exist
    let link = await findByAddress({ address: { eq: query.address } });
    if (!link.length) {
      //Check if the address is pre-generated
      try {
        // @ts-ignore
        link = await getPreGenerated(query.address as string);
        if (link) {
          return {
            props: {
              address: query.address,
              preGenerated: true,
              claimable: false
            }
          };
        } else {
          return {
            props: {
              address: query.address,
              preGenerated: false,
              claimable: false
            }
          };
        }
      } catch (e: any) {
        return {
          props: {
            address: query.address,
            preGenerated: false,
            claimable: false
          }
        };
      }
      // Check if the address is claimable
    } else if (link[0].claimable === true) {
      return {
        props: {
          address: query.address,
          preGenerated: link[0].preGenerated,
          claimable: false
        }
      };
    }

    return { props: {} };
  }

  return { props: {} };
};
