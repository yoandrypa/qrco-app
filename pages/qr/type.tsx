import QrTypeSelector from "../../components/qr/QrTypeSelector";
import QrWizard from "../../components/qr/QrWizard";
import { useContext, useEffect } from "react";
import Context from "../../components/context/Context";
import { useRouter } from "next/router";
import { DEFAULT_DYNAMIC_SELECTED, QR_DESIGN_ROUTE } from "../../components/qr/constants";
import { DataType } from "../../components/qr/types/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { findByAddress } from "../../handlers/links";
import { get } from "../../handlers/preGenerated";

export default function QrGen ({ address, preGenerated, claimable }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // @ts-ignore
  const { selected, setSelected, options, clearData, userInfo, setData } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    if (address !== undefined) {
      setData((prev: DataType) => ({...prev, claim: address as string, claimable, preGenerated}));
    } else if (!selected) {
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
      <QrTypeSelector/>
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
        link = await get(query.address);
        if (link) {
          return {
            props: {
              address: query.address,
              preGenerated: true,
              claimable: true
            }
          };
        } else {
          return {
            props: {
              address: query.address,
              preGenerated: false,
              claimable: true
            }
          };
        }
      } catch (e: any) {
        return {
          props: {
            address: query.address,
            preGenerated: false,
            claimable: true
          }
        };
      }
      // Check if the address is claimable
    } else if (link[0].claimable === true) {
      return {
        props: {
          address: query.address,
          preGenerated: false,
          claimable: true
        }
      };
    }

    return { props: {} };
  }

  return { props: {} };
};
