import { staticClasses } from "@decky/ui";
import {
  callable,
  definePlugin,
  routerHook
} from "@decky/api"
import { FaShip } from "react-icons/fa";
import Overlay from "./overlay";

const monitor = callable<[], number>("monitor");

export default definePlugin(() => {
  routerHook.addGlobalComponent("BlackOverlay", (props) => <Overlay {...props} />)

  monitor()

  return {
    name: "DeckSight Brightness Fix",
    titleView: <div className={staticClasses.Title}>DeckSight Brightness Fix</div>,
    icon: <FaShip />,
    onDismount() {
      routerHook.removeGlobalComponent("BlackOverlay")
    },
  };
});
