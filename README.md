# DeckSight Brightness Fix

A Decky plugin that fixes brightness control in Gamescope for Steam Decks with DeckSight OLED panels. Based on https://github.com/jefri931/pwmless-brightness-control

## How it works
It works by monitoring `/sys/class/backlight/amdgpu_bl0/brightness` for changes with inotify and creating an black overlay with an opacity based on the current brightness value. The opacity layering code was based on https://github.com/jefri931/pwmless-brightness-control

## Usage
* Either build the plugin or download the latest release and copy it to your Steam Deck
* Go to Decky settings and enable "Developer Mode"
* In the Developer tab, select "Install Plugin from ZIP File"
* Select the file you copied
* The built-in brightness slider and auto brightness will work again

Note: Similarly to the PWMLess-Brightness-Control plugin, the quick settings menu will always be at full brightness.   