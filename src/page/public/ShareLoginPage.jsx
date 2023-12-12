import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CheckShareLinkRequest } from "../../api/publicApi";
import { sendAlert } from "../../app/alertSlice";
import { PRIVILEGE_ADMIN, PRIVILEGE_USER } from "../../app/privileges";
import { loginSuc } from "../../app/user/userSlice";
import { ALERTCODE_ERR } from "../component/AlertMe";
import Loading from "../component/Loading";
import UserLayout from "../component/UserLayout";
import "./SharePage.css";

export default function ShareLoginPage() {
    let { linkKey } = useParams()
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const goLogin = () => {
        setLoading(true)
        if (linkKey === undefined || linkKey === "") {
            dispatch(sendAlert({ code: ALERTCODE_ERR, msg: "parameter error" }))
        }

        CheckShareLinkRequest(linkKey)
            .then(res => {
                const token = res.headers['authorization'];
                let data = res.data;
                data.token = token;
                dispatch(loginSuc(data))
                if (data.privileges.includes(PRIVILEGE_ADMIN)) {
                    navigate("/admin")
                } else if (data.privileges.includes(PRIVILEGE_USER)) {
                    navigate("/user")
                } else {
                    alert('not permitted')
                }
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
                    <button className="button-75" onClick={goLogin}>
                        <span className="text">
                            Confirm Login
                        </span>
                    </button>
                </div>
            }
        </UserLayout>
    )
}