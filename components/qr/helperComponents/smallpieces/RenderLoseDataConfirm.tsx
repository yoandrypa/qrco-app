import RenderConfirmDlg from "../../../renderers/RenderConfirmDlg";

interface RenderLoseDataProps {
  handleOk: () => void;
  handleCancel: () => void;
}

export default function RenderLoseDataConfirm({handleOk, handleCancel}: RenderLoseDataProps) {
  return (<RenderConfirmDlg
    handleCancel={handleCancel}
    handleOk={handleOk}
    message="The data you entered will be discarded."
    confirmationMsg="Are you sure?"
    yesMsg="yes"
    noMsg="no"
  />)
}
