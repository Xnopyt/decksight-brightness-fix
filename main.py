import decky, os, struct, ctypes, ctypes.util, asyncio, urllib.request, json
class Plugin:
    async def _main(self):
        self.libc = ctypes.CDLL(ctypes.util.find_library("c"), use_errno=True)
        self.libc.inotify_init.restype = ctypes.c_int
        self.libc.inotify_add_watch.argtypes = [ctypes.c_int, ctypes.c_char_p, ctypes.c_uint32]
        self.libc.inotify_add_watch.restype = ctypes.c_int

        self.EVENT_STRUCT_FORMAT = "iIII"
        self.EVENT_SIZE = struct.calcsize(self.EVENT_STRUCT_FORMAT)
        self.IN_MODIFY = 0x00000002
        
        self.fd = False
        self.path = '/sys/class/backlight/amdgpu_bl0/brightness'
        self.max_path = '/sys/class/backlight/amdgpu_bl0/max_brightness'
        self.max_brightness = False
        
        self.loop = asyncio.get_event_loop()
        self.task = None
        
        self.blacklistedTabs = ["SharedJSContext", "Steam Shared Context presented by Valve™", "Steam", "SP", "Steam Big Picture Mode"]
        
    async def _unload(self):
        if self.fd:
            os.close(self.fd)
            self.fd = False
            
        if self.task:
            self.task.cancel()

    async def start_monitor(self):
        self.task = self.loop.create_task(self.monitor())
        
    async def monitor(self):
        await self.send_brightness()
        
        self.fd = self.libc.inotify_init()
        if self.fd < 0:
            errno = ctypes.get_errno()
            raise OSError(errno, os.strerror(errno))

        wd = self.libc.inotify_add_watch(self.fd, self.path.encode("utf-8"), self.IN_MODIFY)
        if wd < 0:
            errno = ctypes.get_errno()
            raise OSError(errno, os.strerror(errno))

        while True:
            data = os.read(self.fd, 4096)
            offset = 0
            while offset < len(data):
                wd, mask, _, _ = struct.unpack_from(self.EVENT_STRUCT_FORMAT, data, offset)
                offset += self.EVENT_SIZE
                
                if mask & self.IN_MODIFY:
                    await self.send_brightness()
                        
    async def send_brightness(self):
        if not self.max_brightness:
            with open(self.max_path, "r") as file:
                self.max_brightness = int(file.read())
        
        with open(self.path, "r") as file:
            ratio = max(0, min(1, int(file.read()) / self.max_brightness))
            brightness = pow(ratio, 0.7)
            
            tabs = self.get_tabs()
            
            await decky.emit('brightness_change', brightness, tabs)
            
    def get_tabs(self):
        data = []
        with urllib.request.urlopen('http://localhost:8080/json') as response:
            data = json.loads(response.read())
            
        tabs = []
        for tab in data:
            if tab['title'] not in self.blacklistedTabs and tab['type'] == 'page':
                tabs.append(tab['title'])
                
        return tabs
