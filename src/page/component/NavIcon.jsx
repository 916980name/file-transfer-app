import { Col, Row } from "react-bootstrap";
import './NavIcon.css';

export default function NavIcon(props) {
    const {onClick, src, srcColor, text, ownPath, currentPath} = props;

    return (
        <div onClick={onClick}>
            <Row>
                <Col className="d-flex justify-content-center align-items-center">
                    {currentPath === ownPath && <img className='imageicon' src={srcColor} alt=''></img>}
                    {currentPath !== ownPath && <img className='imageicon' src={src} alt=''></img>}
                </Col>
            </Row>
            <Row>
                <Col className="d-flex justify-content-center align-items-center">
                    {currentPath === ownPath && <span className='icontext-color'>{text}</span>}
                    {currentPath !== ownPath && <span className='icontext'>{text}</span>}
                </Col>
            </Row>
        </div>
    )
}