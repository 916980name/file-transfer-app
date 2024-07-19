import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { sendAlert } from "../../app/alertSlice";
import { ALERTCODE_ERR, ALERTCODE_SUC } from "../component/AlertMe";
import Loading from "../component/Loading";
import UserLayout from "../component/UserLayout";
import "./SharePage.css";

export default function ShareFilePage() {
    let { linkKey } = useParams()
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const goRead = (event) => {
        setLoading(true)
        if (linkKey === undefined || linkKey === "") {
            dispatch(sendAlert({ code: ALERTCODE_ERR, msg: "parameter error" }))
            setLoading(false)
            event.preventDefault();
            return;
        }

        const link = document.createElement('a');
        link.href = process.env.REACT_APP_API_ENDPOINT + process.env.REACT_APP_API_PATH + "/fs/" + linkKey;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        dispatch(sendAlert({ code: ALERTCODE_SUC, msg: "Download begin" }))
        setLoading(false)
    }

    return (
        <UserLayout>
            {loading && <Loading />}
            {!loading &&
                <div className="container">
                    <button className="button-75" onClick={goRead}>
                        <span className="text">
                            Retrieve File
                        </span>
                    </button>
                </div>
            }
        </UserLayout>
    )
}