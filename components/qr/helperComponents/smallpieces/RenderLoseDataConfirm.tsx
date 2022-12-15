import RenderConfirmDlg from "../../../renderers/RenderConfirmDlg";

interface RenderLoseDataProps {
  handleOk: () => void;
  handleCancel: () => void;
}

export default function RenderLoseDataConfirm({handleOk, handleCancel}: RenderLoseDataProps) {
  return (<RenderConfirmDlg
    handleCancel={handleCancel}
    handleOk={handleOk}
    message="You will lose the changes."
    confirmationMsg="Are you sure?"
    yesMsg="yes"
    noMsg="no"
  />)
}
