import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, DropdownButton, Form, Row } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { userPageRequest, userUpdateState } from "../../api/adminApi";
import { dispatchAlertError, dispatchAlertSuc } from "../../app/godispatch";
import { makeid } from "../../app/utils";
import AdminLayout from "../component/AdminLayout";
import InputWithClear from "../component/InputWithClear";
import Loading from "../component/Loading";
import ShowPagination from "../component/ShowPagination";
import AddUserPage from "./AddUserPage";
import './AdminUserPage.css';

export default function AdminUserPage() {
    document.title = '用户管理'
    const [searchParam, setSearchParam] = useState({
        name: "",
        code: "",
        valid: null,
        pageNo: 0,
        pageSize: 10
    });
    const [currentSearchParam, setCurrentSearchParam] = useState()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const addUserPageRef = useRef(null)

    const search = (pageNo, newSearchParam) => {
        setLoading(true)
        if (!pageNo) {
            pageNo = 0;
        }
        let param
        if (newSearchParam) {
            param = { ...newSearchParam, pageNo: pageNo }
        } else {
            param = { ...currentSearchParam, pageNo: pageNo }
        }

        userPageRequest(param)
            .then(result => {
                if (result.data) {
                    setData(result.data)
                }
            })
            .catch(err => {
                dispatchAlertError(err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        clickSearch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const clickSearch = () => {
        setCurrentSearchParam({ ...searchParam })
        search(0, searchParam)
    }

    const userStateChange = (username, valid) => {
        let text = '是否确认' + (valid ? '启用 ' : '停用 ') + username + ' 用户？'
        if (window.confirm(text)) {
            setLoading(true)
            userUpdateState({ username, valid })
                .then(() => {
                    dispatchAlertSuc('更新成功')
                    search()
                })
                .catch(err => { dispatchAlertError(err.message) })
                .finally(() => setLoading(false))
        }
    }

    return (
        <AdminLayout>
            <Container fluid>
                <Row xs={3} md={6} className="searchArea">
                    <Col xs={4}>
                        <Form.Group>
                            <Form.Label>姓名</Form.Label>
                            <InputWithClear value={searchParam.name}
                                field='name'
                                setFunc={setSearchParam} />
                        </Form.Group>
                    </Col>
                    <Col xs={4}>
                        <Form.Group>
                            <Form.Label>用户名</Form.Label>
                            <InputWithClear value={searchParam.username}
                                field='username'
                                setFunc={setSearchParam} />
                        </Form.Group>
                    </Col>
                    <Col xs={4}>
                        <Form.Group>
                            <Form.Label>用户状态</Form.Label>
                            <Form.Select aria-label="Default select example"
                                onChange={e => setSearchParam(prevState => ({
                                    ...prevState,
                                    valid: e.target.value === "" ? null : e.target.value
                                }))}>
                                <option key={2} value={""}>所有</option>
                                <option key={0} value={true}>正常</option>
                                <option key={1} value={false}>停用</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col xs={4}>
                        <Form.Label>单页显示条数</Form.Label>
                        <Form.Select aria-label="select"
                            onChange={e => setSearchParam(prevState => ({
                                ...prevState,
                                pageSize: parseInt(e.target.value)
                            }))}>
                            <option key={10} value={10}>10</option>
                            <option key={20} value={20}>20</option>
                            <option key={50} value={50}>50</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className='d-flex justify-content-center align-items-center'>
                        <Button variant="warning" size="md" onClick={() => addUserPageRef.current.showMe()} disabled={loading}>新增用户</Button>
                    </Col>
                    <Col xs={4} className='d-flex justify-content-center align-items-center'>
                        <Button variant="primary" size="lg" onClick={() => clickSearch()} disabled={loading}>搜索</Button>
                    </Col>
                </Row>
                <Row className="resultArea">
                    {loading && <Loading />}
                    {!loading && data &&
                        <Container>
                            <Row>
                                <Col style={{ marginBottom: '1em', borderBottom: '1px solid' }}>
                                    当前显示第{data.number + 1}页 总计{data.totalPages}页 共{data.totalElements}位用户
                                </Col>
                            </Row>
                            <Row xs={5} md={5} className="myRow">
                                <Col xs={2} className="myCell d-flex justify-content-center align-items-center"><strong>序号</strong></Col>
                                <Col xs={3} className="myCell d-flex justify-content-center align-items-center"><strong>姓名</strong></Col>
                                <Col xs={3} className="myCell d-flex justify-content-center align-items-center"><strong>用户名</strong></Col>
                                <Col xs={2} className="myCell d-flex justify-content-center align-items-center"><strong>状态</strong></Col>
                                <Col xs={2} className="myCell d-flex justify-content-center align-items-center"><strong>操作</strong></Col>
                            </Row>
                            {
                                data.content.map((item, index) => {
                                    return (
                                        <Row xs={5} md={5} key={makeid(5)} className="myRow">
                                            <Col xs={2} className="text-break myCell d-flex justify-content-center align-items-center">{data.number * data.size + index + 1}</Col>
                                            <Col xs={3} className="text-break myCell d-flex justify-content-center align-items-center">{item.name}</Col>
                                            <Col xs={3} className="text-break myCell d-flex justify-content-center align-items-center">{item.username}</Col>
                                            <Col xs={2} className="text-break myCell d-flex justify-content-center align-items-center">{item.valid ? "正常" : "停用"}</Col>
                                            <Col xs={2} className="text-break myCell d-flex justify-content-center align-items-center">
                                                <DropdownButton variant="outline-secondary" className="dropdownBtnStyle"
                                                    title="操作"
                                                    size="sm" >
                                                    <DropdownItem className="dropdownItemStyle" href={'/admin/user/subscription?username=' + item.username + '&name=' + item.name}>
                                                        管理订阅
                                                    </DropdownItem>
                                                    {item.valid ?
                                                        <DropdownItem className="dropdownItemStyle" style={{ color: 'red' }} disabled={loading}
                                                            onClick={() => userStateChange(item.username, false)}>停用用户</DropdownItem>
                                                        :
                                                        <DropdownItem className="dropdownItemStyle" style={{ color: 'green' }} disabled={loading}
                                                            onClick={() => userStateChange(item.username, true)}>启用用户</DropdownItem>
                                                    }
                                                </DropdownButton>
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                        </Container>
                    }
                </Row>
                <Row className="pageArea">
                    <Col className='d-flex justify-content-center align-items-center'>
                        {!loading && data &&
                            <ShowPagination data={data} jumpFunction={search} />
                        }
                    </Col>
                </Row>
            </Container>
            <AddUserPage ref={addUserPageRef} />
        </AdminLayout>
    )
}