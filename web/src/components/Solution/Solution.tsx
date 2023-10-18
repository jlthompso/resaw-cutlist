import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

function Row(props: { row }) {
  const { row } = props
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{row.dimensions[0]}</TableCell>
        <TableCell align="center">{row.dimensions[1]}</TableCell>
        <TableCell align="center">{row.dimensions[2]}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Location</TableCell>
                    <TableCell align="center">Width</TableCell>
                    <TableCell align="center">Length</TableCell>
                    <TableCell align="center">Thickness</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.children.map((finishedBoard, i) => (
                    <TableRow key={`finished-${i}`}>
                      <TableCell align="center" component="th" scope="row">
                        {`(${finishedBoard.origin[0]}, ${finishedBoard.origin[1]}, ${finishedBoard.origin[2]})`}
                      </TableCell>
                      <TableCell align="center">
                        {finishedBoard.dimensions[0]}
                      </TableCell>
                      <TableCell align="center">
                        {finishedBoard.dimensions[1]}
                      </TableCell>
                      <TableCell align="center">
                        {finishedBoard.dimensions[2]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const Solution = ({ data }) => {
  console.log(data)
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="center">Width</TableCell>
            <TableCell align="center">Length</TableCell>
            <TableCell align="center">Thickness</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <Row key={`rough-${i}`} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Solution
