import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Provider from "@/lib/components/providers";
import { type FC, type PropsWithChildren } from "react";

const Providers: FC<PropsWithChildren> = ({
    children
}) => {
    return (
        <AppRouterCacheProvider options={{ key: 'mui' }}>
            <Provider>
                {children}
            </Provider>
        </AppRouterCacheProvider>
    );
};

export default Providers;
