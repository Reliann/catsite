import { createTheme} from '@mui/material/styles';
import { deepPurple, purple} from '@mui/material/colors';



const theme = createTheme({
    palette: {
        background: {
            default: '#bfdbd6'
        },
        primary:deepPurple,
        secondary: purple,
        
    },
    
    typography: {
            h1:{
                fontFamily: 'Courier New',
            },
            h2:{
                fontFamily: 'Courier New',
            },
            h3:{
                fontFamily: 'Courier New',
            },
        }
});
export default theme