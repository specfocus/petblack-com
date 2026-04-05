'use client';

/**
 * Cart Widget — Checkout Wizard
 *
 * Step 1: Cart review
 * Step 2: Delivery method + address
 * Step 3: Payment method
 * Step 4: Order review + Place Order
 * Step 5: Confirmation
 */

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { isToggleEntry, noopToggleAtom, ToggleAtom } from '@specfocus/atoms/lib/toggle';
import workspaceTreeAtom from '@specfocus/atoms/lib/workspace';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { WidgetProps } from '@specfocus/shelly/lib/widgets/widget';
import Widget from '@specfocus/shelly/lib/widgets/widget';
import { useAtom, useAtomValue, useSetAtom } from '@specfocus/atoms/lib/hooks';
import { type FC, useMemo, useState } from 'react';
import { PrefabBucketNames } from '@/dialogs/settings/sections/shop/domain/types';
import shopSnapshotBucketsAtom from '@/atoms/shop-snapshot-buckets-atom';
import shopActorAtom from '@/atoms/shop-actor-atom';
import { ShopEventTypes } from '@/machines/shop/shop-event-types';
import { CART_OPEN_TOGGLE_PATH, CART_SHOW_TOGGLE_PATH } from './cart-widget-path';

const STEPS = ['Cart', 'Delivery', 'Payment', 'Review', 'Confirmation'];

// ── Step 1: Cart ───────────────────────────────────────────────────────────────

const StepCart: FC<{ onNext: () => void; }> = ({ onNext }) => {
    const buckets = useAtomValue(shopSnapshotBucketsAtom);
    const sendShopEvent = useSetAtom(shopActorAtom);
    const cart = buckets.find(l => l.id === PrefabBucketNames.Cart);
    const items = cart?.items ?? [];

    return (
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {items.length === 0 ? (
                <Typography variant="body2" color="text.disabled" sx={{ py: 4, textAlign: 'center' }}>
                    Your cart is empty
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pb: 1 }}>
                    {items.map(item => (
                        <Box key={item.sku} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Button
                                    size="small"
                                    sx={{ minWidth: 24, px: 0 }}
                                    onClick={() => sendShopEvent({
                                        type: ShopEventTypes.UpdateItemQty,
                                        bucketName: PrefabBucketNames.Cart,
                                        sku: item.sku,
                                        qty: item.qty - 1,
                                    })}
                                >
                                    −
                                </Button>
                                <Typography variant="body2">{item.qty}</Typography>
                                <Button
                                    size="small"
                                    sx={{ minWidth: 24, px: 0 }}
                                    onClick={() => sendShopEvent({
                                        type: ShopEventTypes.UpdateItemQty,
                                        bucketName: PrefabBucketNames.Cart,
                                        sku: item.sku,
                                        qty: item.qty + 1,
                                    })}
                                >
                                    +
                                </Button>
                            </Box>
                            <Button
                                size="small"
                                color="error"
                                sx={{ minWidth: 0, px: 0.5 }}
                                onClick={() => sendShopEvent({
                                    type: ShopEventTypes.RemoveItem,
                                    bucketName: PrefabBucketNames.Cart,
                                    sku: item.sku,
                                })}
                            >
                                <CloseRoundedIcon fontSize="small" />
                            </Button>
                        </Box>
                    ))}
                </Box>
            )}
            <Button variant="contained" fullWidth onClick={onNext} disabled={items.length === 0} sx={{ mt: 2 }}>
                Continue to Delivery
            </Button>
        </Box>
    );
};

// ── Step 2: Delivery ───────────────────────────────────────────────────────────

const StepDelivery: FC<{ onNext: () => void; onBack: () => void; }> = ({ onNext, onBack }) => {
    const [speed, setSpeed] = useState('standard');
    return (
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Typography variant="subtitle2" gutterBottom>Delivery speed</Typography>
            <RadioGroup value={speed} onChange={e => setSpeed(e.target.value)}>
                <FormControlLabel value="standard" control={<Radio size="small" />} label="Standard (5–7 days) — Free" />
                <FormControlLabel value="express" control={<Radio size="small" />} label="Express (2–3 days) — $9.99" />
                <FormControlLabel value="same-day" control={<Radio size="small" />} label="Same Day — $19.99" />
            </RadioGroup>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="subtitle2" gutterBottom>Delivery address</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField size="small" label="Full name" fullWidth />
                <TextField size="small" label="Street address" fullWidth />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField size="small" label="City" sx={{ flex: 1 }} />
                    <TextField size="small" label="State" sx={{ width: 80 }} />
                    <TextField size="small" label="ZIP" sx={{ width: 100 }} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button variant="outlined" fullWidth onClick={onBack}>Back</Button>
                <Button variant="contained" fullWidth onClick={onNext}>Continue</Button>
            </Box>
        </Box>
    );
};

// ── Step 3: Payment ────────────────────────────────────────────────────────────

const StepPayment: FC<{ onNext: () => void; onBack: () => void; }> = ({ onNext, onBack }) => {
    const [method, setMethod] = useState('card');
    return (
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <RadioGroup value={method} onChange={e => setMethod(e.target.value)}>
                <FormControlLabel value="card" control={<Radio size="small" />} label="Credit / Debit card" />
                <FormControlLabel value="paypal" control={<Radio size="small" />} label="PayPal" />
                <FormControlLabel value="apple" control={<Radio size="small" />} label="Apple Pay" />
            </RadioGroup>
            {method === 'card' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1.5 }}>
                    <TextField size="small" label="Card number" fullWidth inputProps={{ maxLength: 19 }} />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField size="small" label="MM / YY" sx={{ flex: 1 }} />
                        <TextField size="small" label="CVV" sx={{ width: 80 }} />
                    </Box>
                    <TextField size="small" label="Name on card" fullWidth />
                </Box>
            )}
            {method !== 'card' && (
                <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        You will be redirected to {method === 'paypal' ? 'PayPal' : 'Apple Pay'} to complete payment.
                    </Typography>
                </Box>
            )}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button variant="outlined" fullWidth onClick={onBack}>Back</Button>
                <Button variant="contained" fullWidth onClick={onNext}>Review Order</Button>
            </Box>
        </Box>
    );
};

// ── Step 4: Review ─────────────────────────────────────────────────────────────

const StepReview: FC<{ onNext: () => void; onBack: () => void; }> = ({ onNext, onBack }) => {
    const buckets = useAtomValue(shopSnapshotBucketsAtom);
    const items = buckets.find(l => l.id === PrefabBucketNames.Cart)?.items ?? [];
    return (
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Typography variant="subtitle2" gutterBottom>Order summary</Typography>
            {items.map(item => (
                <Box key={item.sku} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">× {item.qty}</Typography>
                </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2">Total</Typography>
                <Typography variant="subtitle2">—</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button variant="outlined" fullWidth onClick={onBack}>Back</Button>
                <Button variant="contained" color="success" fullWidth onClick={onNext}>Place Order</Button>
            </Box>
        </Box>
    );
};

// ── Step 5: Confirmation ───────────────────────────────────────────────────────

const StepConfirmation: FC<{ onClose: () => void; }> = ({ onClose }) => (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, py: 3 }}>
        <Typography sx={{ fontSize: 48 }}>🎉</Typography>
        <Typography variant="h6" fontWeight={700}>Order placed!</Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
            Your order has been received. You will get a confirmation email shortly.
        </Typography>
        <Chip label={`Order #PB-${Math.floor(Math.random() * 900000 + 100000)}`} color="success" />
        <Button variant="contained" onClick={onClose} sx={{ mt: 1 }}>
            Done
        </Button>
    </Box>
);

// ── Main widget ────────────────────────────────────────────────────────────────

const fallbackCartOpenAtom: ToggleAtom = noopToggleAtom;
const fallbackCartShowAtom: ToggleAtom = noopToggleAtom;

const CartWidget: FC = () => {
    const cartOpenToggleEntry = useAtomValue(workspaceTreeAtom(CART_OPEN_TOGGLE_PATH));
    const cartShowToggleEntry = useAtomValue(workspaceTreeAtom(CART_SHOW_TOGGLE_PATH));
    const cartOpenAtom = isToggleEntry(cartOpenToggleEntry) ? cartOpenToggleEntry.atom : fallbackCartOpenAtom;
    const cartShowAtom = isToggleEntry(cartShowToggleEntry) ? cartShowToggleEntry.atom : fallbackCartShowAtom;
    const [isOpen, setIsOpen] = useAtom(cartOpenAtom as never);
    const [step, setStep] = useState(0);
    const buckets = useAtomValue(shopSnapshotBucketsAtom);
    const cartItemCount = useMemo(
        () => (buckets.find((bucket) => bucket.id === PrefabBucketNames.Cart)?.items ?? []).reduce((sum, item) => sum + item.qty, 0),
        [buckets]
    );

    const handleClose = () => { setIsOpen(false); setStep(0); };

    return (
        <Widget
            openAtom={cartShowAtom}
            defaultCorner="bottom-right"
            sx={isOpen ? undefined : { overflow: 'visible', background: 'transparent', boxShadow: 'none' }}
        >
            {isOpen ? (
                <Paper
                    elevation={12}
                    sx={{
                        width: { xs: 'calc(100vw - 24px)', sm: 400 },
                        maxHeight: { xs: 'calc(100vh - 24px)', sm: 600 },
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <Box sx={{ px: 2, pt: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                            <Typography variant="subtitle1" fontWeight={700}>🛒 Cart</Typography>
                            <IconButton size="small" onClick={handleClose}>
                                <CloseRoundedIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        {step < STEPS.length - 1 && (
                            <Stepper activeStep={step} alternativeLabel sx={{ '& .MuiStepLabel-label': { fontSize: 10 } }}>
                                {STEPS.slice(0, -1).map(label => (
                                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                                ))}
                            </Stepper>
                        )}
                        <LinearProgress variant="determinate" value={(step / (STEPS.length - 1)) * 100} sx={{ mt: 1, borderRadius: 1 }} />
                    </Box>

                    {/* Step content */}
                    <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5, display: 'flex', flexDirection: 'column' }}>
                        {step === 0 && <StepCart onNext={() => setStep(1)} />}
                        {step === 1 && <StepDelivery onNext={() => setStep(2)} onBack={() => setStep(0)} />}
                        {step === 2 && <StepPayment onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                        {step === 3 && <StepReview onNext={() => setStep(4)} onBack={() => setStep(2)} />}
                        {step === 4 && <StepConfirmation onClose={handleClose} />}
                    </Box>
                </Paper>
            ) : (
                <IconButton
                    aria-label="Open Cart"
                    onClick={() => setIsOpen(true)}
                    sx={{ width: 52, height: 52, bgcolor: 'primary.main', color: 'primary.contrastText', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', '&:hover': { bgcolor: 'primary.dark' } }}
                >
                    <ShoppingCartRoundedIcon sx={{ fontSize: 24 }} />
                    {cartItemCount > 0 && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                minWidth: 20,
                                height: 20,
                                borderRadius: '999px',
                                px: 0.5,
                                bgcolor: 'error.main',
                                color: 'error.contrastText',
                                fontSize: 11,
                                display: 'grid',
                                placeItems: 'center',
                                fontWeight: 700,
                            }}
                        >
                            {cartItemCount}
                        </Box>
                    )}
                </IconButton>
            )}
        </Widget>
    );
};

export default CartWidget;
