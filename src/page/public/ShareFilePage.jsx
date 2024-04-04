import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { CheckFileShareLinkRequest } from "../../api/publicApi";
import { sendAlert } from "../../app/alertSlice";
import { doDownload } from "../../app/utils";
import { ALERTCODE_ERR, ALERTCODE_SUC } from "../component/AlertMe";
import Loading from "../component/Loading";
import UserLayout from "../component/UserLayout";
import "./SharePage.css";

export default function ShareFilePage() {
    let { linkKey } = useParams()
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const goRead = () => {
        setLoading(true)
        if (linkKey === undefined || linkKey === "") {
            dispatch(sendAlert({ code: ALERTCODE_ERR, msg: "parameter error" }))
        }

        CheckFileShareLinkRequest(linkKey)
            .then(response => {
                dispatch(sendAlert({ code: ALERTCODE_SUC, msg: "Download begin" }))
                doDownload(response)
            }).finally(() => {
                setLoading(false)
            })
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