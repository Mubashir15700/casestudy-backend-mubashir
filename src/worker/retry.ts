export function getBackoffMinutes(attempts: number): number | null {
    switch (attempts) {
        case 1:
            return 1;
        case 2:
            return 5;
        case 3:
            return 30;
        default:
            return null;
    }
}
