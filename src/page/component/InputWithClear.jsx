import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

const InputWithClear = React.forwardRef((props, ref) => {
    const { value, field, setFunc, password } = props;
    const [type, setType] = useState('text');
    const [showText, setShowText] = useState(false);

    const onChange = (value) => {
        setFunc(prevState => ({
            ...prevState,
            [field]: value
        }))
    }

    useEffect(() => {
        if (password) {
            if (showText) {
                setType('text')
            } else {
                setType('password')
            }
        }
    }, [password, showText])

    const showOrHide = () => {
        setShowText(!showText)
    }

    return (
        <InputGroup>
            <Form.Control type={type} value={value}
                onChange={e => onChange(e.target.value)} />
            <Button style={{ color: '#bfbfbf' }} variant="light" size="sm"
                onClick={() => {
                    onChange('')
                }}>&#10006;</Button>
            {password && !showText &&
                <Button variant="light" size="sm"
                    onClick={showOrHide}>
                    <img style={{ width: '25px', height: '25px', marginLeft: '5px', marginRight: '5px' }}
                        src="/public-static/icons8-eye-close.png" alt="" />
                </Button>
            }
            {password && showText &&
                <Button variant="light" size="sm"
                    onClick={showOrHide}>
                    <img style={{ width: '25px', height: '25px', marginLeft: '5px', marginRight: '5px' }}
                        src="/public-static/icons8-eye-open.png" alt="" />
                </Button>
            }
        </InputGroup>
    );
})

export default InputWithClear;