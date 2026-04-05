'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAtomValue, useSetAtom } from '@specfocus/atoms/lib/hooks';
import { ToggleVariants } from '@specfocus/atoms/lib/toggle';
import { Sizes } from '@specfocus/atoms/lib/workspace';
import WorkspaceToggle from '@specfocus/shelly/lib/components/toggle';
import { type FC, useState } from 'react';
import { PET_ICONS, PrefabListIds } from '../domain/types';
import shopSnapshotListsAtom from '@/atoms/shop-snapshot-lists-atom';
import shopActorAtom from '@/atoms/shop-actor-atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import { CART_SHOW_TOGGLE_PATH } from '@/widgets/cart/cart-path';
import { getShopListShowTogglePath } from '@/widgets/list/shop-list-widget-registry';

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
                <DialogTitle>New bucket</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        label="Bucket name"
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
    const lists = useAtomValue(shopSnapshotListsAtom);
    const sendShopEvent = useSetAtom(shopActorAtom);
    const [addOpen, setAddOpen] = useState(false);

    const prefabs = lists.filter(l => l.prefab);
    const custom = lists.filter(l => !l.prefab);

    const handleAdd = (name: string, icon: string) => {
        sendShopEvent({
            type: ShopEventTypes.CreateCustomList,
            name,
            icon,
        } as never);
    };

    const handleDelete = (id: string) => {
        sendShopEvent({
            type: ShopEventTypes.RemoveCustomList,
            id,
        } as never);
    };

    return (
        <Box sx={{ p: 2, maxWidth: 480 }}>
            {/* ── Prefab lists ── */}
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Built-in buckets
            </Typography>
            <List disablePadding dense>
                {prefabs.map(list => (
                    <ListItem key={list.id} disableGutters>
                        <ListItemIcon sx={{ minWidth: 36, fontSize: 22 }}>
                            {list.icon}
                        </ListItemIcon>
                        <ListItemText primary={list.name} />
                        <WorkspaceToggle
                            path={list.id === PrefabListIds.Cart ? CART_SHOW_TOGGLE_PATH : getShopListShowTogglePath(list.id)}
                            variant={ToggleVariants.Switch}
                            size={Sizes.Small}
                        />
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* ── Custom lists ── */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                    My pet buckets
                </Typography>
                <Button
                    size="small"
                    startIcon={<AddRoundedIcon />}
                    onClick={() => setAddOpen(true)}
                >
                    New bucket
                </Button>
            </Box>

            {custom.length === 0 ? (
                <Typography variant="body2" color="text.disabled" sx={{ py: 1 }}>
                    No custom buckets yet. Create one for each of your pets!
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
                            <WorkspaceToggle
                                path={getShopListShowTogglePath(list.id)}
                                variant={ToggleVariants.Switch}
                                size={Sizes.Small}
                            />
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
