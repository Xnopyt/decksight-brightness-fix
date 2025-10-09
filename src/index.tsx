import { staticClasses } from "@decky/ui"
import {
  definePlugin,
  routerHook,
  callable,
  executeInTab,
  addEventListener,
  removeEventListener,
} from "@decky/api"
import { FaShip } from "react-icons/fa"
import Overlay from "./overlay"

const startMonitor = callable<[], void>("start_monitor")

let cleanupTabs: string[] = []

const listener = (brightness: number, tabs: string[]) => {
    cleanupTabs = tabs
    for (const tab of tabs) {
      executeInTab(tab, true, "document.children[0].style.filter = 'brightness(" + brightness + ")'")
    }
}

export default definePlugin(() => {
  routerHook.addGlobalComponent("BrightnessOverlay", (props) => <Overlay {...props} />)
  addEventListener("brightness_change", listener)
  startMonitor()
  return {
    name: "DeckSight Brightness Fix",
    titleView: <div className={staticClasses.Title}>DeckSight Brightness Fix</div>,
    icon: <FaShip />,
    onDismount() {
      removeEventListener("brightness_change", listener)
      routerHook.removeGlobalComponent('BrightnessOverlay')
      for (const tab of cleanupTabs) {
        executeInTab(tab, false, 'document.children[0].style.filter = null')
      }
    }
  }
})
