import './TextInput.scss'
import { InputHTMLAttributes } from "react"

type TextInput = InputHTMLAttributes<HTMLInputElement>;

export default function TextInput(props: TextInput) {    
    return (
        <input className="TextInput" type="text" {...props} />
    )
}