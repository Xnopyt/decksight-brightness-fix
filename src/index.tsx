import { staticClasses } from "@decky/ui"
import {
  definePlugin,
  routerHook,
  callable
} from "@decky/api"
import { FaShip } from "react-icons/fa"
import Overlay from "./overlay"

const startMonitor = callable<[], void>("start_monitor")

export default definePlugin(() => {
  routerHook.addGlobalComponent("BrightnessOverlay", (props) => <Overlay {...props} />)
  startMonitor()
  return {
    name: "DeckSight Brightness Fix",
    titleView: <div className={staticClasses.Title}>DeckSight Brightness Fix</div>,
    icon: <FaShip />,
    onDismount() {
      routerHook.removeGlobalComponent('BrightnessOverlay')
    }
  }
})
