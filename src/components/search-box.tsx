'use client';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { type FC, type FormEvent, useState } from 'react';

interface SearchBoxProps {
    onSearch: (query: string) => void;
    loading?: boolean;
}

const SearchBox: FC<SearchBoxProps> = ({ onSearch, loading = false }) => {
    const [value, setValue] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSearch(value.trim());
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%', maxWidth: 720 }}
            role="search"
        >
            <TextField
                fullWidth
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Search for pet food, toys, accessories…"
                size="medium"
                aria-label="Search products"
                disabled={loading}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    type="submit"
                                    aria-label="Submit search"
                                    disabled={loading}
                                    edge="end"
                                    color="primary"
                                >
                                    <SearchRoundedIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: 3,
                            bgcolor: 'background.paper',
                            fontSize: 16,
                        },
                    },
                }}
            />
        </Box>
    );
};

export default SearchBox;
