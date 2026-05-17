export const petSettings = {
  petEnabled: true,
};

const getAdapter = async () => {
  if (!petSettings.petEnabled) return null;
  const module = await import("../pet-system/src/pet-system/adapters/petAdapter");
  return module.petAdapter;
};

export const petBridge = {
  taskCompleted: async () => {
    const adapter = await getAdapter();
    adapter?.onTaskCompleted();
  },
  allTasksCompleted: async () => {
    const adapter = await getAdapter();
    adapter?.onAllTasksCompleted();
  },
  turnRestart: async () => {
    const adapter = await getAdapter();
    adapter?.onTurnRestart();
  },
  sectionReset: async () => {
    const adapter = await getAdapter();
    adapter?.onSectionReset?.();
  },
  appOpen: async (params?: { pendingTaskCount?: number }) => {
    const adapter = await getAdapter();
    adapter?.onAppOpen(params?.pendingTaskCount);
  },
  themeChanged: async (theme: "clean" | "rainbow") => {
    const adapter = await getAdapter();
    adapter?.onThemeChanged(theme === "rainbow" ? "kawaii" : "clean");
  }
};
