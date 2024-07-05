import { useEffect, useState } from "react";
import './ProgressBar.css';

export default function ProgressBar(props) {
    const { percent } = props;
    const [progress, setProgress] = useState(percent);
    useEffect(() => {
        setProgress(`${percent}%`);
    }, [percent])

    return (
        <div>
            <div className="progress-bar">
                <div className="inner-progress" style={{ width: progress }}> </div>
                <div className="text"><span> {progress} </span></div>
            </div>
        </div>
    )
}