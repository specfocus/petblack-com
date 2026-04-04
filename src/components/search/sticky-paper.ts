import Paper, {type PaperProps} from "@mui/material/Paper";
import {styled} from "@mui/material/styles";

interface StickyPaperProps extends PaperProps {
    borderRadius?: number | string;
}

const StickyPaper = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'borderRadius',
})<StickyPaperProps>(({theme, borderRadius}) => ({
    position: 'sticky',
    top: '0px',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    width: '100%',
    borderRadius: typeof borderRadius === 'number' ? `${theme.spacing(borderRadius)}px` : borderRadius,
    border: borderRadius ? '1px solid' : undefined,
    borderColor: borderRadius ? theme.palette.divider : undefined,
    boxShadow: 'none',
})
);

export default StickyPaper;
