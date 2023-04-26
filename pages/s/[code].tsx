import {GetServerSideProps, InferGetServerSidePropsType} from "next";

export default function EditionBySecret({ code }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(code)
  return (<></>);
}

export const getServerSideProps: GetServerSideProps = async ({ params}) => {
  // @ts-ignore
  const { code } = params;
  return { props: { code } }
}
