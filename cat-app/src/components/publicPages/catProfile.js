import { Avatar, Typography } from "@mui/material"

import { Box } from "@mui/system"
import { Link } from "@mui/material"

const CatProfile = (props)=>{
    //const [expanded, setExpanded] = useState(false)
    return <Box sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        }}>
        <Avatar sx={{ width: 200, height: 200 }} 
            alt={props.cat.name} 
            src={props.cat.image || "https://res.cloudinary.com/catlogs/image/upload/v1641214316/media/images/cat_avatar_placeholder.png"}/>
        <Typography variant="h3">{props.cat.cat_name}</Typography>
        <Typography varuant="body2">Owner: <Link href = {`#/users/${props.cat.owner}`}>{props.cat.owner}</Link></Typography>
    </Box>
}

export default CatProfile