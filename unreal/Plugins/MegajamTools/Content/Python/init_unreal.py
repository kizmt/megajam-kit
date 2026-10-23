import unreal

try:
    from megajam_tools import toolsets
    toolsets._registration.register()
    unreal.log("MegajamTools: toolset registered")
except Exception as e:  # never break editor startup
    unreal.log_error(f"MegajamTools: failed to register toolset: {e}")
