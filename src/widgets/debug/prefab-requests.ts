export interface BuddyPrefabRequest {
    id: string;
    label: string;
    message: string;
    category: 'cart' | 'autoship' | 'pickup' | 'buckets' | 'pet-care' | 'agent';
}

export const BUDDY_PREFAB_REQUESTS: BuddyPrefabRequest[] = [
    {
        id: 'open-cart',
        label: 'Open cart',
        message: 'open cart',
        category: 'cart',
    },
    {
        id: 'open-autoship',
        label: 'Open autoship',
        message: 'open autoship',
        category: 'autoship',
    },
    {
        id: 'add-toy-to-cart',
        label: 'Add a toy to the cart',
        message: 'add a toy to the cart',
        category: 'cart',
    },
    {
        id: 'add-dog-food-to-cart',
        label: 'Add dog food to the cart',
        message: 'add dog food to the cart',
        category: 'cart',
    },
    {
        id: 'clean-cart',
        label: 'Clean the cart',
        message: 'clean the cart',
        category: 'cart',
    },
    {
        id: 'pickup-dog-food',
        label: 'Pickup workflow for dog food',
        message: 'I want pickup in my area for dog food',
        category: 'pickup',
    },
    {
        id: 'autoship-schedule',
        label: 'Setup autoship schedule',
        message: 'set up autoship every 2 weeks for dog food',
        category: 'autoship',
    },
    {
        id: 'create-pet-bucket',
        label: 'Create bucket for pet',
        message: 'create a bucket for Luna with a dog icon',
        category: 'buckets',
    },
    {
        id: 'open-need-bucket',
        label: 'Open need bucket',
        message: 'open my need bucket',
        category: 'buckets',
    },
    {
        id: 'pet-care-advice',
        label: 'Pet care advice',
        message: 'my dog has dry skin, what food ingredients should I avoid?',
        category: 'pet-care',
    },
    {
        id: 'dual-workflow',
        label: 'Open cart and autoship',
        message: 'open cart and autoship',
        category: 'agent',
    },
];

export const BUDDY_PREFAB_REQUEST_MESSAGES: string[] = BUDDY_PREFAB_REQUESTS.map(
    (request) => request.message
);
