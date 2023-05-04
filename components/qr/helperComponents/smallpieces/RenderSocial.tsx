import {memo} from "react";
import SectionSelector from "../SectionSelector";

interface SocialNetProps {
  property: string;
  selected: boolean;
  tooltip: string;
  handleSelection: Function;
}

const RenderSocialNetwork = ({property, selected, tooltip, handleSelection}: SocialNetProps) => (
  <SectionSelector
    icon="_" separate h='50px' w='55px' mw='55px' property={property} selected={selected}
    handleSelect={handleSelection} tooltip={tooltip} />
);

const notIf = (curr: SocialNetProps, next: SocialNetProps) => curr.selected === next.selected;

export default memo(RenderSocialNetwork, notIf);
