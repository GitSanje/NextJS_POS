import { useFormStatus } from "react-dom"
import Button from "./Button"


interface Props{
    title : string
}

const ActionButton: React.FC<Props> = (props) => {
    const { title } = props

    const { pending } = useFormStatus()
  return (
    <>

<Button
    aria-disabled={pending}
    type='submit'
    className="w-full bg-indigo-500 text-white py-2 rounded-lg ">
       {pending ? 'Submitting...' : title}
    </Button>
    </>
  )
}

export default ActionButton
