import { Form, Label, TextField, Submit, FieldError } from '@redwoodjs/forms'

const Cutlist = () => {
  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <Form onSubmit={onSubmit}>
      <Label name="name" className="label" errorClassName="label error" />
      <TextField
        name="name"
        className="input"
        errorClassName="input error"
        validation={{ required: true }}
      />
      <FieldError name="name" className="error-message" />

      <Submit>Calculate</Submit>
    </Form>
  )
}

export default Cutlist
