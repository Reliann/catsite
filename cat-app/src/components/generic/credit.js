import { Typography, Link, Box } from "@mui/material"
const Credit = ()=>{
    return <Box style={{margin:"40px"}}>
        <Typography variant="body2" color="text.secondary" align="center">
      <span role="img" aria-label="heart">Made with ❤️ for my cat Gary</span>
      <br/>
      <Link color="inherit" href="https://github.com/Reliann">
        @Rell
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
    </Box>
}

export default Credit
