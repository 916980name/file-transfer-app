import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { CheckMessageShareLinkRequest } from "../../api/publicApi";
import { sendAlert } from "../../app/alertSlice";
import { ALERTCODE_ERR, ALERTCODE_SUC } from "../component/AlertMe";
import Loading from "../component/Loading";
import UserLayout from "../component/UserLayout";
import "./SharePage.css";

export default function ShareMessagePage() {
    let { linkKey } = useParams()
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [data, setData] = useState("")

    const goRead = () => {
        setLoading(true)
        if (linkKey === undefined || linkKey === "") {
            dispatch(sendAlert({ code: ALERTCODE_ERR, msg: "parameter error" }))
        }

        CheckMessageShareLinkRequest(linkKey)
            .then(res => {
                dispatch(sendAlert({ code: ALERTCODE_SUC, msg: "read success"}))
                setData(res.data)
            }).catch(err => {
                let data = ''
                try {
                    data = err.message || "Failed";
                } finally {
                    dispatch(sendAlert({ code: ALERTCODE_ERR, msg: data }))
                }
            }).finally(() => {
                setLoading(false)
            })
    }

    return (
        <UserLayout>
            {loading && <Loading />}
            {!loading &&
                <div className="container">
                    {data === "" &&
                        <button className="button-75" onClick={goRead}>
                            <span className="text">
                                Read Message
                            </span>
                        </button>
                    }
                    {data !== "" &&
                        <div className="textarea-90-parent">
                        <textarea className="textarea-90" readOnly value={data}></textarea>
                        </div>
                    }
                </div>
            }
        </UserLayout>
    )
}