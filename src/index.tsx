import { staticClasses } from "@decky/ui";
import {
  definePlugin,
  routerHook
} from "@decky/api"
import { FaShip } from "react-icons/fa";
import Overlay from "./overlay";

export default definePlugin(() => {
  routerHook.addGlobalComponent("BlackOverlay", (props) => <Overlay {...props} />)

  return {
    name: "DeckSight Brightness Fix",
    titleView: <div className={staticClasses.Title}>DeckSight Brightness Fix</div>,
    icon: <FaShip />,
    onDismount() {
      routerHook.removeGlobalComponent("BlackOverlay")
    },
  };
});
