 /* eslint-disable @typescript-eslint/no-explicit-any */
export const getErrorMessage = (error: any) => {
        if (!error) return null;
        
        // Axios error structure
        if (error.data) {
            return error.data.message || error.data.error || 'An error occurred';
        }
        
        // Other error formats
        if (error.message) {
            return error.message;
        }
        
        return 'An error occurred';
    };