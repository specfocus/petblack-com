import type { AppMessages } from './i18n/messages';

declare global {
    // Augments the global IntlMessages interface used by shelly's useTranslations()
    // hook across all shelly and app-specific namespaces.
    interface IntlMessages extends AppMessages { }
}
