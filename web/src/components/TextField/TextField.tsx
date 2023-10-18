import MuiTextField from '@mui/material/TextField'
import type { StandardTextFieldProps } from '@mui/material/TextField'

import { Controller, RegisterOptions, useErrorStyles } from '@redwoodjs/forms'

interface Props extends StandardTextFieldProps {
  validation?: RegisterOptions
  errorClassName?: string
}

const TextField = (props: Props) => {
  const {
    name,
    className,
    errorClassName,
    defaultValue,
    validation,
    style,
    ...propsRest
  } = props

  const { className: componentClassName, style: componentStyle } =
    useErrorStyles({
      className: className,
      errorClassName: errorClassName,
      name: name,
    })

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      rules={validation}
      render={({ field: { onChange, onBlur, value, name, ref } }) => (
        <MuiTextField
          {...propsRest}
          variant="standard"
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
          name={name}
          className={componentClassName}
          style={{ ...componentStyle, ...style }}
        />
      )}
    />
  )
}

export default TextField
