import { useState } from "react";

export default function useInputBinding(startValue: string) {

    const [value, setValue] = useState(startValue);

    return { value: value, onChange: (e: any) => setValue(e.target.value) }
}