import axios from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendAlert } from "../app/alertSlice";
import { selectUserToken } from '../app/user/userSlice';
import { ALERTCODE_ERR } from '../page/component/AlertMe';

function useRequest(context) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector(selectUserToken)

    const instance = axios.create({
        // timeout: 5000
    });

    instance.interceptors.request.use(config => {
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    });

    instance.interceptors.response.use(
        res => {
            setData(res.data);
            setLoading(false);
        },
        err => {
            setError(error);
            setLoading(false);
            let data = ''
            try {
                if (err.response.status === 403) {
                    dispatch(sendAlert({ code: ALERTCODE_ERR, msg: 'Please login again' }))
                    setTimeout(() => {
                        navigate("/login")
                    }, 1500)
                    return;
                }
                data = err.response.data;
            } catch (e) {
                data = err;
            } finally {
                dispatch(sendAlert({ code: ALERTCODE_ERR, msg: data.message }))
            }
        }
    );

    instance(context);

    return [data, loading, error];
}

export default useRequest;