export const currentStatus={
    REQUESTED:"REQUESTED",
    PICKED:"PICKED",
    IN_TRANSIT:"IN_TRANSIT",
    DELIVERED:"DELIVERED",
    CANCELLED:"CANCELLED",
    
} as const;

export type TCurrentStatus = typeof currentStatus[keyof typeof currentStatus];
