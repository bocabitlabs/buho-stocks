import React, { ReactElement } from 'react'
import RegisterForm from './components/RegisterForm'

interface Props {

}

export default function Register({}: Props): ReactElement {
  return (
    <div>Register:
      <RegisterForm/>
    </div>
  )
}
