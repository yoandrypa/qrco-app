import Notifications from "../../../notifications/Notifications";

interface CopiedProp {
  setCopied: (copied: boolean) => void;
}

export default function RenderCopiedNotification({setCopied}: CopiedProp) {
  return (
    <Notifications
      autoHideDuration={2500}
      message="Copied!"
      vertical="bottom"
      horizontal="center"
      severity="success"
      onClose={() => setCopied(false)}/>
  );
}
