import { useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { Form, Submit, Controller } from '@redwoodjs/forms'

import TextField from 'src/components/TextField/TextField'

class Board {
  width: number
  length: number
  thickness: number
  quantity: number
  description: string

  constructor(public id: string) {}
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const TableHeader = () => {
  return (
    <TableRow>
      <TableCell align="center">Width</TableCell>
      <TableCell align="center">Length</TableCell>
      <TableCell align="center">Thickness</TableCell>
      <TableCell align="center">Quantity</TableCell>
      <TableCell align="center">Description</TableCell>
      <TableCell> </TableCell>
    </TableRow>
  )
}

const TableDataRow = ({ id, addRow, deleteRow, isLastRow }) => {
  return (
    <StyledTableRow>
      <StyledTableCell align="center">
        <TextField name={`${id}-width`} />
      </StyledTableCell>
      <StyledTableCell align="center">
        <TextField name={`${id}-length`} />
      </StyledTableCell>
      <StyledTableCell align="center">
        <TextField name={`${id}-thickness`} />
      </StyledTableCell>
      <StyledTableCell align="center">
        <TextField name={`${id}-quantity`} type="number" />
      </StyledTableCell>
      <StyledTableCell align="center">
        <TextField name={`${id}-description`} />
      </StyledTableCell>
      <StyledTableCell align="left">
        <IconButton onClick={() => deleteRow(id)}>
          <RemoveIcon />
        </IconButton>
        {isLastRow ? (
          <IconButton onClick={() => addRow()}>
            <AddIcon />
          </IconButton>
        ) : null}
      </StyledTableCell>
    </StyledTableRow>
  )
}

const Cutlist = () => {
  const [roughRowIdCounter, setRoughRowIdCounter] = useState(3)
  const [finishedRowIdCounter, setFinishedRowIdCounter] = useState(5)
  const [roughRows, setRoughRows] = useState(
    [...Array(roughRowIdCounter)].map((_, i) => new Board(`rough-${i}`))
  )
  const [finishedRows, setFinishedRows] = useState(
    [...Array(finishedRowIdCounter)].map((_, i) => new Board(`finished-${i}`))
  )

  const addRoughRow = () => {
    setRoughRows([...roughRows, new Board(`rough-${roughRowIdCounter}`)])
    setRoughRowIdCounter(roughRowIdCounter + 1)
  }

  const addFinishedRow = () => {
    setFinishedRows([
      ...finishedRows,
      new Board(`finished-${finishedRowIdCounter}`),
    ])
    setFinishedRowIdCounter(finishedRowIdCounter + 1)
  }

  const deleteRoughRow = (id: string) => {
    if (roughRows.length > 1) {
      setRoughRows(roughRows.filter((row: Board) => row.id !== id))
    }
  }

  const deleteFinishedRow = (id: string) => {
    if (finishedRows.length > 1) {
      setFinishedRows(finishedRows.filter((row: Board) => row.id !== id))
    }
  }

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <Form onSubmit={onSubmit}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell colSpan={6}>Rough Stock</StyledTableCell>
            </TableRow>
            <TableHeader />
          </TableHead>
          <TableBody>
            {roughRows.map((board) => (
              <TableDataRow
                key={board.id}
                id={board.id}
                addRow={addRoughRow}
                deleteRow={deleteRoughRow}
                isLastRow={board.id === roughRows.at(-1).id}
              />
            ))}
          </TableBody>
          <TableHead>
            <TableRow>
              <StyledTableCell colSpan={6}>Finished Pieces</StyledTableCell>
            </TableRow>
            <TableHeader />
          </TableHead>
          <TableBody>
            {finishedRows.map((board) => (
              <TableDataRow
                key={board.id}
                id={board.id}
                addRow={addFinishedRow}
                deleteRow={deleteFinishedRow}
                isLastRow={board.id === finishedRows.at(-1).id}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Submit>Calculate</Submit>
    </Form>
  )
}

export default Cutlist
