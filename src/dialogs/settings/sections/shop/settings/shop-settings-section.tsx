'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useAtom } from '@specfocus/atoms/lib/hooks';
import { type FC, useState } from 'react';
import shopListsAtom from '../atoms/shop-lists-atom';
import {
    addCustomList,
    removeCustomList,
    setListEnabled,
} from '../domain/storage';
import { PET_ICONS, PrefabListIds } from '../domain/types';

// ── Icon picker dialog ─────────────────────────────────────────────────────────

interface IconPickerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (icon: string) => void;
    current: string;
}

const IconPicker: FC<IconPickerProps> = ({ open, onClose, onSelect, current }) => (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Pick an icon</DialogTitle>
        <DialogContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pt: 1 }}>
                {PET_ICONS.map(emoji => (
                    <Box
                        key={emoji}
                        onClick={() => { onSelect(emoji); onClose(); }}
                        sx={{
                            fontSize: 28,
                            lineHeight: 1,
                            cursor: 'pointer',
                            borderRadius: 1,
                            p: 0.5,
                            border: 2,
                            borderColor: emoji === current ? 'primary.main' : 'transparent',
                            '&:hover': { bgcolor: 'action.hover' },
                        }}
                    >
                        {emoji}
                    </Box>
                ))}
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
    </Dialog>
);

// ── Add list dialog ────────────────────────────────────────────────────────────

interface AddListDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (name: string, icon: string) => void;
}

const AddListDialog: FC<AddListDialogProps> = ({ open, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('🐶');
    const [pickerOpen, setPickerOpen] = useState(false);

    const handleAdd = () => {
        if (!name.trim()) return;
        onAdd(name.trim(), icon);
        setName('');
        setIcon('🐶');
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
                <DialogTitle>New list</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        label="List name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        autoFocus
                        fullWidth
                        inputProps={{ maxLength: 40 }}
                        onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ fontSize: 36 }}>{icon}</Box>
                        <Button variant="outlined" size="small" onClick={() => setPickerOpen(true)}>
                            Change icon
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleAdd} disabled={!name.trim()}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
            <IconPicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={setIcon}
                current={icon}
            />
        </>
    );
};

// ── Main section ───────────────────────────────────────────────────────────────

const ShopSettingsSection: FC = () => {
    const [lists, setLists] = useAtom(shopListsAtom);
    const [addOpen, setAddOpen] = useState(false);

    const prefabs = lists.filter(l => l.prefab);
    const custom = lists.filter(l => !l.prefab);

    const handleToggle = (id: string, enabled: boolean) => {
        setLists(prev => setListEnabled(prev, id, enabled));
    };

    const handleAdd = (name: string, icon: string) => {
        setLists(prev => addCustomList(prev, name, icon));
    };

    const handleDelete = (id: string) => {
        setLists(prev => removeCustomList(prev, id));
    };

    return (
        <Box sx={{ p: 2, maxWidth: 480 }}>
            {/* ── Prefab lists ── */}
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Built-in lists
            </Typography>
            <List disablePadding dense>
                {prefabs.map(list => {
                    const isCart = list.id === PrefabListIds.Cart;
                    return (
                        <ListItem key={list.id} disableGutters>
                            <ListItemIcon sx={{ minWidth: 36, fontSize: 22 }}>
                                {list.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={list.name}
                                secondary={isCart ? 'Always enabled' : undefined}
                            />
                            {isCart ? (
                                <Tooltip title="Cart is always enabled">
                                    <span>
                                        <Checkbox checked disabled />
                                    </span>
                                </Tooltip>
                            ) : (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={list.enabled}
                                            onChange={e => handleToggle(list.id, e.target.checked)}
                                        />
                                    }
                                    label=""
                                    sx={{ m: 0 }}
                                />
                            )}
                        </ListItem>
                    );
                })}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* ── Custom lists ── */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                    My pet lists
                </Typography>
                <Button
                    size="small"
                    startIcon={<AddRoundedIcon />}
                    onClick={() => setAddOpen(true)}
                >
                    New list
                </Button>
            </Box>

            {custom.length === 0 ? (
                <Typography variant="body2" color="text.disabled" sx={{ py: 1 }}>
                    No custom lists yet. Create one for each of your pets!
                </Typography>
            ) : (
                <List disablePadding dense>
                    {custom.map(list => (
                        <ListItem
                            key={list.id}
                            disableGutters
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    size="small"
                                    aria-label={`Delete ${list.name}`}
                                    onClick={() => handleDelete(list.id)}
                                >
                                    <DeleteRoundedIcon fontSize="small" />
                                </IconButton>
                            }
                        >
                            <ListItemIcon sx={{ minWidth: 36, fontSize: 22 }}>
                                {list.icon}
                            </ListItemIcon>
                            <ListItemText primary={list.name} />
                            <Chip label="custom" size="small" sx={{ mr: 1, fontSize: 10 }} />
                        </ListItem>
                    ))}
                </List>
            )}

            <AddListDialog
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onAdd={handleAdd}
            />
        </Box>
    );
};

export default ShopSettingsSection;
