import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { type FC, type PropsWithChildren } from "react";

const Providers: FC<PropsWithChildren> = ({
    children
}) => {
    return (
        <AppRouterCacheProvider options={{ key: 'mui' }}>
            {children}
        </AppRouterCacheProvider>
    );
};

export default Providers;
