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
import TextField from '@mui/material/TextField'
import { useForm, useFieldArray } from 'react-hook-form'

import { Form, Submit } from '@redwoodjs/forms'

import Render from 'src/components/Render/Render'
import Solution from 'src/components/Solution/Solution'

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

const TableDataRow = ({
  index,
  register,
  append,
  remove,
  numRows,
  fieldArrayName,
}) => {
  return (
    <StyledTableRow>
      <StyledTableCell align="center">
        <TextField
          variant="standard"
          {...register(`${fieldArrayName}.${index}.width`, {
            valueAsNumber: true,
          })}
        />
      </StyledTableCell>
      <StyledTableCell align="center">
        <TextField
          variant="standard"
          {...register(`${fieldArrayName}.${index}.length`, {
            valueAsNumber: true,
          })}
        />
      </StyledTableCell>
      <StyledTableCell align="center">
        <TextField
          variant="standard"
          {...register(`${fieldArrayName}.${index}.thickness`, {
            valueAsNumber: true,
          })}
        />
      </StyledTableCell>
      <StyledTableCell align="center">
        <TextField
          variant="standard"
          type="number"
          {...register(`${fieldArrayName}.${index}.qty`, {
            valueAsNumber: true,
          })}
        />
      </StyledTableCell>
      <StyledTableCell align="center">
        <TextField
          variant="standard"
          {...register(`${fieldArrayName}.${index}.description`)}
        />
      </StyledTableCell>
      <StyledTableCell align="left">
        {numRows > 1 ? (
          <IconButton onClick={() => remove(index)}>
            <RemoveIcon />
          </IconButton>
        ) : null}
        {index === numRows - 1 ? (
          <IconButton
            onClick={() =>
              append({
                width: null,
                length: null,
                thickness: null,
                quantity: null,
                description: null,
              })
            }
          >
            <AddIcon />
          </IconButton>
        ) : null}
      </StyledTableCell>
    </StyledTableRow>
  )
}

const Cutlist = () => {
  const [solution, setSolution] = useState([])

  const onSubmit = async (data) => {
    const roughStock = data.roughStock
      .map(({ description: _, ...keepAttrs }) => keepAttrs)
      .filter((board) => Object.values(board).every((val: number) => val > 0))
    const finishedBoards = data.finishedBoards
      .map(({ description: _, ...keepAttrs }) => keepAttrs)
      .filter((board) => Object.values(board).every((val: number) => val > 0))
    const response = await fetch(
      'http://localhost:8910/.redwood/functions/solveCutlist',
      {
        method: 'POST',
        body: JSON.stringify({ roughStock, finishedBoards }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    setSolution(await response.json())
  }

  const { register, control, handleSubmit, reset, trigger, setError, watch } =
    useForm({
      defaultValues: {
        roughStock: Array(3).fill({
          width: null,
          length: null,
          thickness: null,
          qty: null,
          description: null,
        }),
        finishedBoards: Array(5).fill({
          width: null,
          length: null,
          thickness: null,
          qty: null,
          description: null,
        }),
      },
    })
  const {
    fields: roughStockFields,
    append: roughStockAppend,
    remove: roughStockRemove,
  } = useFieldArray({
    control,
    name: 'roughStock',
  })
  const {
    fields: finishedBoardsFields,
    append: finishedBoardsAppend,
    remove: finishedBoardsRemove,
  } = useFieldArray({
    control,
    name: 'finishedBoards',
  })

  // clear solution if input data changes
  watch((_, { name }) => {
    if (!name.includes('description')) {
      setSolution([])
    }
  })

  return (
    <>
      <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={6}>Rough Stock</StyledTableCell>
              </TableRow>
              <TableHeader />
            </TableHead>
            <TableBody>
              {roughStockFields.map((item, index) => (
                <TableDataRow
                  key={item.id}
                  index={index}
                  register={register}
                  append={roughStockAppend}
                  remove={roughStockRemove}
                  numRows={roughStockFields.length}
                  fieldArrayName="roughStock"
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
              {finishedBoardsFields.map((item, index) => (
                <TableDataRow
                  key={item.id}
                  index={index}
                  register={register}
                  append={finishedBoardsAppend}
                  remove={finishedBoardsRemove}
                  numRows={finishedBoardsFields.length}
                  fieldArrayName="finishedBoards"
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Submit>Calculate</Submit>
      </Form>
      {solution.length ? <Solution data={solution} /> : null}
      {solution.map((roughBoard, i) => (
        <Render
          key={'render-' + i}
          dimensions={roughBoard.dimensions}
          finishedBoards={roughBoard.children}
        />
      ))}
    </>
  )
}

export default Cutlist
