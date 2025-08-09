import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase, {InputBaseProps} from "@mui/material/InputBase";
import {styled} from "@mui/material/styles";
import ClearIcon from "@specfocus/elements/lib/icons/clear";
import SearchIcon from "@specfocus/elements/lib/icons/search";
import {searchParamAtomFamily} from "@specfocus/realize/lib/state/search-params";
import {forwardRef, Fragment, type FC} from "react";
import {useAtom} from "../state/atom";

interface InputProps extends InputBaseProps {}

const Input = styled(InputBase)<InputProps>(({}) => ({
    flex: 1,
}));

interface SearchInputProps {
    isPending?: boolean;
    paramName: string;
    placeholder?: string;
    onChange?: (value: string) => void;
}

const SearchInput: FC<SearchInputProps & {ref?: React.Ref<HTMLInputElement>;}> = forwardRef<
    HTMLInputElement,
    SearchInputProps
>(({
    isPending,
    paramName,
    placeholder = 'Search…',
    onChange
}, ref) => {
    const [query, setQuery] = useAtom(searchParamAtomFamily(paramName));

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);
        onChange?.(value);
    };

    return (
        <Fragment>
            <IconButton sx={{padding: '10px'}} aria-label="search">
                <SearchIcon />
            </IconButton>
            <Input
                autoFocus
                value={query}
                onChange={handleChange}
                placeholder={placeholder}
                inputProps={{"aria-label": 'search'}}
                inputRef={ref}
                endAdornment={
                    isPending ? (
                        <InputAdornment position="end">
                            <CircularProgress size={16} sx={{mr: 2}} />
                        </InputAdornment>
                    ) : query ? (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="clear search"
                                onClick={() => setQuery('')}
                                sx={{mr: 1}}
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ) : undefined
                }
            />
        </Fragment>
    );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
