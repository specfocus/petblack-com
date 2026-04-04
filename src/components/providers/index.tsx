import {type FC, type PropsWithChildren} from "react";

const Providers: FC<PropsWithChildren> = ({
    children
}) => {
    return (
        <>
            {children}
        </>
    );
};

export default Providers;
