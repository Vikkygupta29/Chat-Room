const SETTINGS_KEY = 'chat-room-settings'

const defaultSettings = {
    notificationsEnabled: true,
    enterToSendEnabled: true,
}

export function getSettings() {
    try {
        const storedSettings = localStorage.getItem(SETTINGS_KEY)


        if (!storedSettings) {
            return defaultSettings
        }

        return {
            ...defaultSettings,
            ...JSON.parse(storedSettings),
        }
    } catch (error) {
        console.error('Failed to load settings:', error)
        return defaultSettings
    }

}

export function saveSettings(settings) {
    try {
        localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(settings),
        )
    } catch (error) {
        console.error('Failed to save settings:', error)
    }
}
