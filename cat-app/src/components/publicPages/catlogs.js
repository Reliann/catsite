import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useState } from "react"


const CatLogs = (props)=>{
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    if(!props.cat.logs.length){
        return <Box sx={{marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'}}>
            
            <Typography variant="body2">No Logs Yet... be the first!</Typography>
        </Box>
    }
    return (
        
      <Paper sx={{ width: '100%' , mt:8}}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader >
            <TableHead >
              <TableRow >
                <TableCell align="center"  sx={{backgroundColor:"secondary.light"}}>
                    Feed Time
                </TableCell>
                <TableCell align="center" sx={{backgroundColor:"secondary.light"}}>
                    Amount
                </TableCell>
                <TableCell align="center" sx={{backgroundColor:"secondary.light"}}>
                    Comment
                </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.cat.logs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log,index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell align="center">
                            {log.feed_time.split('+')[0].replaceAll('-',"/",).slice(0,-3).replace('T'," ")}
                        </TableCell>
                        <TableCell align="center">
                            {log.amount}
                        </TableCell>
                        <TableCell align="center">
                            {log.comment}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={props.cat.logs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
}
export default CatLogs