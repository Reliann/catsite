import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loading() {
    return (
    <Box position ="fixed" bottom="60px" right="60px" sx={{ display: 'flex' }}>
        <CircularProgress />
    </Box>
    );
}
