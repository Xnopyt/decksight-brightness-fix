import { staticClasses } from "@decky/ui";
import {
  definePlugin,
  routerHook,
  executeInTab,
  addEventListener,
  removeEventListener
} from "@decky/api"
import { FaShip } from "react-icons/fa";
import Overlay from "./overlay";

export default definePlugin(() => {
    routerHook.addGlobalComponent("BlackOverlay", (props) => <Overlay {...props} />)

    executeInTab('QuickAccess_uid2', false, `
      overlay = document.createElement('div')
      overlay.id = 'BrightnessOverlay'
      overlay.style.backgroundColor = 'black'
      overlay.style.position = 'fixed'
      overlay.style.top = '0'
      overlay.style.left = '0'
      overlay.style.width = '100%'
      overlay.style.height = '100%'
      overlay.style.opacity = '0'
      overlay.style.zIndex = '10'
      overlay.style.transition = 'opacity 0.15s linear'
      window.document.body.appendChild(overlay)
      overlay.style.pointerEvents = 'none'
    `)

    const listener = (current: number, max: number) => {
        const ratio = Math.max(0, Math.min(1, current / max))
        const adjusted = Math.pow(ratio, 0.5)
        const opacity = Math.round((1 - adjusted) * 100) / 100
        executeInTab('QuickAccess_uid2', false, `
          overlay = document.getElementById('BrightnessOverlay')
          if (overlay) {
            overlay.style.opacity = ` + opacity + `
          }
        `)
    };
    
    addEventListener("brightness_change", listener);

  return {
    name: "DeckSight Brightness Fix",
    titleView: <div className={staticClasses.Title}>DeckSight Brightness Fix</div>,
    icon: <FaShip />,
    onDismount() {
      routerHook.removeGlobalComponent("BlackOverlay")
      removeEventListener("brightness_change", listener);
      executeInTab('QuickAccess_uid2', false, 'window.document.body.removeChild(document.getElementById("BrightnessOverlay"))')
    },
  };
});
